function fresh(response) {
  const headers = new Headers(response.headers);
  headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '') || '/';

    if (path === '/admin/login') {
      return Response.redirect(new URL('/admin', url), 302);
    }

    if (!path.includes('.')) {
      const assetUrl = new URL(request.url);
      assetUrl.pathname = path === '/' ? '/index.html' : `${path}/index.html`;
      const response = await env.ASSETS.fetch(new Request(assetUrl, request));
      if (response.status !== 404) return fresh(response);
    }

    return fresh(await env.ASSETS.fetch(request));
  },
};
