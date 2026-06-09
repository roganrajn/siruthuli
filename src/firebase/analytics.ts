import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics'
import { getFirebaseApp, isFirebaseConfigured } from '@/firebase/config'

let analytics: Analytics | null = null

export async function initAnalytics(): Promise<Analytics | null> {
  if (!isFirebaseConfigured() || !import.meta.env.VITE_FIREBASE_MEASUREMENT_ID) {
    return null
  }
  if (analytics) return analytics

  const supported = await isSupported()
  if (!supported) return null

  analytics = getAnalytics(getFirebaseApp())
  return analytics
}
