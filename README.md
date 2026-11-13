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
  - `src/shared/api.js`: Browser API client and SSE subscriptions. Updates are broadcast to every connected browser.
  - The database is created at `server/data/rasoi.sqlite` the first time the API starts and is excluded from Git.

---

## 🚀 How to Run Locally

### 1. Navigate to the project directory:
```bash
cd /Users/shweta/.gemini/antigravity/scratch/rasoi-kitchen
```

### 2. Install dependencies and start the API and website:
```bash
npm install
npm run dev
```

This starts the API on port `3001` and Vite on port `5173`. Both listen on your local network, so another device on the same Wi-Fi can open the Vite **Network** URL while this computer stays on and runs the app.

### 3. Open both views in your browser:

- **Customer Website**:
  Visit `http://localhost:5173/` or `http://localhost:5173/?view=customer`
  *(Browse menu, add items to cart, place a simulated pay-on-delivery order, and track it).*

- **Kitchen Staff Dashboard**:
  Visit `http://localhost:5173/?view=kitchen`
  *(Inspect incoming orders, advance order statuses, manage dishes, track inventory, and toggle kitchen status).*

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
- Server-sent events broadcast order, menu, inventory, and kitchen-status updates to connected browsers.
- The database file is local to the computer running the server. Back up `server/data/rasoi.sqlite` to preserve data.
- This is a learning/demo backend. Before exposing it to the public internet, add kitchen staff authentication, HTTPS, rate limiting, and managed database backups. Do not use real customer data until those protections are in place.

- **Switching Between Views**:
  Use the persistent top bar switcher:
  - `[ 🛒 Customer Site ]`
  - `[ 👨‍🍳 Kitchen Dashboard ]` *(with live notification badge when new orders are placed)*
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
6. **Order Confirmation Screen**: Displays generated Order ID (e.g. `order-4821`) and initial status `Placed`.
7. **Order Tracking**: Visual step progress tracker. Orders and status changes are stored by the API and broadcast to connected browsers.

---

## 📦 Shared Order Schema Contract

```json
{
  "id": "order-123",
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
