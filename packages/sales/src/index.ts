// PennyWiseIT Sales App — serves the salesperson portal + public apply page + public wins wall
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import salesHtml from '../SALES.html';
import applyHtml from '../APPLY.html';
import winsHtml from '../WINS.html';
import helpHtml from '../HELP.html';
import privacyHtml from '../PRIVACY.html';
import termsHtml from '../TERMS.html';
import onboardHtml from '../ONBOARD.html';

const app = new Hono();

app.use('*', cors());

app.get('/', (c) => c.html(salesHtml));
app.get('/apply', (c) => c.html(applyHtml));
app.get('/join', (c) => c.html(applyHtml));
app.get('/wins', (c) => c.html(winsHtml));
app.get('/help', (c) => c.html(helpHtml));
app.get('/privacy', (c) => c.html(privacyHtml));
app.get('/terms', (c) => c.html(termsHtml));
app.get('/onboard', (c) => c.html(onboardHtml));
app.get('/sample-leads.csv', (c) => {
  const csv = `business_name,contact_name,phone,email,app_type,notes\nJoe's BBQ,Joe Smith,0412345678,joe@joebbq.com.au,Food Truck App,Met at markets, interested in online orders\nSarah's Boutique,Sarah Chen,,sarah@boutique.au,Online Store,Saw her on Instagram\n`;
  return c.text(csv, 200, { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="sample-leads.csv"' });
});

app.get('/manifest.webmanifest', (c) => c.json({
  name: 'Penny Wise I.T Sales',
  short_name: 'PWS',
  description: 'Penny Wise I.T sales portal — find leads, send quotes, close deals.',
  start_url: '/',
  display: 'standalone',
  background_color: '#0b0f1a',
  theme_color: '#4f8ef7',
  icons: [
    { src: 'https://pub-e9f06ab167a44125b75d7528e2271086.r2.dev/icon-dark.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
    { src: 'https://pub-e9f06ab167a44125b75d7528e2271086.r2.dev/icon-dark.png', sizes: '192x192', type: 'image/png' },
  ],
}, 200, { 'Cache-Control': 'public, max-age=3600' }));

app.get('/health', (c) => c.json({ status: 'ok', app: 'pennywiseit-sales', version: '1.2.0' }));

export default { fetch: app.fetch };
