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

    <!-- Chart -->
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

    <!-- Month Cards -->
    <section class="mt-12 grid gap-6 lg:grid-cols-2">
      <FinanceMonthCard v-for="item in financeStore.summary" :key="item.id" :summary="item" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useFinanceStore } from '@/stores/financeStore'
import { formatCurrency } from '@/utils/formatters'
import FinanceMonthCard from '@/components/cards/FinanceMonthCard.vue'
import LineChart from '@/components/charts/LineChart.vue'

const financeStore = useFinanceStore()

const chartLabels = computed(() =>
  [...financeStore.summary].reverse().map((s) => s.month),
)
const incomeValues = computed(() =>
  [...financeStore.summary].reverse().map((s) => s.contributed),
)
const expenseValues = computed(() =>
  [...financeStore.summary].reverse().map((s) => s.donated),
)

onMounted(() => financeStore.fetchAll())
</script>
