import { apiRequest, jsonBody, subscribeToServerEvent } from '../../shared/api'

export const menuService = {
  getMenuItems: () => apiRequest('/menu'),
  getMenuItemById: async (id) => (await apiRequest('/menu')).find((item) => item.id === id) || null,
  async toggleAvailability(id) {
    const item = await this.getMenuItemById(id)
    if (!item) return null
    const isAvailable = !item.isAvailable
    return apiRequest(`/menu/${encodeURIComponent(id)}`, { method: 'PUT', body: jsonBody({ isAvailable, badge: isAvailable ? (item.badge === 'Sold Out' || item.badge === 'Sold Out Today' ? null : item.badge) : 'Sold Out' }) })
  },
  addMenuItem: (dish) => apiRequest('/menu', { method: 'POST', body: jsonBody(dish) }),
  updateMenuItem: (id, updates) => apiRequest(`/menu/${encodeURIComponent(id)}`, { method: 'PUT', body: jsonBody(updates) }),
  deleteMenuItem: (id) => apiRequest(`/menu/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  subscribe: (callback) => subscribeToServerEvent('menu', callback),
}
