<template>
  <div class="card !p-0 overflow-hidden">
    <button
      type="button"
      class="flex w-full items-center justify-between px-6 py-4 text-left transition hover:bg-gray-50"
      :class="{ 'cursor-default': isFirst }"
      @click="handleToggle"
    >
      <div>
        <h3 class="text-lg font-semibold text-gray-900">{{ formatMonth(month) }}</h3>
        <p v-if="!expanded" class="mt-0.5 text-sm text-gray-500">
          Total {{ formatCurrency(total) }} · {{ items.length }} entries
        </p>
      </div>
      <span
        v-if="!isFirst"
        class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600"
        aria-hidden="true"
      >
        <svg
          class="h-4 w-4 transition-transform duration-200"
          :class="{ 'rotate-180': expanded }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </span>
    </button>

    <div v-show="expanded" class="border-t border-gray-100 px-6 pb-6 pt-4">
      <div class="space-y-6">
        <div v-if="trusteeItems.length">
          <h4 class="mb-2 text-sm font-semibold uppercase tracking-wide text-primary-600">Trustees Contribution</h4>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-gray-100 text-left text-gray-500">
                  <th class="pb-2 font-medium">Name</th>
                  <th class="pb-2 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in trusteeItems" :key="item.id" class="border-b border-gray-50">
                  <td class="py-2">{{ item.contributorName }}</td>
                  <td class="py-2 text-right font-medium">{{ formatCurrency(item.amount) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-if="externalItems.length">
          <h4 class="mb-2 text-sm font-semibold uppercase tracking-wide text-accent-500">External Contributors</h4>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-gray-100 text-left text-gray-500">
                  <th class="pb-2 font-medium">Contributor</th>
                  <th class="pb-2 font-medium">Trustee</th>
                  <th class="pb-2 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in externalItems" :key="item.id" class="border-b border-gray-50">
                  <td class="py-2">{{ item.contributorName }}</td>
                  <td class="py-2">{{ item.trusteeName }}</td>
                  <td class="py-2 text-right font-medium">{{ formatCurrency(item.amount) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="flex items-center justify-between rounded-xl bg-primary-50 px-4 py-3">
          <span class="font-semibold text-primary-800">Total</span>
          <span class="text-xl font-bold text-primary-700">{{ formatCurrency(total) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Contribution } from '@/types'
import { formatCurrency, formatMonth, sumBy } from '@/utils/formatters'

const props = defineProps<{
  month: string
  items: Contribution[]
  expanded: boolean
  isFirst?: boolean
}>()

const emit = defineEmits<{ toggle: [] }>()

const trusteeItems = computed(() =>
  props.items.filter((i) => i.isTrustee !== false && i.contributorName === i.trusteeName),
)
const externalItems = computed(() =>
  props.items.filter((i) => i.isTrustee === false || i.contributorName !== i.trusteeName),
)
const total = computed(() => sumBy(props.items, 'amount'))

function handleToggle() {
  if (!props.isFirst) emit('toggle')
}
</script>
