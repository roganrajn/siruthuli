<template>
  <button
    class="card w-full cursor-pointer text-left transition hover:-translate-y-1 hover:shadow-md"
    @click="$emit('click')"
  >
    <div class="flex items-start gap-4">
      <div
        class="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-primary-100 text-2xl text-primary-600"
      >
        {{ donation.name.charAt(0) }}
      </div>
      <div class="min-w-0 flex-1">
        <div class="flex items-start justify-between gap-2">
          <div>
            <h3 class="font-semibold text-gray-900">{{ donation.name }}</h3>
            <p class="text-sm text-gray-500">{{ donation.age }} • {{ donation.gender }}</p>
          </div>
          <span :class="['rounded-full px-2.5 py-0.5 text-xs font-medium', categoryColors[donation.category]]">
            {{ donation.category }}
          </span>
        </div>
        <p class="mt-2 text-lg font-bold text-primary-600">{{ formatCurrency(donation.amount) }} Helped</p>
        <p class="text-sm text-gray-600">{{ donation.reason }}</p>
        <div class="mt-3 flex items-center justify-between text-xs text-gray-500">
          <span>Proposed By: {{ donation.proposedBy }}</span>
          <span>{{ formatDate(donation.date) }}</span>
        </div>
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
import type { Donation } from '@/types'
import { formatCurrency, formatDate, categoryColors } from '@/utils/formatters'

defineProps<{ donation: Donation }>()
defineEmits<{ click: [] }>()
</script>
