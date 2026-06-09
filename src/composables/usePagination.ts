import { ref, computed, watch, type Ref } from 'vue'

export function usePagination<T>(items: Ref<T[]>, defaultPageSize = 7) {
  const page = ref(1)
  const pageSize = ref(defaultPageSize)

  const totalPages = computed(() => Math.max(1, Math.ceil(items.value.length / pageSize.value)))

  const paginatedItems = computed(() => {
    const start = (page.value - 1) * pageSize.value
    return items.value.slice(start, start + pageSize.value)
  })

  watch([items, pageSize], () => {
    if (page.value > totalPages.value) {
      page.value = totalPages.value
    }
  })

  watch(pageSize, () => {
    page.value = 1
  })

  return { page, pageSize, paginatedItems, totalPages }
}
