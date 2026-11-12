# Rasoi Kitchen - Customer Website (Cloud Kitchen Platform)

A responsive, customer-facing food ordering web application built for the **Rasoi Kitchen** cloud kitchen platform.

## 🥘 Tech Stack & Architecture

- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4 + `@tailwindcss/vite`
- **Icons**: Lucide React
- **Typography**: Plus Jakarta Sans & Playfair Display
- **Organization**: All customer website code is isolated in `src/customer/` to keep clean separation from future companion modules (like `src/kitchen/`).
- **State Management**: React Context (`CartContext`) + persistent LocalStorage
- **Data Boundaries**: `orderService.js` abstracts order creation and tracking, fully ready to swap in a backend REST / WebSocket API.

---

## 🚀 How to Run Locally

### 1. Navigate to the project directory:
```bash
cd /Users/shweta/.gemini/antigravity/scratch/rasoi-kitchen
```

### 2. Install dependencies (if needed):
```bash
npm install
```

### 3. Start development server:
```bash
npm run dev
```

Open your browser at `http://localhost:5173`.

### 4. Build for production:
```bash
npm run build
npm run preview
```

---

## 📋 Features

1. **Brand Header (`src/customer/components/Header.jsx`)**:
   - Brand name: **Rasoi Kitchen** with flame icon and cloud kitchen badge
   - Navigation links: Menu, Why Rasoi, Track Order, About
   - Interactive Cart button displaying real-time item count badge and subtotal
   - Responsive mobile navigation drawer

2. **Hero Section (`src/customer/components/Hero.jsx`)**:
   - Welcoming culinary headline & brand story
   - "View Menu" button that smoothly scrolls to `#menu`
   - "Track Live Order" button that takes the user to real-time order tracking
   - Key trust badges: 30-min express delivery, 100% fresh ingredients, 4.9★ rating

3. **Menu Section & Filters (`src/customer/components/MenuSection.jsx`, `MenuItemCard.jsx`)**:
   - Menu dishes across categories (Main Course, Snacks, Drinks, Desserts)
   - Real-time search by dish name, description, or ingredients
   - Category filter pills with live item count badges
   - "Pure Veg Only" filter switch
   - Sensible states:
     - Initial shimmer loading state
     - Empty search/filter state with one-click "Reset All Filters"
     - Unavailable dish state (dimmed card, "Sold Out" overlay, disabled button)
   - Dish card shows name, description, price in ₹, category, spice level, veg badge, rating, and responsive quantity/add controls

4. **Working Cart Drawer (`src/customer/components/CartDrawer.jsx`)**:
   - Slide-out drawer accessible from anywhere on the website
   - Add items, adjust quantities (`+` / `-`), remove items
   - Dynamic calculations: Subtotal, Delivery Fee (Free above ₹300), 5% GST
   - Free delivery progress prompt
   - Empty cart state with helpful call-to-action button
   - Direct button to proceed to Checkout

5. **Validated Checkout Modal (`src/customer/components/CheckoutModal.jsx`)**:
   - Collects Customer Name, Phone Number, Delivery Address, and optional Special Instructions
   - Validates all required fields:
     - Name: minimum 2 characters
     - Phone: valid 10-digit Indian mobile number (`[6-9]XXXXXXXXX`)
     - Address: minimum 10 characters
   - Inline real-time and on-submit error messages with accessible tags
   - Order summary snapshot with simulated payment notice ("Pay on Delivery")

6. **Order Confirmation (`src/customer/components/OrderConfirmation.jsx`)**:
   - Displays generated Order ID (e.g. `order-4821`) with one-click copy button
   - Initial status: `Placed`
   - Itemized order breakdown and delivery details
   - "Track Live Order Status" button

7. **Real-Time Order Tracking (`src/customer/components/OrderTracking.jsx`)**:
   - Shows current status with step progress tracker:
     `Placed` → `Accepted` → `Preparing` → `Ready` → `Completed` (or `Cancelled`)
   - Order ID search bar to track any order
   - Quick-select chips for recent or sample orders (`order-123`, `order-101`, etc.)
   - Built-in **Kitchen Simulator Controls** allowing developers and reviewers to step through order statuses or cancel orders to see live UI state changes
   - Order not found state with recovery suggestion

---

## 📦 Shared Order Schema

This project strictly adheres to the shared contract required for integration with the Kitchen Dashboard:

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

### Recognized Order Statuses:
- `Placed`
- `Accepted`
- `Preparing`
- `Ready`
- `Completed`
- `Cancelled`

---

## 🗂️ File Organization

```
rasoi-kitchen/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   └── customer/
│       ├── CustomerApp.jsx
│       ├── constants/
│       │   └── orderStatus.js
│       ├── data/
│       │   ├── menuData.js
│       │   └── mockOrders.js
│       ├── services/
│       │   └── orderService.js
│       ├── context/
│       │   └── CartContext.jsx
│       └── components/
│           ├── Header.jsx
│           ├── Hero.jsx
│           ├── MenuSection.jsx
│           ├── MenuItemCard.jsx
│           ├── CartDrawer.jsx
│           ├── CheckoutModal.jsx
│           ├── OrderConfirmation.jsx
│           ├── OrderTracking.jsx
│           ├── WhyUs.jsx
│           └── Footer.jsx
```
