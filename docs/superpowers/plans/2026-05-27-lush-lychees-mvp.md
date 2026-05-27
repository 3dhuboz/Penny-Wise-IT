# Lush Lychees MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an isolated, polished Lush Lychees MVP prototype for scheduled lychee delivery runs, a clickable owner admin backend, driver delivery app, AI orchard scouting, and a farm-specific SocialAI Studio instance.

**Architecture:** Create a standalone Vite React app under `packages/lush-lychees-mvp` with static data and client-side state. Keep it separate from the existing Penny Wise I.T portal so the current dirty worktree is not disturbed. SocialAI Studio runs as a local demonstrator that drafts editable content from delivery-run and orchard-scout context. The demo backend persists orders, waitlist leads, run edits, product pricing, activity logs, and SocialAI calendar items to localStorage.

**Tech Stack:** React 18, Vite, lucide-react, CSS modules via plain `styles.css`, generated lychee hero asset.

---

### Task 1: Package Scaffold

**Files:**
- Create: `packages/lush-lychees-mvp/package.json`
- Create: `packages/lush-lychees-mvp/vite.config.js`
- Create: `packages/lush-lychees-mvp/index.html`
- Create: `packages/lush-lychees-mvp/src/main.jsx`
- Create: `packages/lush-lychees-mvp/src/App.jsx`
- Create: `packages/lush-lychees-mvp/src/data.js`
- Create: `packages/lush-lychees-mvp/src/styles.css`
- Create: `packages/lush-lychees-mvp/README.md`

- [ ] **Step 1: Create a Vite React package**

Add `package.json` with `dev`, `build`, and `preview` scripts. Add `vite.config.js` with the React plugin so JSX uses the automatic runtime.

- [ ] **Step 2: Add the root HTML entry**

Create `index.html` with a single `#root` mount point and the page title `Lush Lychees Delivery Studio`.

- [ ] **Step 3: Add React entry files**

Create `src/main.jsx`, `src/App.jsx`, and `src/data.js`.

- [ ] **Step 4: Add CSS**

Create `src/styles.css` with responsive layout, farm/product imagery, forms, tables, buttons, and mobile states.

### Task 2: Customer Ordering Surface

**Files:**
- Modify: `packages/lush-lychees-mvp/src/App.jsx`
- Modify: `packages/lush-lychees-mvp/src/data.js`
- Modify: `packages/lush-lychees-mvp/src/styles.css`

- [ ] **Step 1: Define delivery areas and products**

Use sample runs for Rockhampton, Capricorn Coast, and Gladstone corridor examples. Use four products: 1kg box, 3kg family box, 5kg share box, and gift box.

- [ ] **Step 2: Implement suburb lookup**

Match lowercase suburb or postcode text against configured run suburbs. Show a delivery match with cut-off, fee, and delivery date, or a waitlist state.

- [ ] **Step 3: Implement order summary**

Let the customer choose product and quantity. Calculate item total, delivery fee, and total due.

### Task 3: Delivery Planner Surface

**Files:**
- Modify: `packages/lush-lychees-mvp/src/App.jsx`
- Modify: `packages/lush-lychees-mvp/src/styles.css`

- [ ] **Step 1: Add a run planner tab**

Render delivery runs with date, cut-off, capacity, reserved boxes, order count, route suburbs, and packing totals.

- [ ] **Step 2: Add capacity simulation**

Add a control that increments reserved boxes for the selected run and updates capacity labels.

### Task 4: AI Orchard Scout Surface

**Files:**
- Modify: `packages/lush-lychees-mvp/src/App.jsx`
- Modify: `packages/lush-lychees-mvp/src/styles.css`

- [ ] **Step 1: Add orchard observation form**

Capture block, row, variety, and observation note.

- [ ] **Step 2: Add simulated assessment**

Return ripeness confidence, harvest window, quality note, and follow-up recommendation from local deterministic logic.

### Task 5: Verification

**Files:**
- Modify: `packages/lush-lychees-mvp/README.md`

- [ ] **Step 1: Install dependencies**

Run: `npm install` from `packages/lush-lychees-mvp`.

- [ ] **Step 2: Build**

Run: `npm run build`.

- [ ] **Step 3: Browser smoke**

Run the dev server, load the app, test suburb match, unmatched suburb, product quantity, planner increment, and AI scout assessment.

- [ ] **Step 4: Persist**

Run the global Codex save script from the repo root.

### Task 6: SocialAI Studio Instance

**Files:**
- Modify: `packages/lush-lychees-mvp/src/App.jsx`
- Modify: `packages/lush-lychees-mvp/src/data.js`
- Modify: `packages/lush-lychees-mvp/src/styles.css`
- Modify: `packages/lush-lychees-mvp/README.md`

- [ ] **Step 1: Define campaign templates**

Add campaign angles for delivery-run launch, harvest update, farm-gate weekend, last-chance cut-off, and storage/recipe tips.

- [ ] **Step 2: Add SocialAI Studio navigation**

Add a fourth app tab named `SocialAI` that opens a farm-specific content studio.

- [ ] **Step 3: Generate campaign drafts**

Use the selected delivery run, orchard block, and campaign angle to render editable draft copy, hashtags, image prompt, and schedule cards for Facebook and Instagram.

- [ ] **Step 4: Test SocialAI flow**

Run the rendered QA script and verify the SocialAI tab opens, channel toggles work, and a generated campaign draft appears without console errors.

### Task 7: Owner Admin Backend and ROI Placeholders

**Files:**
- Create: `packages/lush-lychees-mvp/src/demoStore.js`
- Modify: `packages/lush-lychees-mvp/src/App.jsx`
- Modify: `packages/lush-lychees-mvp/src/styles.css`
- Modify: `packages/lush-lychees-mvp/README.md`

- [ ] **Step 1: Persist demo backend state**

Store customer orders, waitlist leads, delivery run edits, product pricing, activity log entries, and SocialAI calendar items in localStorage so the MVP feels like a real owner backend during a demo.

- [ ] **Step 2: Add admin backend tabs**

Add a PIN-gated admin area with Dashboard, Orders, Delivery runs, Boxes, and Comms + SocialAI tabs.

- [ ] **Step 3: Weld in benefit copy**

Show owner-facing impact estimates that explicitly compare the MVP with today's manual DMs, calls, Facebook messages, and spreadsheet sorting. Include time saved, delivery questions avoided, structured demand captured, confirmed box counts before picking starts, and driver-ready run sheets.

### Task 8: Simplified Owner Pitch Navigation

**Files:**
- Modify: `packages/lush-lychees-mvp/src/App.jsx`
- Modify: `packages/lush-lychees-mvp/src/styles.css`
- Modify: `packages/lush-lychees-mvp/README.md`

- [ ] **Step 1: Simplify the product story**

Replace scattered top-level navigation with four clear workflows: Sell, Deliver, Manage, and SocialAI.

- [ ] **Step 2: Add a driver delivery app**

Show delivery stops, customer call links, driver notes, delivery status actions, and a run summary so the owner sees the MVP is also a delivery tool.

- [ ] **Step 3: Improve the pitch cards**

Remove internal placeholder wording from the visible MVP and use polished owner-facing impact copy instead.
