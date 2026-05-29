import { COLLECTIONS, getAllSimple, create, update, remove } from '@/firebase/firestore'
import { isFirebaseConfigured } from '@/firebase/config'
import { mockContributions } from '@/data/mockData'
import { loadCollection, saveCollection, STORAGE_KEYS } from '@/services/localDataStore'
import type { Contribution } from '@/types'

let localContributions = loadCollection<Contribution>(STORAGE_KEYS.contributions, mockContributions)

export const contributionService = {
  async getAll(): Promise<Contribution[]> {
    if (!isFirebaseConfigured()) {
      localContributions = loadCollection(STORAGE_KEYS.contributions, mockContributions)
      return [...localContributions]
    }
    try {
      return await getAllSimple<Contribution>(COLLECTIONS.contributions)
    } catch {
      return [...localContributions]
    }
  },

  async create(data: Omit<Contribution, 'id'>): Promise<string> {
    if (!isFirebaseConfigured()) {
      const item: Contribution = { ...data, id: crypto.randomUUID() }
      localContributions.unshift(item)
      saveCollection(STORAGE_KEYS.contributions, localContributions)
      return item.id
    }
    return create(COLLECTIONS.contributions, data)
  },

  async update(id: string, data: Partial<Contribution>): Promise<void> {
    if (!isFirebaseConfigured()) {
      const idx = localContributions.findIndex((c) => c.id === id)
      if (idx >= 0) {
        localContributions[idx] = { ...localContributions[idx], ...data }
        saveCollection(STORAGE_KEYS.contributions, localContributions)
      }
      return
    }
    await update(COLLECTIONS.contributions, id, data)
  },

  async delete(id: string): Promise<void> {
    if (!isFirebaseConfigured()) {
      localContributions = localContributions.filter((c) => c.id !== id)
      saveCollection(STORAGE_KEYS.contributions, localContributions)
      return
    }
    await remove(COLLECTIONS.contributions, id)
  },
}
