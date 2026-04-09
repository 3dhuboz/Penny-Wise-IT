// PennyWiseIT Command Centre — serves the admin dashboard
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import dashboardHtml from '../index.html';

const app = new Hono();

app.use('*', cors());

app.get('/', (c) => {
  return c.html(dashboardHtml);
});

app.get('/health', (c) => {
  return c.json({ status: 'ok', app: 'pennywiseit-dashboard', version: '1.0.0' });
});

export default { fetch: app.fetch };
