import {
  collection,
  doc,
  getDocs,
  addDoc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  type DocumentData,
} from 'firebase/firestore'
import { getDb, isFirebaseConfigured } from '@/firebase/config'

export const COLLECTIONS = {
  donations: 'donations',
  contributions: 'contributions',
  expenses: 'expenses',
  financeSummary: 'finance_summary',
  helpRequests: 'help_requests',
  gallery: 'gallery',
} as const

export async function getAll<T>(collectionName: string): Promise<T[]> {
  if (!isFirebaseConfigured()) return []
  const q = query(collection(getDb(), collectionName), orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as T)
}

export async function getAllSimple<T>(collectionName: string): Promise<T[]> {
  if (!isFirebaseConfigured()) return []
  const snapshot = await getDocs(collection(getDb(), collectionName))
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as T)
}

export async function create<T extends DocumentData>(
  collectionName: string,
  data: Omit<T, 'id'>,
): Promise<string> {
  const ref = await addDoc(collection(getDb(), collectionName), {
    ...data,
    createdAt: new Date().toISOString(),
  })
  return ref.id
}

export async function update(
  collectionName: string,
  id: string,
  data: Record<string, unknown>,
): Promise<void> {
  const cleaned = Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined),
  )
  await setDoc(doc(getDb(), collectionName, id), cleaned, { merge: true })
}

export async function remove(collectionName: string, id: string): Promise<void> {
  await deleteDoc(doc(getDb(), collectionName, id))
}
