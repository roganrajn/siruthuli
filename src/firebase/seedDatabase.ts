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
  const allOps: { collection: string; id: string; data: Record<string, unknown> }[] = []

  for (const donation of mockDonations) {
    const { id, ...data } = donation
    allOps.push({ collection: COLLECTIONS.donations, id, data })
  }

  for (const contribution of mockContributions) {
    const { id, ...data } = contribution
    allOps.push({
      collection: COLLECTIONS.contributions,
      id,
      data: { ...data, createdAt: new Date().toISOString() },
    })
  }

  for (const expense of mockExpenses) {
    const { id, ...data } = expense
    allOps.push({ collection: COLLECTIONS.expenses, id, data })
  }

  for (const event of mockGallery) {
    const { id, ...data } = event
    allOps.push({
      collection: COLLECTIONS.gallery,
      id,
      data: { ...data, photos: data.photos ?? [], videos: data.videos ?? [] },
    })
  }

  // Firestore batch limit is 500 operations
  const chunkSize = 450
  for (let i = 0; i < allOps.length; i += chunkSize) {
    const batch = writeBatch(db)
    const chunk = allOps.slice(i, i + chunkSize)
    for (const op of chunk) {
      batch.set(doc(db, op.collection, op.id), op.data)
    }
    await batch.commit()
  }

  return {
    donations: mockDonations.length,
    contributions: mockContributions.length,
    expenses: mockExpenses.length,
    gallery: mockGallery.length,
  }
}
