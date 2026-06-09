<template>
  <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
    <section class="text-center">
      <h1 class="section-title">Financial Transparency</h1>
      <p class="section-subtitle mx-auto">
        Every rupee accounted for. Building trust through complete openness.
      </p>
    </section>

    <!-- Running Balance -->
    <section class="mt-12">
      <div class="rounded-2xl bg-gradient-to-r from-primary-600 to-primary-700 p-8 text-center text-white">
        <p class="text-sm font-medium uppercase tracking-wide text-primary-200">Current Available Fund</p>
        <p class="mt-2 text-4xl font-bold md:text-5xl">{{ formatCurrency(financeStore.currentBalance) }}</p>
      </div>
    </section>

    <!-- Chart — all months overall -->
    <section class="mt-12">
      <h2 class="text-xl font-bold text-gray-900">Monthly Financial Overview</h2>
      <div class="mt-4">
        <LineChart
          v-if="financeStore.summary.length"
          :labels="chartLabels"
          :income="incomeValues"
          :expense="expenseValues"
        />
      </div>
    </section>

    <!-- Month cards — filtered by year -->
    <section class="mt-12">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <h2 class="text-xl font-bold text-gray-900">Month-wise Breakdown</h2>
        <div class="flex items-center gap-2">
          <label class="text-sm font-medium text-gray-600">Year</label>
          <select v-model="selectedYear" class="input-field !w-auto min-w-[120px]">
            <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
          </select>
        </div>
      </div>

      <div v-if="filteredByYear.length" class="mt-6 grid gap-6 lg:grid-cols-2">
        <FinanceMonthCard v-for="item in filteredByYear" :key="item.id" :summary="item" />
      </div>
      <p v-else class="mt-6 rounded-xl bg-gray-50 py-12 text-center text-gray-500">
        No monthly data for {{ selectedYear }}.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useFinanceStore } from '@/stores/financeStore'
import { formatCurrency } from '@/utils/formatters'
import FinanceMonthCard from '@/components/cards/FinanceMonthCard.vue'
import LineChart from '@/components/charts/LineChart.vue'

const financeStore = useFinanceStore()
const selectedYear = ref('2026')

const availableYears = computed(() => {
  const years = new Set(financeStore.summary.map((s) => s.month.split('-')[0]))
  if (!years.has('2026')) years.add('2026')
  return [...years].sort((a, b) => b.localeCompare(a))
})

const filteredByYear = computed(() =>
  financeStore.summary
    .filter((s) => s.month.startsWith(selectedYear.value))
    .sort((a, b) => b.month.localeCompare(a.month)),
)

const chartLabels = computed(() =>
  [...financeStore.summary].reverse().map((s) => s.month),
)
const incomeValues = computed(() =>
  [...financeStore.summary].reverse().map((s) => s.contributed),
)
const expenseValues = computed(() =>
  [...financeStore.summary].reverse().map((s) => s.donated),
)
</script>
