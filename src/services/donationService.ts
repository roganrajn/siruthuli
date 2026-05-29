import { COLLECTIONS, getAll, create, update, remove } from '@/firebase/firestore'
import { isFirebaseConfigured } from '@/firebase/config'
import { mockDonations } from '@/data/mockData'
import { loadCollection, saveCollection, STORAGE_KEYS } from '@/services/localDataStore'
import type { Donation } from '@/types'

let localDonations = loadCollection<Donation>(STORAGE_KEYS.donations, mockDonations)

export const donationService = {
  async getAll(): Promise<Donation[]> {
    if (!isFirebaseConfigured()) {
      localDonations = loadCollection(STORAGE_KEYS.donations, mockDonations)
      return [...localDonations]
    }
    try {
      return await getAll<Donation>(COLLECTIONS.donations)
    } catch {
      return [...localDonations]
    }
  },

  async create(data: Omit<Donation, 'id' | 'createdAt'>): Promise<string> {
    if (!isFirebaseConfigured()) {
      const item: Donation = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      }
      localDonations.unshift(item)
      saveCollection(STORAGE_KEYS.donations, localDonations)
      return item.id
    }
    return create(COLLECTIONS.donations, { ...data, createdAt: new Date().toISOString() })
  },

  async update(id: string, data: Partial<Donation>): Promise<void> {
    if (!isFirebaseConfigured()) {
      const idx = localDonations.findIndex((d) => d.id === id)
      if (idx >= 0) {
        localDonations[idx] = { ...localDonations[idx], ...data }
        saveCollection(STORAGE_KEYS.donations, localDonations)
      }
      return
    }
    await update(COLLECTIONS.donations, id, data)
  },

  async delete(id: string): Promise<void> {
    if (!isFirebaseConfigured()) {
      localDonations = localDonations.filter((d) => d.id !== id)
      saveCollection(STORAGE_KEYS.donations, localDonations)
      return
    }
    await remove(COLLECTIONS.donations, id)
  },
}
