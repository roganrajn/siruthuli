import { COLLECTIONS, getAllSimple, create, update, remove } from '@/firebase/firestore'
import { isFirebaseConfigured } from '@/firebase/config'
import { mockExpenses } from '@/data/mockData'
import { loadCollection, saveCollection, STORAGE_KEYS } from '@/services/localDataStore'
import type { Expense } from '@/types'

let localExpenses = loadCollection<Expense>(STORAGE_KEYS.expenses, mockExpenses)

export const expenseService = {
  async getAll(): Promise<Expense[]> {
    if (!isFirebaseConfigured()) {
      localExpenses = loadCollection(STORAGE_KEYS.expenses, mockExpenses)
      return [...localExpenses]
    }
    try {
      return await getAllSimple<Expense>(COLLECTIONS.expenses)
    } catch {
      return [...localExpenses]
    }
  },

  async create(data: Omit<Expense, 'id'>): Promise<string> {
    if (!isFirebaseConfigured()) {
      const item: Expense = { ...data, id: crypto.randomUUID() }
      localExpenses.unshift(item)
      saveCollection(STORAGE_KEYS.expenses, localExpenses)
      return item.id
    }
    return create(COLLECTIONS.expenses, data)
  },

  async update(id: string, data: Partial<Expense>): Promise<void> {
    if (!isFirebaseConfigured()) {
      const idx = localExpenses.findIndex((e) => e.id === id)
      if (idx >= 0) {
        localExpenses[idx] = { ...localExpenses[idx], ...data }
        saveCollection(STORAGE_KEYS.expenses, localExpenses)
      }
      return
    }
    await update(COLLECTIONS.expenses, id, data)
  },

  async delete(id: string): Promise<void> {
    if (!isFirebaseConfigured()) {
      localExpenses = localExpenses.filter((e) => e.id !== id)
      saveCollection(STORAGE_KEYS.expenses, localExpenses)
      return
    }
    await remove(COLLECTIONS.expenses, id)
  },
}
