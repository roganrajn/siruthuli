<template>
  <div class="flex flex-wrap items-center justify-end gap-3 text-sm">
    <div class="flex items-center gap-2 text-gray-600">
      <span>Per page</span>
      <select
        :value="pageSize"
        class="rounded-lg border border-gray-300 px-2 py-1.5 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        @change="$emit('update:pageSize', Number(($event.target as HTMLSelectElement).value))"
      >
        <option v-for="size in pageSizeOptions" :key="size" :value="size">{{ size }}</option>
      </select>
    </div>

    <span class="text-gray-500">
      {{ startItem }}–{{ endItem }} of {{ total }}
    </span>

    <div class="flex items-center gap-1">
      <button
        type="button"
        class="rounded-lg border border-gray-300 px-3 py-1.5 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        :disabled="page <= 1"
        @click="$emit('update:page', page - 1)"
      >
        Previous
      </button>
      <button
        type="button"
        class="rounded-lg border border-gray-300 px-3 py-1.5 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        :disabled="page >= totalPages"
        @click="$emit('update:page', page + 1)"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    page: number
    pageSize: number
    total: number
    pageSizeOptions?: number[]
  }>(),
  {
    pageSizeOptions: () => [6, 7, 10, 20, 50, 100],
  },
)

defineEmits<{
  'update:page': [value: number]
  'update:pageSize': [value: number]
}>()

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))

const startItem = computed(() => (props.total === 0 ? 0 : (props.page - 1) * props.pageSize + 1))

const endItem = computed(() => Math.min(props.page * props.pageSize, props.total))
</script>
