import axios from 'axios'
import type { AdminCredentials } from '@/types'

const AUTH_SESSION_KEY = 'siruthuli_admin_session'
const CREDENTIALS_URL = '/data/admin-credentials.json'

export const authService = {
  async fetchCredentials(): Promise<AdminCredentials> {
    const { data } = await axios.get<AdminCredentials>(CREDENTIALS_URL)
    return data
  },

  async login(email: string, password: string): Promise<boolean> {
    const credentials = await this.fetchCredentials()
    const user = credentials.allowedUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
    )

    if (!user) return false

    const session = btoa(JSON.stringify({ email: user.email, ts: Date.now() }))
    sessionStorage.setItem(AUTH_SESSION_KEY, session)
    return true
  },

  logout(): void {
    sessionStorage.removeItem(AUTH_SESSION_KEY)
  },

  isAuthenticated(): boolean {
    const session = sessionStorage.getItem(AUTH_SESSION_KEY)
    if (!session) return false

    try {
      const parsed = JSON.parse(atob(session)) as { email: string; ts: number }
      const maxAge = 8 * 60 * 60 * 1000
      return Date.now() - parsed.ts < maxAge
    } catch {
      return false
    }
  },

  getSessionEmail(): string | null {
    const session = sessionStorage.getItem(AUTH_SESSION_KEY)
    if (!session) return null
    try {
      return (JSON.parse(atob(session)) as { email: string }).email
    } catch {
      return null
    }
  },
}
