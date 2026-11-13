/**
 * Live Menu Service for Rasoi Kitchen Platform.
 * 
 * Synchronizes menu dishes between Customer Website and Kitchen Dashboard.
 * Initializes from static MENU_ITEMS in menuData.js and persists changes in localStorage.
 */

import { MENU_ITEMS } from '../data/menuData'

const STORAGE_KEY = 'rasoi_kitchen_menu_items_v1'
const EVENT_NAME = 'rasoi_kitchen_menu_event'

function getStoredMenu() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MENU_ITEMS))
      return MENU_ITEMS
    }
    return JSON.parse(raw)
  } catch (err) {
    console.warn('Could not read menu from localStorage', err)
    return MENU_ITEMS
  }
}

function saveStoredMenu(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch (err) {
    console.warn('Could not save menu to localStorage', err)
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: items }))
  }
}

export const menuService = {
  getMenuItems() {
    return getStoredMenu()
  },

  getMenuItemById(id) {
    const items = getStoredMenu()
    return items.find((i) => i.id === id) || null
  },

  toggleAvailability(id) {
    const items = getStoredMenu()
    const index = items.findIndex((i) => i.id === id)
    if (index === -1) return null

    items[index] = {
      ...items[index],
      isAvailable: !items[index].isAvailable,
      badge: !items[index].isAvailable ? items[index].badge : 'Sold Out',
    }
    saveStoredMenu(items)
    return items[index]
  },

  addMenuItem(newDish) {
    const items = getStoredMenu()
    const dish = {
      id: `item-${Date.now().toString().slice(-4)}`,
      name: newDish.name.trim(),
      description: newDish.description?.trim() || '',
      price: Number(newDish.price) || 99,
      category: newDish.category || 'Main Course',
      isAvailable: newDish.isAvailable !== undefined ? newDish.isAvailable : true,
      isVeg: newDish.isVeg !== undefined ? newDish.isVeg : true,
      spiceLevel: newDish.spiceLevel || 'Medium',
      rating: 4.8,
      ratingCount: 1,
      badge: newDish.badge || 'New',
      image:
        newDish.image?.trim() ||
        'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80',
    }

    const updated = [dish, ...items]
    saveStoredMenu(updated)
    return dish
  },

  updateMenuItem(id, updates) {
    const items = getStoredMenu()
    const index = items.findIndex((i) => i.id === id)
    if (index === -1) return null

    items[index] = {
      ...items[index],
      ...updates,
      price: Number(updates.price ?? items[index].price),
    }
    saveStoredMenu(items)
    return items[index]
  },

  deleteMenuItem(id) {
    const items = getStoredMenu()
    const filtered = items.filter((i) => i.id !== id)
    saveStoredMenu(filtered)
    return true
  },

  subscribe(callback) {
    if (typeof window === 'undefined') return () => {}

    const handleCustom = (e) => callback(e.detail)
    const handleStorage = (e) => {
      if (e.key === STORAGE_KEY) {
        callback(getStoredMenu())
      }
    }

    window.addEventListener(EVENT_NAME, handleCustom)
    window.addEventListener('storage', handleStorage)

    return () => {
      window.removeEventListener(EVENT_NAME, handleCustom)
      window.removeEventListener('storage', handleStorage)
    }
  },
}
