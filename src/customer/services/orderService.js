import { ORDER_STATUS } from '../constants/orderStatus'
import { apiRequest, jsonBody, subscribeToServerEvent } from '../../shared/api'

const progression = [ORDER_STATUS.PLACED, ORDER_STATUS.ACCEPTED, ORDER_STATUS.PREPARING, ORDER_STATUS.READY, ORDER_STATUS.COMPLETED]

export const orderService = {
  getOrders: () => apiRequest('/orders'),
  getOrderById: (id) => id ? apiRequest(`/orders/${encodeURIComponent(id.trim())}`).catch((error) => error.message === 'Order not found' ? null : Promise.reject(error)) : Promise.resolve(null),
  createOrder: ({ items, total, customer }) => apiRequest('/orders', { method: 'POST', body: jsonBody({ items, total, customer }) }),
  updateOrderStatus: (id, status) => apiRequest(`/orders/${encodeURIComponent(id)}/status`, { method: 'PATCH', body: jsonBody({ status }) }),
  async advanceNextStatus(id) {
    const order = await this.getOrderById(id)
    if (!order) return null
    const index = progression.indexOf(order.status)
    if (index < 0 || index >= progression.length - 1) return order
    return this.updateOrderStatus(id, progression[index + 1])
  },
  cancelOrder: (id) => apiRequest(`/orders/${encodeURIComponent(id)}/status`, { method: 'PATCH', body: jsonBody({ status: ORDER_STATUS.CANCELLED }) }),
  subscribe: (callback) => subscribeToServerEvent('orders', callback),
  subscribeToOrder: (id, callback) => {
    if (!id || typeof window === 'undefined' || !window.EventSource) return () => {}
    const source = new EventSource(`/api/orders/${encodeURIComponent(id)}/events`, { withCredentials: true })
    const handle = (event) => { try { callback(JSON.parse(event.data)) } catch (error) { console.error('Invalid order status event', error) } }
    source.addEventListener('orderStatus', handle)
    return () => source.close()
  },
}
