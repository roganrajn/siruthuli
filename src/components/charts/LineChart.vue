<template>
  <div class="card">
    <div class="h-72">
      <Line v-if="chartData" :data="chartData" :options="options" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'
import { formatMonth } from '@/utils/formatters'

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)

const props = defineProps<{
  labels: string[]
  income: number[]
  expense: number[]
}>()

const chartData = computed(() => ({
  labels: props.labels.map(formatMonth),
  datasets: [
    {
      label: 'Contributions',
      data: props.income,
      borderColor: '#059669',
      backgroundColor: 'rgba(5, 150, 105, 0.1)',
      tension: 0.3,
    },
    {
      label: 'Donations',
      data: props.expense,
      borderColor: '#f97316',
      backgroundColor: 'rgba(249, 115, 22, 0.1)',
      tension: 0.3,
    },
  ],
}))

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom' as const } },
  scales: {
    y: {
      ticks: {
        callback: (value: number | string) => `₹${Number(value).toLocaleString('en-IN')}`,
      },
    },
  },
}
</script>
