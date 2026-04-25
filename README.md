# Penny Wise I.T - Business Application

A comprehensive business application for **Penny Wise I.T** — showcasing services, managing customer support tickets, workflow automation, and SiteGround GoGeek hosting integration.

## Features

### Public Website
- **Service Showcase** — Web Hosting, Custom App Development, Workflow Solutions, Maintenance, IT Consulting
- **Portfolio** — Showcase completed projects with testimonials
- **Contact Form** — Lead generation with service interest capture

### Customer Portal
- **Account Registration & Login** — Secure JWT-based authentication
- **Support Tickets** — Create, track, and comment on issues
- **Workflow Visibility** — Customers can see active workflows assigned to them
- **Profile Management** — Update details and change password

### Admin Dashboard
- **Customer Management** — Add, edit, activate/deactivate customers
- **Service Management** — Full CRUD for service offerings
- **Ticket Management** — View all tickets, assign, update status, internal notes
- **Workflow Engine** — Create workflows, templates, assign to customers, track progress
- **SiteGround Integration** — Manage GoGeek-hosted client sites (cache, backups, SSL, stats)

## Tech Stack

- **Frontend:** React 18, React Router, Lucide Icons, React Hot Toast
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose ODM
- **Auth:** JWT tokens with bcrypt password hashing
- **Security:** Helmet, CORS, Rate Limiting
- **Hosting Integration:** SiteGround Site Tools API

## Getting Started

### Prerequisites
- **Node.js** 18+ installed
- **MongoDB** running locally or a MongoDB Atlas connection string

### 1. Install Dependencies

```bash
# Install server dependencies
npm install

# Install client dependencies
cd client && npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Key settings:
- `MONGODB_URI` — Your MongoDB connection string
- `JWT_SECRET` — Change to a secure random string
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — Your admin login credentials
- `SITEGROUND_API_TOKEN` — Your SiteGround API token (optional, for hosting integration)

### 3. Initialize the App

```bash
# Start the development servers
npm run dev
```

This starts:
- **Backend** on `http://localhost:5000`
- **Frontend** on `http://localhost:3000`

### 4. First-Time Setup

1. Open `http://localhost:3000`
2. The app will be running — navigate to **Sign In**
3. First, initialize the admin account by calling: `POST http://localhost:5000/api/admin/init`
4. Log in with your admin credentials from `.env`
5. Go to **Admin > Dashboard** and click **"Seed Initial Data"** to populate services

## SiteGround GoGeek Integration

To connect your SiteGround account:

1. Log into **SiteGround Site Tools**
2. Go to **Dev > API**
3. Generate an API token
4. Add it to `.env` as `SITEGROUND_API_TOKEN`
5. Restart the server
6. Visit **Admin > SiteGround** to manage client sites

## Project Structure

```
├── server/
│   ├── index.js            # Express server entry
│   ├── middleware/
│   │   └── auth.js         # JWT auth & role middleware
│   ├── models/
│   │   ├── User.js         # User/Customer model
│   │   ├── Ticket.js       # Support ticket model
│   │   ├── Service.js      # Service offering model
│   │   ├── Portfolio.js    # Portfolio project model
│   │   └── Workflow.js     # Workflow & steps model
│   └── routes/
│       ├── auth.js         # Authentication routes
│       ├── services.js     # Service CRUD
│       ├── tickets.js      # Ticket management
│       ├── customers.js    # Customer management
│       ├── portfolio.js    # Portfolio CRUD
│       ├── workflows.js    # Workflow engine
│       ├── siteground.js   # SiteGround API proxy
│       └── admin.js        # Admin dashboard & seeding
├── client/
│   ├── public/
│   └── src/
│       ├── api.js          # Axios API client
│       ├── context/
│       │   └── AuthContext.js
│       ├── components/
│       │   ├── Navbar.js
│       │   └── Footer.js
│       └── pages/
│           ├── Home.js           # Landing page
│           ├── Services.js       # Service listings
│           ├── Portfolio.js      # Project showcase
│           ├── Contact.js        # Contact form
│           ├── Login.js          # Sign in
│           ├── Register.js       # Sign up
│           ├── Dashboard.js      # Customer dashboard
│           ├── Tickets.js        # Ticket list
│           ├── TicketDetail.js   # Single ticket view
│           ├── NewTicket.js      # Create ticket
│           ├── Profile.js        # User profile
│           ├── AdminDashboard.js # Admin overview
│           ├── AdminCustomers.js # Customer management
│           ├── AdminServices.js  # Service management
│           ├── AdminWorkflows.js # Workflow management
│           └── AdminSiteGround.js# SiteGround integration
├── .env
├── .env.example
└── package.json
```

## Deployment

### Cloudflare Pages (frontend) + Railway (backend) — current production setup

The frontend and backend deploy separately:

**Frontend → Cloudflare Pages**
1. Connect this repo in Cloudflare Pages
2. Framework preset: **Create React App**
3. Build command: `cd client && npm install && npm run build`
4. Build output directory: `client/build`
5. Environment variables:
   - `REACT_APP_API_URL` = `https://api.pennywiseit.com.au/api` (your Railway backend)
   - `REACT_APP_GOOGLE_CLIENT_ID` = your Google OAuth client ID
6. SPA routing is handled by `client/public/_redirects` (already in repo)

**Backend → Railway**
1. Create a Railway project from this repo (`railway.json` is the config)
2. Set environment variables from `.env.example` — at minimum `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV=production`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, plus Square/SMTP/SiteGround/Google as needed
3. Add a custom domain (e.g. `api.pennywiseit.com.au`) and point a DNS CNAME at the Railway domain in Cloudflare DNS

**DNS in Cloudflare**
- `pennywiseit.com.au` → Cloudflare Pages
- `www.pennywiseit.com.au` → Cloudflare Pages
- `api.pennywiseit.com.au` → Railway (CNAME)

### SiteGround (alternative — single-server deploy)

The Express server can also serve the built React app on SiteGround Node.js hosting:
1. Build the client: `npm run build`
2. Upload the repo with `client/build` included
3. SiteGround uses `app.js` (Passenger entry point) — already in repo
4. Set `NODE_ENV=production` and other env vars in SiteGround's Node.js panel
5. See [DEPLOY-SITEGROUND.md](DEPLOY-SITEGROUND.md) for detailed steps

## License

MIT — Penny Wise I.T
