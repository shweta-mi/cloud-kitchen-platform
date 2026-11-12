/**
 * Order Service for Rasoi Kitchen Platform.
 * 
 * Manages order creation, lookup, status updates, and subscriber events.
 * Uses local storage and in-memory mock data for local prototyping,
 * architected with clean async-ready boundaries so it can be swapped
 * with REST API (fetch/axios) or WebSockets/SSE endpoints with zero
 * component refactoring.
 */

import { INITIAL_MOCK_ORDERS } from '../data/mockOrders'
import { ORDER_STATUS, ORDER_STATUS_LIST } from '../constants/orderStatus'

const STORAGE_KEY = 'rasoi_kitchen_orders_v1'
const EVENT_NAME = 'rasoi_kitchen_order_event'

/**
 * Initialize storage with initial mock data if empty
 */
function getStoredOrders() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_ORDERS))
      return INITIAL_MOCK_ORDERS
    }
    return JSON.parse(data)
  } catch (err) {
    console.warn('Could not read from localStorage, using mock memory store:', err)
    return INITIAL_MOCK_ORDERS
  }
}

function saveStoredOrders(orders) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
  } catch (err) {
    console.warn('Could not save to localStorage:', err)
  }
  // Notify any active listeners (e.g. other tabs or tracking components)
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: orders }))
  }
}

/**
 * Generate a friendly human-readable Order ID matching "order-123" format
 */
export function generateOrderId() {
  const num = Math.floor(1000 + Math.random() * 9000)
  return `order-${num}`
}

export const orderService = {
  /**
   * Fetch all orders
   * Replace with: return fetch('/api/orders').then(r => r.json())
   */
  async getOrders() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getStoredOrders())
      }, 150)
    })
  },

  /**
   * Fetch single order by ID
   * Replace with: return fetch(`/api/orders/${orderId}`).then(r => r.json())
   */
  async getOrderById(orderId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!orderId) {
          resolve(null)
          return
        }
        const cleanId = orderId.trim().toLowerCase()
        const orders = getStoredOrders()
        const match = orders.find((o) => o.id.toLowerCase() === cleanId)
        resolve(match || null)
      }, 200)
    })
  },

  /**
   * Create a new order matching the required shape:
   * {
   *   id: "order-123",
   *   items: [{ menuItemId, name, quantity, price }],
   *   total: number,
   *   status: "Placed"
   * }
   * 
   * Replace with:
   * return fetch('/api/orders', { method: 'POST', body: JSON.stringify(newOrder) }).then(r => r.json())
   */
  async createOrder({ items, total, customer }) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newOrder = {
          id: generateOrderId(),
          items: items.map((i) => ({
            menuItemId: i.id || i.menuItemId,
            name: i.name,
            quantity: i.quantity,
            price: i.price,
          })),
          total: Math.round(total),
          status: ORDER_STATUS.PLACED,
          customer: {
            name: customer?.name || 'Guest Customer',
            phone: customer?.phone || '',
            address: customer?.address || '',
            instructions: customer?.instructions || '',
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        const orders = getStoredOrders()
        const updated = [newOrder, ...orders]
        saveStoredOrders(updated)
        resolve(newOrder)
      }, 400) // slight delay to give realistic submission feedback
    })
  },

  /**
   * Update status of an order
   * Replace with: return fetch(`/api/orders/${orderId}/status`, { method: 'PATCH', body: ... })
   */
  async updateOrderStatus(orderId, newStatus) {
    return new Promise((resolve, reject) => {
      const orders = getStoredOrders()
      const index = orders.findIndex((o) => o.id.toLowerCase() === orderId.toLowerCase())
      if (index === -1) {
        reject(new Error(`Order ${orderId} not found`))
        return
      }

      orders[index].status = newStatus
      orders[index].updatedAt = new Date().toISOString()
      saveStoredOrders(orders)
      resolve(orders[index])
    })
  },

  /**
   * Helper to advance order to next status for testing/demo purposes
   */
  async advanceNextStatus(orderId) {
    const order = await this.getOrderById(orderId)
    if (!order) return null

    const currentStatus = order.status
    const progression = [
      ORDER_STATUS.PLACED,
      ORDER_STATUS.ACCEPTED,
      ORDER_STATUS.PREPARING,
      ORDER_STATUS.READY,
      ORDER_STATUS.COMPLETED,
    ]

    const currentIndex = progression.indexOf(currentStatus)
    if (currentIndex >= 0 && currentIndex < progression.length - 1) {
      const nextStatus = progression[currentIndex + 1]
      return this.updateOrderStatus(orderId, nextStatus)
    }

    return order
  },

  /**
   * Helper to cancel an order
   */
  async cancelOrder(orderId) {
    return this.updateOrderStatus(orderId, ORDER_STATUS.CANCELLED)
  },

  /**
   * Subscribe to order updates (used by React components)
   * When integrating backend WebSockets or SSE, connect here:
   * e.g. const ws = new WebSocket(...); ws.onmessage = ...
   */
  subscribe(callback) {
    if (typeof window === 'undefined') return () => {}

    const handleCustomEvent = (e) => callback(e.detail)
    const handleStorageEvent = (e) => {
      if (e.key === STORAGE_KEY) {
        callback(getStoredOrders())
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
