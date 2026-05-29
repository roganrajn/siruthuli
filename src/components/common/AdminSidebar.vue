<template>
  <aside class="hidden w-64 flex-shrink-0 border-r border-gray-200 bg-white lg:block">
    <div class="border-b border-gray-200 px-6 py-5">
      <p class="text-lg font-bold text-primary-700">Siruthuli Admin</p>
    </div>
    <nav class="space-y-1 p-4">
      <RouterLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-primary-50 hover:text-primary-700"
        active-class="bg-primary-50 text-primary-700"
      >
        <span>{{ link.icon }}</span>
        {{ link.label }}
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/admin/donations', label: 'Donations', icon: '💚' },
  { to: '/admin/contributions', label: 'Contributions', icon: '🤝' },
  { to: '/admin/expenses', label: 'Expenses', icon: '📋' },
  { to: '/admin/settings', label: 'Settings', icon: '⚙️' },
]
</script>
