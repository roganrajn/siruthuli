<template>
  <div class="card">
    <h3 class="text-lg font-semibold text-gray-900">{{ formatMonth(summary.month) }}</h3>
    <div class="mt-4 grid gap-3 sm:grid-cols-2">
      <div class="rounded-xl bg-gray-50 p-4">
        <p class="text-xs font-medium uppercase text-gray-500">Start Balance</p>
        <p class="mt-1 text-xl font-bold text-gray-900">{{ formatCurrency(summary.startBalance) }}</p>
      </div>
      <div class="rounded-xl bg-primary-50 p-4">
        <p class="text-xs font-medium uppercase text-primary-600">Contribution</p>
        <p class="mt-1 text-xl font-bold text-primary-700">{{ formatCurrency(summary.contributed) }}</p>
      </div>
      <div class="rounded-xl bg-accent-500/10 p-4">
        <p class="text-xs font-medium uppercase text-accent-600">Donation</p>
        <p class="mt-1 text-xl font-bold text-accent-600">{{ formatCurrency(summary.donated) }}</p>
      </div>
      <div class="rounded-xl bg-emerald-100 p-4">
        <p class="text-xs font-medium uppercase text-emerald-700">Final Balance</p>
        <p class="mt-1 text-xl font-bold text-emerald-800">{{ formatCurrency(summary.finalBalance) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FinanceSummary } from '@/types'
import { formatCurrency, formatMonth } from '@/utils/formatters'

defineProps<{ summary: FinanceSummary }>()
</script>
