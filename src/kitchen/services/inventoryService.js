/**
 * Kitchen Inventory Service for Rasoi Kitchen Platform.
 * 
 * Manages raw ingredients, packaging, and supply stock levels with low-stock alerts.
 * Reads and writes persisted inventory through the API and listens for server updates.
 */

import { apiRequest, jsonBody, subscribeToServerEvent } from '../../shared/api.js'

export const INITIAL_INVENTORY = [
  {
    id: 'inv-1',
    name: 'Fresh Malai Paneer',
    category: 'Dairy & Fresh',
    quantity: 16,
    unit: 'kg',
    minThreshold: 8,
    lastRestocked: '2026-11-12',
    costPerUnit: 340,
  },
  {
    id: 'inv-2',
    name: 'Royal Basmati Biryani Rice',
    category: 'Grains & Pulses',
    quantity: 42,
    unit: 'kg',
    minThreshold: 15,
    lastRestocked: '2026-11-10',
    costPerUnit: 120,
  },
  {
    id: 'inv-3',
    name: 'Amul Desi Ghee & Makhan',
    category: 'Dairy & Fresh',
    quantity: 4.5,
    unit: 'kg',
    minThreshold: 6, // Low Stock!
    lastRestocked: '2026-11-08',
    costPerUnit: 650,
  },
  {
    id: 'inv-4',
    name: 'Urad Sabut (Black Lentils)',
    category: 'Grains & Pulses',
    quantity: 22,
    unit: 'kg',
    minThreshold: 10,
    lastRestocked: '2026-11-09',
    costPerUnit: 140,
  },
  {
    id: 'inv-5',
    name: 'Laccha Paratha Dough Rounds',
    category: 'Bakery & Dough',
    quantity: 12,
    unit: 'packs',
    minThreshold: 15, // Low Stock!
    lastRestocked: '2026-11-12',
    costPerUnit: 180,
  },
  {
    id: 'inv-6',
    name: 'Alphonso Mango Puree',
    category: 'Beverage Ingredients',
    quantity: 3,
    unit: 'tins',
    minThreshold: 6, // Low Stock!
    lastRestocked: '2026-11-05',
    costPerUnit: 290,
  },
  {
    id: 'inv-7',
    name: 'Insulated 3-Compartment Meal Boxes',
    category: 'Packaging',
    quantity: 140,
    unit: 'units',
    minThreshold: 50,
    lastRestocked: '2026-11-11',
    costPerUnit: 12,
  },
  {
    id: 'inv-8',
    name: 'Earthen Clay Kulhads (Chai)',
    category: 'Packaging',
    quantity: 90,
    unit: 'units',
    minThreshold: 40,
    lastRestocked: '2026-11-07',
    costPerUnit: 6,
  },
  {
    id: 'inv-9',
    name: 'Rasoi House Garam Masala Blend',
    category: 'Spices & Condiments',
    quantity: 1.8,
    unit: 'kg',
    minThreshold: 2.5, // Low Stock!
    lastRestocked: '2026-11-04',
    costPerUnit: 800,
  },
  {
    id: 'inv-10',
    name: 'Fresh Mint & Coriander Leaves',
    category: 'Produce',
    quantity: 8,
    unit: 'bunches',
    minThreshold: 5,
    lastRestocked: '2026-11-13',
    costPerUnit: 25,
  },
]

export const inventoryService = {
  getInventory: () => apiRequest('/inventory'),
  async updateQuantity(id, newQuantity) {
    const inventory = await this.getInventory()
    const item = inventory.find((entry) => entry.id === id)
    if (!item) return null
    const quantity = Number(Math.max(0, Number(newQuantity)).toFixed(1))
    return apiRequest(`/inventory/${encodeURIComponent(id)}`, { method: 'PUT', body: jsonBody({ quantity }) })
  },
  adjustQuantity: (id, delta) => apiRequest(`/inventory/${encodeURIComponent(id)}/adjust`, { method: 'POST', body: jsonBody({ delta }) }),
  addItem: (item) => apiRequest('/inventory', { method: 'POST', body: jsonBody(item) }),
  updateItem: (id, updates) => apiRequest(`/inventory/${encodeURIComponent(id)}`, { method: 'PUT', body: jsonBody(updates) }),
  deleteItem: (id) => apiRequest(`/inventory/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  async getLowStockCount() {
    const items = await this.getInventory()
    return items.filter((item) => item.quantity <= item.minThreshold).length
  },
  subscribe: (callback) => subscribeToServerEvent('inventory', callback),
}
