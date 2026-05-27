# Lush Lychees Delivery Studio

Prototype MVP for scheduled lychee delivery runs and an AI orchard scouting workflow.

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
- Admin delivery run planner with capacity and packing totals.
- AI Orchard Scout simulation for block notes, ripeness confidence, harvest window, and follow-up.
- SocialAI Studio instance for campaign angles, Facebook/Instagram drafts, hashtags, AI image prompts, and schedule slots.

## Production path

The same product shape can move into a Cloudflare-backed build with D1 tables for products, delivery areas, runs, orders, orchard scouting notes, social content drafts, and notification logs. ClickSend and Resend can handle delivery reminders after the producer approves the run rules. SocialAI Studio can then use the existing Penny Wise I.T social engine for brand voice, post generation, scheduling, and channel analytics.
