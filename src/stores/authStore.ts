import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/authService'

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(authService.isAuthenticated())
  const email = ref<string | null>(authService.getSessionEmail())
  const error = ref('')
  const loading = ref(false)

  async function login(loginEmail: string, password: string) {
    loading.value = true
    error.value = ''
    try {
      const success = await authService.login(loginEmail, password)
      if (success) {
        isLoggedIn.value = true
        email.value = loginEmail
        return true
      }
      error.value = 'Invalid email or password'
      return false
    } catch {
      error.value = 'Could not load credentials. Check admin-credentials.json'
      return false
    } finally {
      loading.value = false
    }
  }

  function logout() {
    authService.logout()
    isLoggedIn.value = false
    email.value = null
  }

  function checkSession() {
    isLoggedIn.value = authService.isAuthenticated()
    email.value = authService.getSessionEmail()
  }

  const isAuthenticated = computed(() => isLoggedIn.value)

  return { isLoggedIn, email, error, loading, login, logout, checkSession, isAuthenticated }
})
