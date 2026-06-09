import axios from 'axios'
import type { AdminCredentials } from '@/types'

const AUTH_SESSION_KEY = 'siruthuli_admin_session'

function credentialsUrl(): string {
  const base = import.meta.env.BASE_URL || '/'
  return `${base}data/admin-credentials.json`
}

function credentialsFromEnv(): AdminCredentials | null {
  const email = import.meta.env.VITE_ADMIN_EMAIL
  const password = import.meta.env.VITE_ADMIN_PASSWORD
  if (!email || !password) return null
  return { allowedUsers: [{ email, password }] }
}

export const authService = {
  async fetchCredentials(): Promise<AdminCredentials> {
    try {
      const { data } = await axios.get<AdminCredentials>(credentialsUrl())
      if (data?.allowedUsers?.length) return data
    } catch {
      // fall through to env fallback
    }

    const fromEnv = credentialsFromEnv()
    if (fromEnv) return fromEnv

    throw new Error('Could not load admin credentials')
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
