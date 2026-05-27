const STORAGE_KEY = "lush-lychees-delivery-studio-v2";

export const demoPin = "4702";

export function createInitialStore(products, runs) {
  return {
    settings: {
      seasonStatus: "Pre-orders open",
      farmGateMessage: "Farm gate collection and local delivery runs are both available during harvest.",
      deliveryPromise: "Customers only see delivery options the farm has opened.",
      publicNote: "Demo mode: payments, SMS and live AI are production add-ons."
    },
    products,
    runs: runs.map((run) => ({ ...run, status: "Open" })),
    orders: [
      {
        id: "ord-1007",
        ref: "LL-1007",
        customerName: "Sarah M.",
        mobile: "0400 111 222",
        email: "sarah@example.com",
        address: "Yeppoon QLD",
        suburb: "Yeppoon",
        productId: "three-kg",
        productName: "3kg family box",
        quantity: 2,
        deliveryFee: 12,
        itemTotal: 96,
        total: 108,
        runId: "capricorn-coast",
        runName: "Capricorn Coast",
        status: "Reserved",
        notes: "Leave near front verandah if nobody is home.",
        createdAt: "Today 8:45am"
      },
      {
        id: "ord-1006",
        ref: "LL-1006",
        customerName: "Alicia P.",
        mobile: "0400 333 444",
        email: "alicia@example.com",
        address: "Frenchville QLD",
        suburb: "Frenchville",
        productId: "gift",
        productName: "Lychee gift box",
        quantity: 1,
        deliveryFee: 8,
        itemTotal: 32,
        total: 40,
        runId: "rockhampton-north",
        runName: "Rockhampton North",
        status: "Packed",
        notes: "Birthday gift. Please keep presentation box clean.",
        createdAt: "Yesterday 6:20pm"
      },
      {
        id: "lead-203",
        ref: "WAIT-203",
        customerName: "Megan T.",
        mobile: "0400 555 666",
        email: "megan@example.com",
        address: "Mount Morgan QLD",
        suburb: "Mount Morgan",
        productId: "five-kg",
        productName: "5kg share box",
        quantity: 1,
        deliveryFee: 0,
        itemTotal: 76,
        total: 76,
        runId: null,
        runName: "Waitlist",
        status: "Waitlist",
        notes: "Wants delivery if enough Mount Morgan orders come in.",
        createdAt: "Yesterday 3:10pm"
      }
    ],
    socialCalendar: [],
    activityLog: [
      "Capricorn Coast run opened with 110 box capacity.",
      "Rockhampton North cut-off set to Tuesday 6:00pm.",
      "Mount Morgan waitlist request captured for future run planning."
    ]
  };
}

export function loadStore(products, runs) {
  if (typeof window === "undefined") {
    return createInitialStore(products, runs);
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createInitialStore(products, runs);
    }

    const parsed = JSON.parse(raw);
    return {
      ...createInitialStore(products, runs),
      ...parsed,
      settings: { ...createInitialStore(products, runs).settings, ...parsed.settings }
    };
  } catch {
    return createInitialStore(products, runs);
  }
}

export function saveStore(store) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }
}

export function resetStore() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}
