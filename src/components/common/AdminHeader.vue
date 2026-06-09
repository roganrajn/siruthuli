<template>
  <header class="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
    <h1 class="text-lg font-semibold text-gray-900">{{ title }}</h1>
    <div class="flex items-center gap-4">
      <RouterLink to="/" class="hidden text-sm font-medium text-primary-600 hover:text-primary-700 sm:inline">
        View Site
      </RouterLink>
      <span class="hidden text-sm text-gray-500 sm:inline">{{ authStore.email }}</span>
      <button class="btn-secondary !py-2 !text-xs" @click="handleLogout">Logout</button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const titles: Record<string, string> = {
  'admin-dashboard': 'Dashboard',
  'admin-donations': 'Manage Donations',
  'admin-contributions': 'Manage Contributions',
  'admin-expenses': 'Expense Tracking',
  'admin-gallery': 'Manage Gallery',
  'admin-settings': 'Settings',
}

const title = computed(() => titles[String(route.name)] || 'Admin')

function handleLogout() {
  authStore.logout()
  router.push('/admin/login')
}
</script>
