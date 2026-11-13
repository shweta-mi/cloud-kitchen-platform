const API_BASE = import.meta.env?.VITE_API_BASE || '/api'
let csrfToken = ''

export async function apiRequest(path, options = {}) {
  const method = (options.method || 'GET').toUpperCase()
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: 'same-origin',
    headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(method !== 'GET' && csrfToken ? { 'X-CSRF-Token': csrfToken } : {}), ...options.headers },
  })
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.error || `Request failed (${response.status})`)
  }
  if (response.status === 204) return null
  return response.json()
}

export function subscribeToServerEvent(name, callback) {
  if (typeof window === 'undefined' || !window.EventSource) return () => {}
  const source = new EventSource(`${API_BASE}/events?resource=${encodeURIComponent(name)}`, { withCredentials: true })
  const handle = (event) => {
    try { callback(JSON.parse(event.data)) } catch (error) { console.error(`Invalid ${name} event`, error) }
  }
  source.addEventListener(name, handle)
  source.onerror = () => {
    // EventSource retries automatically when the connection returns.
  }
  return () => source.close()
}

export function setCsrfToken(token) { csrfToken = token || '' }

export const jsonBody = (value) => JSON.stringify(value)
