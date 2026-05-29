<template>
  <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-700 to-primary-900 px-4">
    <div class="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
      <div class="text-center">
        <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-2xl font-bold text-primary-600">
          S
        </div>
        <h1 class="mt-4 text-2xl font-bold text-gray-900">Admin Login</h1>
        <p class="mt-1 text-sm text-gray-500">Siruthuli Foundation Portal</p>
      </div>

      <form class="mt-8 space-y-4" @submit.prevent="handleLogin">
        <div>
          <label class="label-field">Email</label>
          <input v-model="email" type="email" required class="input-field" placeholder="your@email.com" />
        </div>
        <div>
          <label class="label-field">Password</label>
          <input v-model="password" type="password" required class="input-field" placeholder="••••••••" />
        </div>
        <p v-if="authStore.error" class="text-sm text-red-600">{{ authStore.error }}</p>
        <button type="submit" class="btn-primary w-full" :disabled="authStore.loading">
          {{ authStore.loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>

      <p class="mt-6 text-center text-xs text-gray-400">
        Credentials are loaded from <code class="rounded bg-gray-100 px-1">public/data/admin-credentials.json</code>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')

async function handleLogin() {
  const success = await authStore.login(email.value, password.value)
  if (success) {
    const redirect = (route.query.redirect as string) || '/admin/dashboard'
    router.push(redirect)
  }
}
</script>
