/**
 * Kitchen Operations Service for Rasoi Kitchen Platform.
 * 
 * Manages operational status (Open, Busy, Closed) and kitchen metrics.
 * Persisted in localStorage and emits events so all tabs & customer components sync live.
 */

import { KITCHEN_STATUS } from '../constants/kitchenStatus'

const STATUS_STORAGE_KEY = 'rasoi_kitchen_status_v1'
const STATUS_EVENT_NAME = 'rasoi_kitchen_status_event'

function getStoredStatus() {
  try {
    const raw = localStorage.getItem(STATUS_STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STATUS_STORAGE_KEY, KITCHEN_STATUS.OPEN)
      return KITCHEN_STATUS.OPEN
    }
    return raw
  } catch (err) {
    console.warn('Could not read kitchen status from localStorage', err)
    return KITCHEN_STATUS.OPEN
  }
}

export const kitchenService = {
  getStatus() {
    return getStoredStatus()
  },

  setStatus(newStatus) {
    if (!Object.values(KITCHEN_STATUS).includes(newStatus)) return getStoredStatus()
    try {
      localStorage.setItem(STATUS_STORAGE_KEY, newStatus)
    } catch (err) {
      console.warn('Could not save kitchen status', err)
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(STATUS_EVENT_NAME, { detail: newStatus }))
    }
    return newStatus
  },

  subscribe(callback) {
    if (typeof window === 'undefined') return () => {}

    const handleCustom = (e) => callback(e.detail)
    const handleStorage = (e) => {
      if (e.key === STATUS_STORAGE_KEY) {
        callback(getStoredStatus())
      }
    }

    window.addEventListener(STATUS_EVENT_NAME, handleCustom)
    window.addEventListener('storage', handleStorage)

    return () => {
      window.removeEventListener(STATUS_EVENT_NAME, handleCustom)
      window.removeEventListener('storage', handleStorage)
    }
  },
}
