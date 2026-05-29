<template>
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <div v-for="stat in stats" :key="stat.label" class="card text-center">
      <p class="text-3xl font-bold text-primary-600">{{ stat.value }}</p>
      <p class="mt-2 text-sm font-medium text-gray-600">{{ stat.label }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  stats: { label: string; value: string }[]
}>()
</script>
