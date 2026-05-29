import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { contributionService } from '@/services/contributionService'
import { useFinanceStore } from '@/stores/financeStore'
import { groupByMonth, sumBy } from '@/utils/formatters'
import type { Contribution } from '@/types'

export const useContributionsStore = defineStore('contributions', () => {
  const contributions = ref<Contribution[]>([])
  const loading = ref(false)

  async function fetchAll() {
    loading.value = true
    try {
      contributions.value = await contributionService.getAll()
    } finally {
      loading.value = false
    }
  }

  async function syncFinance() {
    await useFinanceStore().fetchAll()
  }

  async function addContribution(data: Omit<Contribution, 'id'>) {
    await contributionService.create(data)
    await fetchAll()
    await syncFinance()
  }

  async function editContribution(id: string, data: Partial<Contribution>) {
    await contributionService.update(id, data)
    await fetchAll()
    await syncFinance()
  }

  async function removeContribution(id: string) {
    await contributionService.delete(id)
    await fetchAll()
    await syncFinance()
  }

  const groupedByMonth = computed(() => groupByMonth(contributions.value))

  const monthlyTotals = computed(() =>
    Object.entries(groupedByMonth.value)
      .map(([month, items]) => ({ month, total: sumBy(items, 'amount') }))
      .sort((a, b) => b.month.localeCompare(a.month)),
  )

  return {
    contributions,
    loading,
    fetchAll,
    addContribution,
    editContribution,
    removeContribution,
    groupedByMonth,
    monthlyTotals,
  }
})
