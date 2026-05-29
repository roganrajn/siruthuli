<template>
  <header class="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
    <nav class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
      <RouterLink to="/" class="flex items-center gap-2">
        <div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-lg font-bold text-white">
          S
        </div>
        <div>
          <p class="text-lg font-bold text-gray-900">Siruthuli</p>
          <p class="text-xs text-primary-600">Foundation</p>
        </div>
      </RouterLink>

      <div class="hidden items-center gap-8 md:flex">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="text-sm font-medium text-gray-600 transition hover:text-primary-600"
          active-class="!text-primary-600"
        >
          {{ link.label }}
        </RouterLink>
      </div>

      <button class="md:hidden" @click="mobileOpen = !mobileOpen" aria-label="Toggle menu">
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </nav>

    <div v-if="mobileOpen" class="border-t border-gray-100 bg-white px-4 py-4 md:hidden">
      <RouterLink
        v-for="link in navLinks"
        :key="link.to"
        :to="link.to"
        class="block py-2 text-sm font-medium text-gray-600"
        @click="mobileOpen = false"
      >
        {{ link.label }}
      </RouterLink>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const mobileOpen = ref(false)

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/contributions', label: 'Contributions' },
  { to: '/transparency', label: 'Transparency' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
]
</script>
