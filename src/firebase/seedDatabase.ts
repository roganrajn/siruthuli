import { collection, doc, getDocs, writeBatch } from 'firebase/firestore'
import { getDb, isFirebaseConfigured } from '@/firebase/config'
import { COLLECTIONS } from '@/firebase/firestore'
import { mockContributions, mockDonations, mockExpenses, mockGallery } from '@/data/mockData'

export async function isDatabaseEmpty(): Promise<boolean> {
  if (!isFirebaseConfigured()) return false

  const collections = [
    COLLECTIONS.donations,
    COLLECTIONS.contributions,
    COLLECTIONS.expenses,
  ]

  for (const name of collections) {
    const snapshot = await getDocs(collection(getDb(), name))
    if (!snapshot.empty) return false
  }
  return true
}

export async function seedDatabase(): Promise<{ donations: number; contributions: number; expenses: number; gallery: number }> {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase is not configured')
  }

  const db = getDb()
  const batch = writeBatch(db)

  for (const donation of mockDonations) {
    const { id, ...data } = donation
    batch.set(doc(db, COLLECTIONS.donations, id), data)
  }

  for (const contribution of mockContributions) {
    const { id, ...data } = contribution
    batch.set(doc(db, COLLECTIONS.contributions, id), {
      ...data,
      createdAt: new Date().toISOString(),
    })
  }

  for (const expense of mockExpenses) {
    const { id, ...data } = expense
    batch.set(doc(db, COLLECTIONS.expenses, id), data)
  }

  for (const event of mockGallery) {
    const { id, ...data } = event
    batch.set(doc(db, COLLECTIONS.gallery, id), data)
  }

  await batch.commit()

  return {
    donations: mockDonations.length,
    contributions: mockContributions.length,
    expenses: mockExpenses.length,
    gallery: mockGallery.length,
  }
}
