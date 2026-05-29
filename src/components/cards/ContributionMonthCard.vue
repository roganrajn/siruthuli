<template>
  <div class="card">
    <h3 class="text-lg font-semibold text-gray-900">{{ formatMonth(month) }}</h3>
    <div class="mt-4 space-y-6">
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
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Contribution } from '@/types'
import { formatCurrency, formatMonth, sumBy } from '@/utils/formatters'

const props = defineProps<{ month: string; items: Contribution[] }>()

const trusteeItems = computed(() => props.items.filter((i) => i.isTrustee !== false && i.contributorName === i.trusteeName))
const externalItems = computed(() => props.items.filter((i) => i.isTrustee === false || i.contributorName !== i.trusteeName))
const total = computed(() => sumBy(props.items, 'amount'))
</script>
