# Lush Lychees Delivery Studio

Prototype MVP for scheduled lychee delivery runs and an AI orchard scouting workflow.

## Public demo

- URL: https://lush-lychees-mvp.pages.dev
- Admin demo PIN: `4702` (blank PIN also opens the backend for demo speed)

## Run locally

```powershell
npm install
npm run dev
```

Open the local Vite URL shown in the terminal.

## Build

```powershell
npm run build
```

## Prototype coverage

- Customer suburb/postcode lookup against configured delivery runs.
- Seasonal box selection with quantity and total calculation.
- Clickable demo checkout that creates an order or waitlist lead in the admin backend.
- Admin delivery run planner with capacity and packing totals.
- Admin backend with demo PIN, order status controls, editable runs, editable box pricing, customer message preview, and SocialAI calendar.
- AI Orchard Scout simulation for block notes, ripeness confidence, harvest window, and follow-up.
- SocialAI Studio instance for campaign angles, Facebook/Instagram drafts, hashtags, AI image prompts, and schedule slots.
- Welded-in delivery ROI placeholders that explicitly compare the app against today's likely manual DMs, calls, Facebook messages, and spreadsheet sorting.
- Owner-facing placeholders for time saved, delivery questions avoided, structured demand captured, and confirmed box counts before picking starts.

## Production path

The same product shape can move into a Cloudflare-backed build with D1 tables for products, delivery areas, runs, orders, orchard scouting notes, social content drafts, and notification logs. ClickSend and Resend can handle delivery reminders after the producer approves the run rules. SocialAI Studio can then use the existing Penny Wise I.T social engine for brand voice, post generation, scheduling, and channel analytics.
