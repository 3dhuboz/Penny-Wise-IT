// PennyWiseIT Sales App — serves the salesperson portal
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import salesHtml from '../SALES.html';

const app = new Hono();

app.use('*', cors());

app.get('/', (c) => {
  return c.html(salesHtml);
});

app.get('/health', (c) => {
  return c.json({ status: 'ok', app: 'pennywiseit-sales', version: '1.0.0' });
});

export default { fetch: app.fetch };
