<template>
  <div class="card">
    <div class="h-64">
      <Bar v-if="chartData" :data="chartData" :options="options" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'
import { formatMonth } from '@/utils/formatters'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps<{
  labels: string[]
  values: number[]
  label?: string
  color?: string
}>()

const chartData = computed(() => ({
  labels: props.labels.map(formatMonth),
  datasets: [
    {
      label: props.label || 'Amount',
      data: props.values,
      backgroundColor: props.color || '#059669',
      borderRadius: 8,
    },
  ],
}))

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: {
      ticks: {
        callback: (value: number | string) => `₹${Number(value).toLocaleString('en-IN')}`,
      },
    },
  },
}
</script>
