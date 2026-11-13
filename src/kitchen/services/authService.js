import { apiRequest, jsonBody, setCsrfToken } from '../../shared/api'

export const authService = {
  async getSession() {
    const session = await apiRequest('/auth/session')
    setCsrfToken(session.csrfToken)
    return session
  },
  async login(password) {
    const result = await apiRequest('/auth/login', { method: 'POST', body: jsonBody({ password }) })
    setCsrfToken(result.csrfToken)
    return result
  },
  async logout() {
    await apiRequest('/auth/logout', { method: 'POST' })
    setCsrfToken('')
  },
}
