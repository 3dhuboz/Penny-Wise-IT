# Penny Wise I.T Sales Portal — Handover

**Last updated**: 2026-04-25
**Worktree**: `.claude/worktrees/trusting-bose/`
**Status**: Production. ~30 features shipped this session. Everything below is live unless marked otherwise.

---

## 🌐 Live URLs

| | URL | Purpose |
|---|---|---|
| **Sales portal** | https://sales.pennywiseit.com.au | Salesperson + admin login, all rep tools |
| **Demos / customer-facing** | https://demos.pennywiseit.com.au | Public demos, drafts, customer portals, invoices |
| **Validator API** | https://pennywiseit-validator.steve-700.workers.dev | All backend endpoints |
| **Apply page** | https://sales.pennywiseit.com.au/apply | Public application form |
| **Onboard via invite** | https://sales.pennywiseit.com.au/onboard?token=... | Magic-link rep onboarding |

## 🏗️ Architecture

Three Cloudflare Workers, one shared D1, two R2 buckets:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ pennywiseit-    │     │ pennywiseit-    │     │ pennywiseit-    │
│ sales           │     │ demos           │     │ validator       │
│ (HTML portal)   │     │ (HTML public)   │     │ (API + cron)    │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         └───────────────────────┴───────────────────────┘
                                 │
                       ┌─────────┴────────┐
                       │  composer-db (D1) │
                       │ + pennywiseit-    │
                       │   drafts (R2)     │
                       │ + pennywiseit-    │
                       │   portfolio (R2)  │
                       └───────────────────┘
