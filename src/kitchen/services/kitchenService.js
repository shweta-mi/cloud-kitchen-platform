import { KITCHEN_STATUS } from '../constants/kitchenStatus'
import { apiRequest, jsonBody, subscribeToServerEvent } from '../../shared/api'

export const kitchenService = {
  async getStatus() {
    const { status } = await apiRequest('/kitchen/status')
    return status
  },
  async setStatus(status) {
    if (!Object.values(KITCHEN_STATUS).includes(status)) throw new Error('Invalid kitchen status')
    return (await apiRequest('/kitchen/status', { method: 'PUT', body: jsonBody({ status }) })).status
  },
  subscribe: (callback) => subscribeToServerEvent('kitchenStatus', callback),
}
