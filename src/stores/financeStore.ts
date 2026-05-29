import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { expenseService } from '@/services/expenseService'
import { financeService } from '@/services/financeService'
import { helpRequestService } from '@/services/financeService'
import { getMonthKey } from '@/utils/formatters'
import type { Expense, FinanceSummary } from '@/types'

export const useFinanceStore = defineStore('finance', () => {
  const expenses = ref<Expense[]>([])
  const summary = ref<FinanceSummary[]>([])
  const pendingRequests = ref(0)
  const loading = ref(false)

  async function fetchAll() {
    loading.value = true
    try {
      const [expenseData, summaryData, requests] = await Promise.all([
        expenseService.getAll(),
        financeService.getSummary(),
        helpRequestService.getAll(),
      ])
      expenses.value = expenseData
      summary.value = summaryData.sort((a, b) => b.month.localeCompare(a.month))
      pendingRequests.value = requests.filter((r) => r.status === 'pending').length
    } finally {
      loading.value = false
    }
  }

  async function addExpense(data: Omit<Expense, 'id'>) {
    await expenseService.create(data)
    await fetchAll()
  }

  async function editExpense(id: string, data: Partial<Expense>) {
    await expenseService.update(id, data)
    await fetchAll()
  }

  async function removeExpense(id: string) {
    await expenseService.delete(id)
    await fetchAll()
  }

  const currentBalance = computed(() => {
    if (summary.value.length === 0) return 0
    return summary.value[0].finalBalance
  })

  const thisMonthCollection = computed(() => {
    const currentMonth = getMonthKey()
    const current = summary.value.find((s) => s.month === currentMonth)
    return current?.contributed ?? 0
  })

  /** Running fund = latest month's final balance (auto-calculated) */
  const runningBalance = computed(() => currentBalance.value)

  return {
    expenses,
    summary,
    pendingRequests,
    loading,
    fetchAll,
    addExpense,
    editExpense,
    removeExpense,
    currentBalance,
    runningBalance,
    thisMonthCollection,
  }
})