```

- **sales** worker bundles `SALES.html`, `APPLY.html`, `ONBOARD.html`, `WINS.html`, `HELP.html`, etc. and serves them at the right routes
- **demos** worker renders prospect-facing draft pages, customer portals, contracts, intake forms, walkthroughs, invoices
- **validator** worker holds 100% of the API + the hourly cron + Workers AI (Llama 3.1 8B) integrations

**D1 database**: `composer-db` (uuid `02e349ac-6932-4d38-a0b1-08f917086124`)
**R2 buckets**: `pennywiseit-portfolio` (whitelabel screenshots), `pennywiseit-drafts` (prospect logos + intake uploads)

## 📁 File map

```
packages/
├── validator/          # The brain. All API + cron + AI lives here.
│   ├── src/index.ts    # ~6500 lines, all endpoints + cron handlers
│   ├── src/types.ts    # Env type — secrets list lives here
│   └── wrangler.toml   # D1 binding, R2 binding, cron schedule (0 * * * *)
│
├── sales/              # The salesperson portal (logged-in side)
│   ├── SALES.html      # ~7800 lines, the entire portal in one file
│   ├── APPLY.html      # Public apply form
│   ├── ONBOARD.html    # Self-onboarding via invite token
│   ├── WINS.html       # Public wins wall (testimonials)
│   ├── HELP.html       # Help / FAQ
│   ├── PRIVACY.html    # Privacy policy
│   ├── TERMS.html      # Terms
│   └── src/index.ts    # Tiny Hono router, just maps URLs to HTML files
│
├── demos/              # Public-facing pages (drafts, customer portal, etc.)
│   ├── products.ts     # PRODUCT config — 8 whitelabels with branding/copy/pricing
│   ├── src/index.ts    # Hono router — /draft/:slug, /client/:token, /invoice/:num, /r/:code
│   ├── src/demo-render.ts   # Per-product interactive demos (single-product /p/:id)
│   ├── src/draft-render.ts  # Pitch Studio multi-product drafts + flyer + 6 vibe presets
│   └── src/client-render.ts # Customer portal, contract, intake, walkthrough pages
│
├── composer/, registry/, dashboard/, features/  # Other parts of the broader Penny Wise IT system
```

## 🗄️ D1 schema (post-session additions)

| Table | Purpose |
|---|---|
| `salespeople` | Reps. Has `bank_*_last4`, `abn`, `company_email`, `role`, `commission_pct`, `monthly_comm_pct`, `scan_location` etc |
| `sales_sessions` | Auth tokens for reps |
| `rep_invites` | Magic-link self-onboarding tokens (14-day expiry) |
| `leads` | Sales pipeline (new → contacted → demo → proposal → won / lost) |
| `auto_scan_leads` | AI-found leads from cron. Has `quality_score`, `dismissed_reason`, `dismissed_at` |
| `lead_scans`, `lead_activity`, `lead_comments`, `saved_scans`, `paused_sources`, `checklist_items` | Lead support tables |
| `messages` | In-app inbox between admin ↔ reps (broadcasts + 1:1) |
| **`drafts`** | Pitch Studio — prospect-specific multi-product drafts. Has `vibe`, `design_brief`, `facebook_url` |
| **`draft_feedback`** | Per-section thumbs/comments from prospects |
| **`customers`** | Promoted from leads on draft approval. Has `client_token` (magic link), `health_status`, `monthly_amount`, `next_invoice_at`, `monthly_paused`, `referral_code`, `referred_by_customer_id`, `referral_credits_earned/applied`, `testimonial_opt_in/quote` |
| **`projects`** | One per build. Stage state machine: `approved → contract_sent → contract_signed → deposit_invoiced → deposit_paid → intake_open → intake_received → building → walkthrough_sent → walkthrough_approved → final_invoiced → final_paid → live` |
| **`contracts`** | Versioned HTML SoW with e-signature (name + IP + timestamp) |
| **`invoices`** | Deposit / final / monthly. Has `stripe_session_id`, `stripe_payment_intent_id` (dormant unless Stripe configured) |
| **`intake_forms`** | Per-project schema-driven info-gathering form |
| **`customer_events`** | Activity timeline. Auto-logged from every key event + manual `note` rows |
| `commission_payouts` | Reps' payout history |
| `applications` | Public sales applications |
| `apps`, `validation_runs`, `validation_checks` | Health checks for OTHER parts of Penny Wise (not the sales portal itself) |
| `team_settings`, `app_secrets` | Misc config |

## ⏰ Cron jobs (every hour, scheduled = `0 * * * *`)

The validator runs every hour. Inside, conditional logic fires specific tasks at specific times (UTC):

| When (AEST) | Task | Function |
|---|---|---|
| Every hour | Lead scanner per rep | `runAutoScans()` |
| 9am daily (23 UTC) | Re-engagement / onboarding tutor / admin digest / auto-archive / **pipeline reminders** / **draft followups** / **monthly billing** / **customer health checks** | Multiple |
| Mon–Fri 8am | Morning briefing | `runAmBriefing()` |
| Friday 5pm | Weekly rep digest | `runFridayDigest()` |
| Sunday 6pm | Weekly reflection (AI-coached planning) | `runSundayReflection()` |

**Pipeline reminders**: day 3 / 7 / 12 / 14 of intake-open clock; >5 days walkthrough-sent
**Monthly billing**: For each customer with live projects, generates a `monthly` invoice 30 days after `next_invoice_at`
**Health checks**: HTTP-tests each customer's domain. 3 consecutive fails = `down`. 30+ days unpaid monthly = `at_risk_payment`

## 🔐 Auth model

Three layers:

1. **`VALIDATOR_SECRET`** (admin / dashboard auth) — Bearer token. Used by `/api/apps`, `/api/admin/*`, `/api/messages`, `/api/salespeople`. Set as wrangler secret.
2. **Salesperson tokens** (sessions) — Bearer token from `/salesperson/auth`. Used by `/salesperson/*`, `/api/projects`, `/api/customers`, `/api/invoices`, `/api/drafts`, `/api/invites`, `/api/playbook/*`. Stored in `sales_sessions`.
3. **Public token-gated** — magic-link tokens in URLs. Used by `/api/public/client/:token/*`, `/api/public/drafts/:slug/*`, `/api/public/invoice/:num`, `/api/public/invite/:token/*`, `/api/public/referral/:code`, `/api/public/stripe-webhook`. Anyone with the token can act.

Auth middleware (validator/src/index.ts line ~51) skips the public + salesperson-token paths so the master VALIDATOR_SECRET only protects true admin endpoints.

## 🔑 Secrets / env vars

Set as wrangler secrets (`npx wrangler secret put NAME` in the validator package):

| Name | Status | Purpose |
|---|---|---|
| `VALIDATOR_SECRET` | ✅ set | Master admin auth |
| `CF_ACCOUNT_ID` | ✅ set | For Cloudflare Email Routing API |
| `CF_API_TOKEN` | ✅ set | Same. Token must have `Email Routing - Edit` scope |
| `RESEND_API_KEY` | ✅ set | All transactional emails (welcome, contract, invoice, reminders) — needs `hello@pennywiseit.com.au` verified in Resend |
| `SERPER_API_KEY` | ✅ set | Lead scanner Google search |
| `STRIPE_SECRET_KEY` | ⚠️ **NOT SET** | Optional — enables one-click invoice card payment |
| `STRIPE_WEBHOOK_SECRET` | ⚠️ **NOT SET** | Optional — verifies inbound Stripe payment events |
| `PENNYWISEIT_ZONE_ID` | ✅ in wrangler.toml as var | Zone for Email Routing rules |

If you want Stripe one-click pay live, run:
```
cd packages/validator
npx wrangler secret put STRIPE_SECRET_KEY        # paste sk_...
npx wrangler secret put STRIPE_WEBHOOK_SECRET   # paste whsec_...
```
Then in Stripe dashboard add a webhook endpoint pointing to:
`https://pennywiseit-validator.steve-700.workers.dev/api/public/stripe-webhook`
Subscribe to: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `payment_intent.succeeded`.

## 🚀 Deploying

Three workers — usually deploy in order: validator → demos → sales:

```bash
cd packages/validator && npx wrangler deploy
cd ../demos && npx wrangler deploy
cd ../sales && npx wrangler deploy
```

If the OAuth token has expired (~24h validity):
```bash
npx wrangler login
```

Each deploy takes ~5-10 seconds. The wrangler MCP server is wired in this project too; inside Claude Code you can also use the D1 / R2 MCP tools directly.

## 🧠 Major features shipped in this session

### Lead generation
- AI lead scanner (Llama 3.1 8B) with hourly cron, hot/warm/cold confidence
- Hardened filters: ~150 competitor phrases, ~100 off-topic-quote markers, dev-community URL blocklist (r/forhire, r/webdev etc), hobbyist phrase rejection
- **Quality score 0–100** combining confidence + signal strength + geo match + contact-info presence
- **Prompt-injection resistance** — snippets sanitised + wrapped in `<<<...>>>` delimiters before AI
- **Hallucination check** — AI-returned business names verified against source text
- **Dismiss-with-reason** — chip picker (spam / wrong service / too old / not in area / etc.) for tuning
- "Find leads now" + "Make this hourly" + "From screenshot" (image-OCR) on the dashboard
- Per-rep geo routing of auto-scan leads via `scan_location`
- CSV bulk import of leads

### Pitch Studio (prospect-specific drafts)
- Multi-product custom drafts at `/draft/<slug>` themed with prospect's logo/colours/vibe
- 6 vibe presets (minimal/gritty/premium/fun/corporate/bold) — different fonts, density, textures
- **AI Suggest from URL** — paste a Facebook/business URL, AI fills business name + products + vibe + tagline + design brief in 10 sec
- **Auto-extract brand colours from logo** — pure-JS pixel sampler
- Premium one-page flyer at `/draft/<slug>/flyer` with per-product ROI maths + huge dollar headlines
- Per-section feedback (👍 👎 comment) — auto-emails the rep
- "Approve & build it for real" button creates customer + contract + auto-emails the portal link

### Post-approval pipeline (the build pipeline)
- HTML contract (e-sign with name + IP + timestamp), 14-day intake clock, 24-hour SLA, working-hours commitment
- Schema-driven intake form per product (food-truck → menu, tradie → services, etc)
- Walkthrough page (Loom/YouTube embed) + customer-approval flow
- Auto-issued invoices (deposit + final + monthly recurring) with bank-transfer reference numbers
- **Stripe one-click card payment** (dormant — set secrets to activate). Auto-marks paid via webhook
- **Recurring monthly billing** — daily cron auto-issues monthly invoices for live customers
- **Customer health monitoring** — daily uptime check + payment-overdue flagging + email Steve on changes

### Customer side
- Magic-link customer portal at `/client/<token>` — one-page handle-everything
- Sign contract → pay deposit → fill intake → watch walkthrough → pay final → live
- "✏️ Request a change" form (categorised, urgency, emails Steve + rep)
- "📝 Your project history" timeline (filtered, customer-facing only)
- "🎁 Refer & earn" panel with code + share link + tally
- "💬 Help us out" testimonial opt-in (only when stage=live)

### Salesperson side
- Magic-link self-onboarding via `/onboard?token=...` (3-step setup: account / location / bank)
- Auto-issues `username@pennywiseit.com.au` via Cloudflare Email Routing
- 8-step in-app onboarding tour (auto-fires on first login)
- 5-tab restructured nav: 🏠 Today · 🎯 Leads · ✨ Pitch · 📚 Playbook · 💰 Money + utility icons (🔔 ⚙️ 🛡️)
- ✨ Pitch Studio + 📝 Quick Quote + 📦 Products under one Pitch tab
- 🔨 My Builds + 💰 Commission under one Money tab
- 📚 Playbook tab: AI Pitch Generator + AI Follow-up Writer + AI Objection Handler + static scripts
- Mobile-responsive pass — 768px + 420px breakpoints

### Admin side
- Build Pipeline kanban (8 stage buckets, blocker badges, MRR + setup-in-flight + live-customers tiles)
- Customers roster with health badges + filter on at-risk
- Per-customer detail page: contract status, invoice history, intake responses, **activity timeline**, **referral panel + apply-credit button**, **monthly billing controls**, **manual health check**, project drilldown
- Magic-link rep invites + Outstanding invites view
- Lead rejection-patterns endpoint (for tuning)

### Referral program (manual)
- Auto-generated codes per customer (`PICKLE-NICK-X8K2` format)
- Short URL `/r/<CODE>` with branded landing page + 30-day cookie
- Cookie auto-applies referral on draft approval
- Both customer + Steve emailed on conversion
- Admin "Apply 1 free month" button pushes `next_invoice_at` +30 days, emails customer

## ⚠️ Known issues / TODOs

| Item | Severity | Notes |
|---|---|---|
| Resend `hello@pennywiseit.com.au` sender | **Verify in Resend dashboard** | If not verified, all auto-emails (welcome, contract, invoice, reminders) silently fail |
| `CF_API_TOKEN` Email Routing scope | Verify | Token needs `Zone › Email Routing › Edit` for pennywiseit.com.au + `Account › Email Routing Addresses › Edit` |
| Stripe secrets | Optional | Card-payment dormant until set |
| Krystle role | Already `owner` | Can demote to `salesperson` if you want only Steve as admin |
| Steve's password (username `H`) | Unknown to me | Steve can reset via Settings if needed |
| Steve role | `owner` | Manually promoted during this session |
| `referral_code` for existing customers | Backfilled on first portal view | Via `ensureReferralCode()` helper |
| Public testimonial wall (`WINS.html`) | Filter not yet applied | `/api/public/recent-wins` returns ALL won leads. Need to filter to `customers.testimonial_opt_in = 1` to use real opt-in customer wins |
| `npx wrangler login` token | Expires in ~24h | Re-auth occasionally |

## 🧪 End-to-end smoke test (~5 min)

1. **Login** as admin at sales.pennywiseit.com.au
2. **Send invite**: Admin → ✉️ Invite salesperson → fill in your own personal email → check inbox → click link → walk through `/onboard?token=...` setup
3. **Build a draft**: ✨ Pitch → + New draft → AI suggest from a URL (e.g. a real local business FB) → tweak → drop a logo → create. Open the link in incognito.
4. **Approve as prospect**: Click ✅ Approve → check email arrives → open portal link
5. **Sign contract** in the customer portal → check that deposit invoice appears
6. **Mark paid as admin**: Customers → click the customer → click Mark Paid on deposit invoice → check stage advances to `intake_open`
7. **Fill intake** as customer (back in incognito)
8. **Set walkthrough URL** as admin: Customer detail → Walkthrough URL field → paste any YouTube link → Send
9. **Approve walkthrough** as customer → final invoice fires
10. **Mark final paid + Mark LIVE** with a domain → customer goes to LIVE stage, monthly billing kicks off

After test, clean up via SQL or just delete the test draft.

## 📝 How to add new features cleanly

The architecture has a consistent pattern that's worth following:

1. **D1 first**: Add tables/columns via `mcp__daeb8e03-...__d1_database_query`. Keep backwards-compatibility — never DROP columns
2. **Validator endpoints**: Add at the bottom of `validator/src/index.ts`. If public, prefix with `/api/public/`. If salesperson-auth, anywhere under `/api/` (auth middleware skip-list at top of file). Use `getSalespersonFromToken()` for auth, `logCustomerEvent()` for timeline
3. **HTML/UI**: For sales portal → add to `SALES.html` (single big file). For prospect-facing → add to `demos/src/*-render.ts`. For customer-facing → `client-render.ts`
4. **Cron**: Add an `async function runX(env)` near other cron handlers, then `ctx.waitUntil(runX(env))` in the right time block in the `scheduled()` handler
5. **Typecheck**: `cd packages/validator && npx tsc --noEmit --skipLibCheck --types @cloudflare/workers-types src/index.ts`
6. **Deploy**: Three workers as above

Hot-reload pattern: edit → typecheck → deploy → hard-refresh the browser.

## 📞 Quick command reference

```bash
# Set up new wrangler auth
npx wrangler login

# Deploy single worker
cd packages/<worker> && npx wrangler deploy

# Set a secret
cd packages/validator && npx wrangler secret put NAME

# Tail logs (live)
cd packages/<worker> && npx wrangler tail

# D1 query (one-shot)
cd packages/validator && npx wrangler d1 execute composer-db --command "SELECT count(*) FROM customers"

# R2 upload
npx wrangler r2 object put pennywiseit-portfolio/foo.png --file=foo.png --content-type=image/png --remote
```

## 🔗 Cloudflare dashboard direct links (open these on desktop)

- Workers: https://dash.cloudflare.com/?to=/:account/workers
- D1: https://dash.cloudflare.com/?to=/:account/workers/d1/databases/composer-db
- R2: https://dash.cloudflare.com/?to=/:account/r2
- Email Routing: https://dash.cloudflare.com/?to=/:account/email/routing/routes
- Stripe (when ready): https://dashboard.stripe.com/

---

**Anything else** — read `validator/src/index.ts` top-to-bottom (it's annotated heavily) or open this handover in Claude Code for live context.
