<template>
  <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
    <section class="text-center">
      <h1 class="section-title">Gallery</h1>
      <p class="section-subtitle mx-auto">
        Moments from our food distribution, medical help, and education support programs.
      </p>
    </section>

    <section class="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      <div v-for="event in events" :key="event.id" class="card overflow-hidden !p-0">
        <div class="flex h-48 items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
          <span class="text-5xl">📷</span>
        </div>
        <div class="p-6">
          <span :class="['rounded-full px-2.5 py-0.5 text-xs font-medium', categoryColors[event.category]]">
            {{ event.category }}
          </span>
          <h3 class="mt-3 text-lg font-semibold text-gray-900">{{ event.title }}</h3>
          <p class="mt-2 text-sm text-gray-600">{{ event.description }}</p>
          <p class="mt-3 text-xs text-gray-500">{{ formatDate(event.date) }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { galleryService } from '@/services/financeService'
import { formatDate, categoryColors } from '@/utils/formatters'
import type { GalleryEvent } from '@/types'

const events = ref<GalleryEvent[]>([])

onMounted(async () => {
  events.value = await galleryService.getAll()
})
</script>
