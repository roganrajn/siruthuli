<template>
  <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
    <section class="text-center">
      <h1 class="section-title">Contributions</h1>
      <p class="section-subtitle mx-auto">
        Full transparency on monthly trustee and external contributions.
      </p>
    </section>

    <section class="mt-12">
      <h2 class="text-xl font-bold text-gray-900">Contribution Trends</h2>
      <div class="mt-4">
        <BarChart
          v-if="contributionsStore.monthlyTotals.length"
          :labels="chartLabels"
          :values="chartValues"
          label="Monthly Total"
        />
      </div>
    </section>

    <section class="mt-12 space-y-4">
      <ContributionMonthCard
        v-for="(entry, index) in monthList"
        :key="entry.month"
        :month="entry.month"
        :items="entry.items"
        :expanded="index === 0 || expandedMonths.has(entry.month)"
        :is-first="index === 0"
        @toggle="toggleMonth(entry.month)"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useContributionsStore } from '@/stores/contributionsStore'
import type { Contribution } from '@/types'
import BarChart from '@/components/charts/BarChart.vue'
import ContributionMonthCard from '@/components/cards/ContributionMonthCard.vue'

const contributionsStore = useContributionsStore()
const expandedMonths = ref<Set<string>>(new Set())

const monthList = computed(() => {
  const grouped = contributionsStore.groupedByMonth
  return Object.entries(grouped)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([month, items]) => ({ month, items: items as Contribution[] }))
})

function toggleMonth(month: string) {
  const next = new Set(expandedMonths.value)
  if (next.has(month)) next.delete(month)
  else next.add(month)
  expandedMonths.value = next
}

const chartLabels = computed(() =>
  [...contributionsStore.monthlyTotals].reverse().map((m) => m.month),
)
const chartValues = computed(() =>
  [...contributionsStore.monthlyTotals].reverse().map((m) => m.total),
)
</script>
