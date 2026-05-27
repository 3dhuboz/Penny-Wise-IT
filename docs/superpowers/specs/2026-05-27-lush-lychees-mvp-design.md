# Lush Lychees MVP Design

## Goal

Build a demonstrable MVP for Lush Lychees that shows how a local seasonal lychee farm can sell picked-to-order boxes through scheduled delivery runs while introducing a practical production-side AI tool.

## Product Shape

The MVP is a standalone prototype called **Lush Lychees Delivery Studio**. It should be suitable for showing the producer before any payment, inventory, or live farm-data commitments are made.

The prototype has four linked surfaces:

- Customer ordering: season status, delivery-area lookup, box selection, and pre-order confirmation.
- Delivery planning: admin view of runs, cut-off times, capacity, order totals, and packing totals.
- AI Orchard Scout: photo-based orchard note flow for ripeness, pest/damage observations, and harvest-window guidance.
- SocialAI Studio: farm-specific content engine that turns delivery runs, harvest notes, and box availability into ready-to-post seasonal campaigns.
- Owner backend: clickable admin area that shows orders, editable runs, editable box pricing, customer comms, SocialAI calendar, and ROI placeholders.

## Scope

In scope:

- A polished local web prototype under `packages/lush-lychees-mvp`.
- Real interactive local state for suburb lookup, order selection, run capacity, and AI scout result simulation.
- A branded SocialAI Studio instance for Lush Lychees with post drafts, scheduling prompts, channels, hashtags, and image prompts.
- Welded-in placeholders that explicitly explain time and financial gains over the current manual delivery workflow: fewer delivery questions, fewer admin hours, structured demand capture, and confirmed packing counts.
- Queensland/local delivery examples that can be changed later by the producer.
- Copy grounded in Lush Lychees' current positioning: family farm, farm gate, seasonal boxes, collection/delivery.
- A production-safe AI framing: assistive crop note-taking, not agronomy replacement.

Out of scope for this first slice:

- Payment gateway integration.
- Live delivery address validation.
- Real AI model calls.
- Inventory management against actual orchard harvest records.
- SMS/email sending through ClickSend or Resend.
- Wiring into the existing Penny Wise I.T customer portal.

## Architecture

The MVP is an isolated Vite React app. It uses static sample data and client-side state so it can run locally and be shown immediately. The package boundary avoids touching the existing dirty Penny Wise I.T portal files.

Future production implementation can promote the same concepts into a Cloudflare app with D1 tables for delivery areas, delivery runs, products, orders, orchard scouting notes, and customer notifications.

## Data Flow

Customer ordering:

1. Customer enters a suburb or postcode.
2. The app matches it against configured delivery runs.
3. Customer chooses a box size and quantity.
4. The app shows selected run, cut-off, delivery fee, item total, and confirmation state.

Delivery planning:

1. Admin selects a run.
2. The app displays run capacity, current reserved boxes, order count, route suburbs, and packing totals.
3. Admin can increment sample reserved boxes to demonstrate capacity behavior.

AI Orchard Scout:

1. Grower selects block, row, variety, and orchard observation.
2. Grower triggers a simulated scout assessment.
3. The app returns ripeness confidence, harvest window, quality notes, and recommended follow-up.

SocialAI Studio:

1. The grower selects a campaign angle such as delivery-run launch, harvest update, farm-gate weekend, last-chance cut-off, or recipe/storage tip.
2. The app uses the selected delivery run and orchard block context to generate platform-ready campaign copy.
3. The grower can preview the caption, hashtags, image prompt, and schedule slots for Facebook and Instagram.

## Error Handling

- Unknown suburbs show a waitlist state rather than a dead end.
- Sold-out capacity states show a farm-gate/waitlist fallback.
- AI scout results are clearly worded as assistive observations.
- SocialAI content is presented as editable drafts, not auto-published content.
- The app avoids promising live checkout, delivery dispatch, or real agronomy diagnosis.
- The app avoids promising live social posting until platform connections and Meta permissions are approved.

## Testing

Verification should include:

- `npm install` in `packages/lush-lychees-mvp`.
- `npm run build`.
- Local browser smoke test of the default screen.
- Suburb lookup for a matched suburb and an unmatched suburb.
- Product selection and quantity changes.
- Admin capacity increment.
- AI Orchard Scout simulated assessment.
- SocialAI Studio campaign generation and channel toggles.
