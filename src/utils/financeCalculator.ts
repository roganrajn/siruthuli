import type { Contribution, Donation, Expense, FinanceSummary } from '@/types'

function monthFromDate(date: string): string {
  return date.slice(0, 7)
}

function sumByMonth<T extends { amount: number }>(
  items: T[],
  getMonth: (item: T) => string,
  month: string,
): number {
  return items.filter((item) => getMonth(item) === month).reduce((sum, item) => sum + item.amount, 0)
}

/**
 * Rebuilds monthly finance from live data (matches Excel logic):
 * finalBalance = startBalance + contributed − donated − expenses
 */
export function computeFinanceSummary(
  contributions: Contribution[],
  donations: Donation[],
  expenses: Expense[] = [],
): FinanceSummary[] {
  const months = new Set<string>()
  contributions.forEach((c) => months.add(c.month))
  donations.forEach((d) => months.add(monthFromDate(d.date)))
  expenses.forEach((e) => months.add(monthFromDate(e.date)))

  const sortedMonths = [...months].sort()
  let runningBalance = 0
  const result: FinanceSummary[] = []

  for (const month of sortedMonths) {
    const startBalance = runningBalance
    const contributed = sumByMonth(contributions, (c) => c.month, month)
    const donated = sumByMonth(donations, (d) => monthFromDate(d.date), month)
    const expenseTotal = sumByMonth(expenses, (e) => monthFromDate(e.date), month)
    const totalOut = donated + expenseTotal
    const finalBalance = startBalance + contributed - totalOut

    result.push({
      id: month,
      month,
      startBalance,
      contributed,
      donated: totalOut,
      finalBalance,
    })

    runningBalance = finalBalance
  }

  return result.sort((a, b) => b.month.localeCompare(a.month))
}
