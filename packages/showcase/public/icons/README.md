# Showcase PWA icons

Drop the following files into this directory before deploying:

- `icon-192.png` — 192x192 PNG, "any maskable" (safe-zone aware)
- `icon-512.png` — 512x512 PNG, "any maskable" (safe-zone aware)

Both are referenced from `/public/manifest.json` at `/icons/icon-192.png` and `/icons/icon-512.png`.

These files are served as-is by the Cloudflare Workers `[assets]` binding configured in `wrangler.toml`, so no code change is needed once they're in place — just `wrangler deploy`.

Until the real artwork lands, the manifest will 404 these paths and PWA installation will be degraded but the site itself still works.
