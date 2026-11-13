/**
 * Kitchen Inventory Service for Rasoi Kitchen Platform.
 * 
 * Manages raw ingredients, packaging, and supply stock levels with low-stock alerts.
 * Uses localStorage persistence and custom events for real-time reactivity across tabs.
 */

const STORAGE_KEY = 'rasoi_kitchen_inventory_v1'
const EVENT_NAME = 'rasoi_kitchen_inventory_event'

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

function getStoredInventory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_INVENTORY))
      return INITIAL_INVENTORY
    }
    return JSON.parse(raw)
  } catch (err) {
    console.warn('Could not read inventory from localStorage', err)
    return INITIAL_INVENTORY
  }
}

function saveStoredInventory(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch (err) {
    console.warn('Could not save inventory to localStorage', err)
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: items }))
  }
}

export const inventoryService = {
  getInventory() {
    return getStoredInventory()
  },

  updateQuantity(id, newQuantity) {
    const items = getStoredInventory()
    const index = items.findIndex((i) => i.id === id)
    if (index === -1) return null

    const validQty = Math.max(0, Number(newQuantity))
    items[index] = {
      ...items[index],
      quantity: Number(validQty.toFixed(1)),
      updatedAt: new Date().toISOString(),
    }
    saveStoredInventory(items)
    return items[index]
  },

  adjustQuantity(id, delta) {
    const items = getStoredInventory()
    const item = items.find((i) => i.id === id)
    if (!item) return null
    return this.updateQuantity(id, item.quantity + delta)
  },

  addItem(newItem) {
    const items = getStoredInventory()
    const item = {
      id: `inv-${Date.now().toString().slice(-4)}`,
      name: newItem.name.trim(),
      category: newItem.category || 'General',
      quantity: Number(newItem.quantity) || 0,
      unit: newItem.unit || 'units',
      minThreshold: Number(newItem.minThreshold) || 5,
      lastRestocked: new Date().toISOString().split('T')[0],
      costPerUnit: Number(newItem.costPerUnit) || 0,
    }
    const updated = [item, ...items]
    saveStoredInventory(updated)
    return item
  },

  updateItem(id, updates) {
    const items = getStoredInventory()
    const index = items.findIndex((i) => i.id === id)
    if (index === -1) return null

    items[index] = {
      ...items[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    saveStoredInventory(items)
    return items[index]
  },

  deleteItem(id) {
    const items = getStoredInventory()
    const filtered = items.filter((i) => i.id !== id)
    saveStoredInventory(filtered)
    return true
  },

  getLowStockCount() {
    const items = getStoredInventory()
    return items.filter((i) => i.quantity <= i.minThreshold).length
  },

  subscribe(callback) {
    if (typeof window === 'undefined') return () => {}

    const handleCustomEvent = (e) => callback(e.detail)
    const handleStorageEvent = (e) => {
      if (e.key === STORAGE_KEY) {
        callback(getStoredInventory())
      }
    }

    window.addEventListener(EVENT_NAME, handleCustomEvent)
    window.addEventListener('storage', handleStorageEvent)

    return () => {
      window.removeEventListener(EVENT_NAME, handleCustomEvent)
      window.removeEventListener('storage', handleStorageEvent)
    }
  },
}
