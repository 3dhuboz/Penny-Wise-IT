# Lush Lychees Delivery Studio

Prototype MVP for a seasonal lychee operating app: orchard story, customer ordering, driver delivery runs, owner admin, SocialAI Studio, and AI orchard scouting.

This is a clickable MVP preview only. It is not the real Lush Lychees app, and all orders, driver GPS, payments, SMS/email, SocialAI content, and orchard AI outputs are simulated.

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

- Simpler four-part navigation: Sell, Deliver, Manage, and SocialAI.
- About-the-orchard hero section based on the public Lush Lychees orchard story.
- Customer suburb/postcode lookup against configured delivery runs.
- Seasonal box selection with quantity and total calculation.
- Clickable demo checkout that creates an order or waitlist lead in the admin backend.
- Driver app view with run selection, stops, customer call links, notes, delivery status actions, and an animated customer tracking map with truck/ETA preview.
- Admin delivery run planner with capacity and packing totals.
- Admin backend with demo PIN, order status controls, editable runs, editable box pricing, driver handoff language, customer message preview, and SocialAI calendar.
- AI Orchard Scout simulation for block notes, ripeness confidence, harvest window, and follow-up.
- SocialAI Studio instance for campaign angles, Facebook/Instagram drafts, hashtags, AI image prompts, and schedule slots.
- Owner-facing impact cards for time saved, delivery questions answered before inbox contact, structured demand captured, and driver-ready delivery lists.

## Production path

The same product shape can move into a Cloudflare-backed build with D1 tables for products, delivery areas, runs, orders, orchard scouting notes, social content drafts, and notification logs. ClickSend and Resend can handle delivery reminders after the producer approves the run rules. SocialAI Studio can then use the existing Penny Wise I.T social engine for brand voice, post generation, scheduling, and channel analytics.
