const { Client, Environment } = require('square');

let squareClient = null;

function getSquareClient() {
  if (squareClient) return squareClient;
  
  const accessToken = process.env.SQUARE_ACCESS_TOKEN;
  if (!accessToken) {
    console.warn('[Square] No SQUARE_ACCESS_TOKEN configured — Square features disabled');
    return null;
  }

  squareClient = new Client({
    accessToken,
    environment: process.env.SQUARE_ENVIRONMENT === 'production' 
      ? Environment.Production 
      : Environment.Sandbox
  });

  return squareClient;
}

function getLocationId() {
  return process.env.SQUARE_LOCATION_ID || '';
}

// ══════════════════════════════════════════════
// Square Customers
// ══════════════════════════════════════════════

async function findOrCreateSquareCustomer({ email, firstName, lastName, company, phone }) {
  const client = getSquareClient();
  if (!client) return null;

  try {
    // Search for existing customer
    const searchRes = await client.customersApi.searchCustomers({
      query: {
        filter: {
          emailAddress: { exact: email }
        }
      }
    });

    if (searchRes.result.customers?.length > 0) {
      return searchRes.result.customers[0];
    }

    // Create new customer
    const createRes = await client.customersApi.createCustomer({
      emailAddress: email,
      givenName: firstName || '',
      familyName: lastName || '',
      companyName: company || '',
      phoneNumber: phone || '',
      referenceId: email,
      note: 'Created by Penny Wise I.T platform'
    });

    return createRes.result.customer;
  } catch (err) {
    console.error('[Square] Customer error:', err.message || err);
    return null;
  }
}

// ══════════════════════════════════════════════
// Square Invoices
// ══════════════════════════════════════════════

async function createSquareInvoice({ squareCustomerId, lineItems, dueDate, title, invoiceNumber, branding }) {
  const client = getSquareClient();
  if (!client) return null;

  const locationId = getLocationId();
  if (!locationId) {
    console.error('[Square] No SQUARE_LOCATION_ID configured');
    return null;
  }

  try {
    // First create an order
    const orderLineItems = lineItems.map(item => ({
      name: item.description,
      quantity: String(item.quantity || 1),
      basePriceMoney: {
        amount: BigInt(Math.round(item.unitPrice * 100)), // Square uses cents
        currency: 'AUD'
      }
    }));

    const orderRes = await client.ordersApi.createOrder({
      order: {
        locationId,
        lineItems: orderLineItems,
        state: 'OPEN'
      },
      idempotencyKey: `order-${invoiceNumber}-${Date.now()}`
    });

    const orderId = orderRes.result.order.id;

    // Create the invoice
    const invoiceRes = await client.invoicesApi.createInvoice({
      invoice: {
        locationId,
        orderId,
        primaryRecipient: {
          customerId: squareCustomerId
        },
        paymentRequests: [{
          requestType: 'BALANCE',
          dueDate: dueDate ? new Date(dueDate).toISOString().split('T')[0] : undefined,
          automaticPaymentSource: 'NONE',
          reminders: [
            { relativeScheduledDays: -3, message: `Reminder: Your invoice from ${branding?.businessName || 'Penny Wise I.T'} is due in 3 days.` },
            { relativeScheduledDays: 0, message: `Your invoice from ${branding?.businessName || 'Penny Wise I.T'} is due today.` },
            { relativeScheduledDays: 7, message: `Your invoice from ${branding?.businessName || 'Penny Wise I.T'} is now overdue.` }
          ]
        }],
        deliveryMethod: 'EMAIL',
        invoiceNumber: invoiceNumber || undefined,
        title: title || 'Invoice',
        description: `Invoice from ${branding?.businessName || 'Penny Wise I.T'}`,
        acceptedPaymentMethods: {
          card: true,
          squareGiftCard: false,
          bankAccount: true,
          buyNowPayLater: false,
          cashAppPay: false
        }
      },
      idempotencyKey: `inv-${invoiceNumber}-${Date.now()}`
    });

    return {
      invoice: invoiceRes.result.invoice,
      orderId
    };
  } catch (err) {
    console.error('[Square] Create invoice error:', JSON.stringify(err.result?.errors || err.message || err));
    return null;
  }
}

async function publishSquareInvoice(squareInvoiceId, version) {
  const client = getSquareClient();
  if (!client) return null;

  try {
    const res = await client.invoicesApi.publishInvoice(squareInvoiceId, {
      version: version || 0,
      idempotencyKey: `pub-${squareInvoiceId}-${Date.now()}`
    });
    return res.result.invoice;
  } catch (err) {
    console.error('[Square] Publish invoice error:', JSON.stringify(err.result?.errors || err.message || err));
    return null;
  }
}

async function cancelSquareInvoice(squareInvoiceId, version) {
  const client = getSquareClient();
  if (!client) return null;

  try {
    const res = await client.invoicesApi.cancelInvoice(squareInvoiceId, {
      version: version || 0
    });
    return res.result.invoice;
  } catch (err) {
    console.error('[Square] Cancel invoice error:', JSON.stringify(err.result?.errors || err.message || err));
    return null;
  }
}

async function getSquareInvoice(squareInvoiceId) {
  const client = getSquareClient();
  if (!client) return null;

  try {
    const res = await client.invoicesApi.getInvoice(squareInvoiceId);
    return res.result.invoice;
  } catch (err) {
    console.error('[Square] Get invoice error:', err.message || err);
    return null;
  }
}

module.exports = {
  getSquareClient,
  getLocationId,
  findOrCreateSquareCustomer,
  createSquareInvoice,
  publishSquareInvoice,
  cancelSquareInvoice,
  getSquareInvoice
};
