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

    <section class="mt-12 space-y-6">
      <ContributionMonthCard
        v-for="(items, month) in sortedMonths"
        :key="month"
        :month="month"
        :items="items"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useContributionsStore } from '@/stores/contributionsStore'
import BarChart from '@/components/charts/BarChart.vue'
import ContributionMonthCard from '@/components/cards/ContributionMonthCard.vue'

const contributionsStore = useContributionsStore()

const sortedMonths = computed(() => {
  const grouped = contributionsStore.groupedByMonth
  return Object.fromEntries(
    Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a)),
  )
})

const chartLabels = computed(() =>
  [...contributionsStore.monthlyTotals].reverse().map((m) => m.month),
)
const chartValues = computed(() =>
  [...contributionsStore.monthlyTotals].reverse().map((m) => m.total),
)

onMounted(() => contributionsStore.fetchAll())
</script>
