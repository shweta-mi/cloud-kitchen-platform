# Rasoi Kitchen - Cloud Kitchen Platform (Customer Website & Kitchen Dashboard)

A full, responsive cloud kitchen web application platform for **Rasoi Kitchen** featuring both the customer-facing food ordering website and the real-time kitchen staff operations dashboard (KDS).

## 🥘 Tech Stack & Architecture

- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`) with custom typography and animations
- **Icons**: Lucide React
- **Typography**: Plus Jakarta Sans & Playfair Display
- **Organization**:
  - `src/customer/`: Customer-facing food ordering application (menu, cart, checkout, order tracking)
  - `src/kitchen/`: Kitchen staff operations dashboard (overview, order queue, menu catalog, inventory, kitchen status)
- **Backend**: Node.js 22.5+ with Express 5, SQLite (`node:sqlite`), REST endpoints, and server-sent events (SSE).
- **Shared Data & Contract**:
  - `server/index.js`: REST API and SQLite persistence for orders, menu, kitchen status, and inventory.
  - `src/shared/api.js`: Browser API client, CSRF protection, and scoped SSE subscriptions. Kitchen data is available only after staff sign-in; public order tracking only receives that order's status.
  - The database is created at `server/data/rasoi.sqlite` the first time the API starts and is excluded from Git.

---

## 🚀 How to Run Locally

### 1. Navigate to the project directory:
```bash
cd /Users/shweta/.gemini/antigravity/scratch/rasoi-kitchen
```

### 2. Configure the kitchen staff password

Copy `.env.example` to `.env`, then generate a strong session secret and a bcrypt password hash:

```bash
node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"
node -e "require('bcryptjs').hash('choose-a-strong-staff-password', 12).then(console.log)"
```

Put the generated values in `.env` as `SESSION_SECRET` and `KITCHEN_PASSWORD_HASH`. Never commit `.env`; it is ignored by Git. The kitchen dashboard will reject sign-in until a password hash is configured. Change the example password text to a private password before generating its hash.

### 3. Install dependencies and start the API and website:
```bash
npm install
npm run dev
```

This starts the API on port `3001` and Vite on port `5173`, bound to this computer only by default.

### 3. Open both views in your browser:

- **Customer Website**:
  Visit `http://localhost:5173/` or `http://localhost:5173/?view=customer`
  *(Browse menu, add items to cart, place a simulated pay-on-delivery order, and track it).*

- **Kitchen Staff Dashboard**:
  Visit `http://localhost:5173/?view=kitchen`
*(Sign in with the configured staff password to inspect orders, advance statuses, manage dishes and inventory, and toggle kitchen status.)*

- **API health check**: `http://localhost:3001/api/health`

### Production-style local run

Build the website, then start the Express server. It serves both the API and built website from one origin:

```bash
npm run build
npm start
```

Open `http://localhost:3001/`.

### Data and real-time updates

- Orders are validated and priced from the server's current menu, then stored in SQLite.
- Kitchen status, menu changes, and inventory changes are also saved in SQLite.
- Kitchen order, menu, and inventory events require a staff session. Public order tracking exposes only the selected order's status, using a random tracking ID; customer phone, address, and delivery instructions stay private.
- The database file is local to the computer running the server. Back up `server/data/rasoi.sqlite` to preserve data.
- Staff authentication uses a bcrypt password hash, SQLite-backed 8-hour sessions, HttpOnly/SameSite cookies, CSRF tokens, and login throttling. The API also uses Helmet security headers, a content security policy, request-size limits, and API/order rate limits.
- Before an internet deployment, configure HTTPS at the hosting edge, use a unique strong `SESSION_SECRET`, restrict the hosting firewall and trusted proxy configuration, set up monitored backups and restore procedures for SQLite, and review privacy/retention requirements. Do not expose the development Vite server publicly or commit `.env` or customer data.

- **Switching Between Views**:
  Use the persistent top bar switcher:
  - `[ 🛒 Customer Site ]`
  - `[ 👨‍🍳 Kitchen Dashboard ]` *(sign-in required)*
  - Or click the **Kitchen Staff** button in the Customer header.

---

## 👨‍🍳 Kitchen Dashboard Features (`src/kitchen/`)

1. **Overview KPI & Quick Actions (`src/kitchen/components/OverviewTab.jsx`)**:
   - Live KPI cards: **New Orders (Placed)**, **Active in Kitchen (Accepted/Preparing/Ready)**, **Completed Orders**, and **Kitchen Operating Status**.
   - Top banner alerts when new incoming customer orders are waiting for chef confirmation.
   - Low-stock warning banner with one-click navigation to inventory.
   - Status distribution breakdown with live platform totals.
   - Quick action feed to advance urgent tickets right from the overview.

2. **Order Queue & Workflow Display (`src/kitchen/components/OrderQueueTab.jsx`)**:
   - Full order queue displaying order ID, timestamps, elapsed time, customer contact & delivery address, and chef notes.
   - Real-time search by Order ID, customer name, or mobile number.
   - Status filters: *All*, *Placed*, *Accepted*, *Preparing*, *Ready*, *Completed*, *Cancelled*.
   - Workflow step buttons:
     $$\text{Placed} \xrightarrow{\text{Accept}} \text{Accepted} \xrightarrow{\text{Start Cooking}} \text{Preparing} \xrightarrow{\text{Mark Ready}} \text{Ready} \xrightarrow{\text{Dispatch}} \text{Completed}$$
   - Direct status selector dropdown.
   - "Cancel Order" action with confirmation dialog.

