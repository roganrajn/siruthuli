<template>
  <BaseModal :open="!!donation" @close="$emit('close')">
    <template v-if="donation">
      <div class="flex items-start gap-4">
        <div
          class="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-primary-100 text-2xl font-bold text-primary-600"
        >
          {{ donation.name.charAt(0) }}
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-900">{{ donation.name }}</h2>
          <p class="text-sm text-gray-500">{{ donation.age }} • {{ donation.gender }}</p>
          <span :class="['mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium', categoryColors[donation.category]]">
            {{ donation.category }}
          </span>
        </div>
      </div>

      <div class="mt-6 space-y-4">
        <div>
          <p class="text-sm font-medium text-gray-500">Amount Helped</p>
          <p class="text-2xl font-bold text-primary-600">{{ formatCurrency(donation.amount) }}</p>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500">Reason</p>
          <p class="text-gray-900">{{ donation.reason }}</p>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500">Story</p>
          <p class="text-gray-700">{{ donation.description }}</p>
        </div>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p class="font-medium text-gray-500">Proposed By</p>
            <p>{{ donation.proposedBy }}</p>
          </div>
          <div>
            <p class="font-medium text-gray-500">Date</p>
            <p>{{ formatDate(donation.date) }}</p>
          </div>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import type { Donation } from '@/types'
import { formatCurrency, formatDate, categoryColors } from '@/utils/formatters'
import BaseModal from '@/components/common/BaseModal.vue'

defineProps<{ donation: Donation | null }>()
defineEmits<{ close: [] }>()
</script>
