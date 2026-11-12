/**
 * Mock initial orders for demonstration and order tracking lookups.
 * Strictly adheres to the shared order schema:
 * {
 *   id: "order-123",
 *   items: [
 *     {
 *       menuItemId: "item-1",
 *       name: "Paneer Roll",
 *       quantity: 2,
 *       price: 120
 *     }
 *   ],
 *   total: 240,
 *   status: "Placed"
 * }
 */

export const INITIAL_MOCK_ORDERS = [
  {
    id: 'order-123',
    items: [
      {
        menuItemId: 'item-1',
        name: 'Paneer Roll',
        quantity: 2,
        price: 120,
      },
    ],
    total: 240,
    status: 'Placed',
    customer: {
      name: 'Rohan Sharma',
      phone: '9876543210',
      address: 'Flat 402, Sunshine Heights, Sector 14, Gurugram',
      instructions: 'Please do not ring bell, leave at security.',
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
  },
  {
    id: 'order-101',
    items: [
      {
        menuItemId: 'item-2',
        name: 'Paneer Butter Masala',
        quantity: 1,
        price: 240,
      },
      {
        menuItemId: 'item-10',
        name: 'Alphonso Mango Lassi',
        quantity: 2,
        price: 80,
      },
    ],
    total: 400,
    status: 'Preparing',
    customer: {
      name: 'Pooja Verma',
      phone: '9811223344',
      address: 'B-12, Green Park Extension, New Delhi',
      instructions: 'Make it extra mild please.',
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(), // 18 mins ago
  },
  {
    id: 'order-102',
    items: [
      {
        menuItemId: 'item-4',
        name: 'Hyderabadi Veg Dum Biryani',
        quantity: 2,
        price: 260,
      },
      {
        menuItemId: 'item-14',
        name: 'Gulab Jamun (2 pcs)',
        quantity: 1,
        price: 80,
      },
    ],
    total: 600,
    status: 'Ready',
    customer: {
      name: 'Amit Patel',
      phone: '9922334455',
      address: 'House 78, Indiranagar 100ft Road, Bengaluru',
      instructions: 'Extra green chutney and tissues.',
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 28).toISOString(), // 28 mins ago
  },
  {
    id: 'order-103',
    items: [
      {
        menuItemId: 'item-3',
        name: 'Dal Makhani',
        quantity: 1,
        price: 210,
      },
      {
        menuItemId: 'item-7',
        name: 'Crispy Samosa Chaat',
        quantity: 2,
        price: 110,
      },
    ],
    total: 430,
    status: 'Completed',
    customer: {
      name: 'Sneha Kapoor',
      phone: '9733445566',
      address: 'Villa 14, Silver Oak Estate, Whitefield',
      instructions: '',
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 75).toISOString(), // 75 mins ago
  },
]
