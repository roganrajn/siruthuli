const VERSION_KEY = 'siruthuli_data_version'
const CURRENT_VERSION = '2'

export const STORAGE_KEYS = {
  contributions: 'siruthuli_contributions',
  donations: 'siruthuli_donations',
  expenses: 'siruthuli_expenses',
} as const

function ensureVersion(): void {
  if (localStorage.getItem(VERSION_KEY) !== CURRENT_VERSION) {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key))
    localStorage.setItem(VERSION_KEY, CURRENT_VERSION)
  }
}

export function loadCollection<T>(key: string, seed: T[]): T[] {
  ensureVersion()
  const raw = localStorage.getItem(key)
  if (raw) {
    try {
      return JSON.parse(raw) as T[]
    } catch {
      localStorage.removeItem(key)
    }
  }
  localStorage.setItem(key, JSON.stringify(seed))
  return structuredClone(seed)
}

export function saveCollection<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data))
}

export function resetAllCollections(seeds: {
  contributions: unknown[]
  donations: unknown[]
  expenses: unknown[]
}): void {
  saveCollection(STORAGE_KEYS.contributions, seeds.contributions)
  saveCollection(STORAGE_KEYS.donations, seeds.donations)
  saveCollection(STORAGE_KEYS.expenses, seeds.expenses)
}