3. **Menu Management & Stock Availability (`src/kitchen/components/MenuManagementTab.jsx`)**:
   - Live menu dish catalog with category chips (*Main Course*, *Snacks*, *Drinks*, *Desserts*).
   - Instant 1-click **In Stock / Sold Out** availability toggle (synchronizes live with the customer website).
   - "Add New Dish" modal to add recipes with price in ₹, category, veg/non-veg flag, and spice level.
   - "Edit Dish" modal to adjust prices or descriptions.
   - "Delete Dish" with confirmation dialog.

4. **Raw Material Inventory Tracking (`src/kitchen/components/InventoryTab.jsx`)**:
   - Tracks ingredients (Paneer, Basmati Rice, Ghee, Lentils, Paratha Dough, Mango Pulp, Packaging boxes, Chai kulhads, Spices).
   - Low-stock visual alert badges when stock falls below reorder thresholds.
   - Quick `+` and `-` quantity adjustment controls.
   - Add new raw materials and edit stock thresholds.

5. **Kitchen Status Controls (`src/kitchen/constants/kitchenStatus.js`, `kitchenService.js`)**:
   - Three operational modes: **Open** (Accepting orders), **Busy** (High rush / longer prep), and **Closed** (Service paused).
   - Selectable from the header in both views.

---

## 🛒 Customer Website Features (`src/customer/`)

1. **Brand Header & Cart Badge**: Brand logo, navigation, and cart button with real-time badge count and subtotal.
2. **Hero Section**: Welcoming headline, "View Menu" smooth scroll, and "Track Live Order" shortcut.
3. **Menu Catalog**: Sample dishes including `item-1` "Paneer Roll" (₹120), category filter pills, real-time search, and veg-only filter.
4. **Working Cart Drawer**: Slide-out drawer to change quantities, remove items, calculate free delivery above ₹300, and 5% GST.
5. **Validated Checkout Modal**: Collects Name, Phone (10 digits), and Address with inline validation and simulated "Pay on Delivery".
6. **Order Confirmation Screen**: Displays a cryptographically random tracking ID and initial status `Placed`.
7. **Order Tracking**: Visual step progress tracker. Orders and status changes are stored by the API and broadcast to connected browsers.

---

## 📦 Shared Order Schema Contract

```json
{
  "id": "order-<random-tracking-token>",
  "items": [
    {
      "menuItemId": "item-1",
      "name": "Paneer Roll",
      "quantity": 2,
      "price": 120
    }
  ],
  "total": 240,
  "status": "Placed"
}
```

Recognized statuses: `Placed`, `Accepted`, `Preparing`, `Ready`, `Completed`, `Cancelled`.

---

## 🗂️ File Organization

```
rasoi-kitchen/
├── index.html
├── package.json
├── vite.config.js
├── README.md
├── src/
│   ├── main.jsx
│   ├── App.jsx                       <-- Unified Platform view switcher (?view=customer / ?view=kitchen)
│   ├── index.css
│   ├── customer/
│   │   ├── CustomerApp.jsx
│   │   ├── constants/
│   │   │   └── orderStatus.js        <-- Shared status definitions
│   │   ├── data/
│   │   │   ├── menuData.js           <-- Static sample dish catalog
│   │   │   └── mockOrders.js         <-- Initial mock orders
│   │   ├── services/
│   │   │   ├── orderService.js       <-- Shared order state & live pub/sub
│   │   │   └── menuService.js        <-- Live menu store (synced with kitchen)
│   │   ├── context/
│   │   │   └── CartContext.jsx
│   │   └── components/
│   │       ├── Header.jsx
│   │       ├── Hero.jsx
│   │       ├── MenuSection.jsx
│   │       ├── MenuItemCard.jsx
│   │       ├── CartDrawer.jsx
│   │       ├── CheckoutModal.jsx
│   │       ├── OrderConfirmation.jsx
│   │       ├── OrderTracking.jsx
│   │       ├── WhyUs.jsx
│   │       └── Footer.jsx
│   └── kitchen/
│       ├── KitchenDashboard.jsx      <-- Main Kitchen Display System container
│       ├── constants/
│       │   └── kitchenStatus.js      <-- Open, Busy, Closed status definitions
│       ├── services/
│       │   ├── kitchenService.js     <-- Kitchen operating status service
│       │   └── inventoryService.js   <-- Stock level & low-stock alerts service
│       └── components/
│           ├── KitchenHeader.jsx     <-- Header with kitchen status & clock
│           ├── OverviewTab.jsx       <-- KPIs, new order alerts, quick actions
│           ├── OrderQueueTab.jsx     <-- Full ticket queue, filters, search, workflow
│           ├── MenuManagementTab.jsx <-- Dish management, availability toggle, add/edit
│           ├── InventoryTab.jsx      <-- Inventory table, +/- controls, low-stock alerts
│           └── ConfirmationModal.jsx <-- Accessible confirmation dialog
```
