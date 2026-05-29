export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateStr))
}

export function formatMonth(monthStr: string): string {
  const [year, month] = monthStr.split('-')
  const date = new Date(Number(year), Number(month) - 1)
  return new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(date)
}

export function getMonthKey(date: Date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export function groupByMonth<T extends { month: string }>(items: T[]): Record<string, T[]> {
  return items.reduce<Record<string, T[]>>((acc, item) => {
    if (!acc[item.month]) acc[item.month] = []
    acc[item.month].push(item)
    return acc
  }, {})
}

export function sumBy<T>(items: T[], key: keyof T): number {
  return items.reduce((sum, item) => sum + Number(item[key] || 0), 0)
}

export const categoryColors: Record<string, string> = {
  Medical: 'bg-red-100 text-red-700',
  Education: 'bg-blue-100 text-blue-700',
  Food: 'bg-amber-100 text-amber-700',
  Emergency: 'bg-purple-100 text-purple-700',
  Groceries: 'bg-green-100 text-green-700',
  Others: 'bg-gray-100 text-gray-700',
  General: 'bg-primary-100 text-primary-700',
}
