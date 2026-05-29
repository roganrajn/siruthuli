import { COLLECTIONS, getAllSimple, create } from '@/firebase/firestore'
import { isFirebaseConfigured } from '@/firebase/config'
import { mockHelpRequests, mockGallery } from '@/data/mockData'
import { contributionService } from '@/services/contributionService'
import { donationService } from '@/services/donationService'
import { expenseService } from '@/services/expenseService'
import { computeFinanceSummary } from '@/utils/financeCalculator'
import type { FinanceSummary, HelpRequest, GalleryEvent } from '@/types'

export const financeService = {
  async getSummary(): Promise<FinanceSummary[]> {
    const [contributions, donations, expenses] = await Promise.all([
      contributionService.getAll(),
      donationService.getAll(),
      expenseService.getAll(),
    ])
    return computeFinanceSummary(contributions, donations, expenses)
  },

  async createSummary(data: Omit<FinanceSummary, 'id'>): Promise<string> {
    if (!isFirebaseConfigured()) {
      return data.month
    }
    return create(COLLECTIONS.financeSummary, data)
  },
}

export const helpRequestService = {
  async getAll(): Promise<HelpRequest[]> {
    if (!isFirebaseConfigured()) return [...mockHelpRequests]
    try {
      return await getAllSimple<HelpRequest>(COLLECTIONS.helpRequests)
    } catch {
      return [...mockHelpRequests]
    }
  },

  async create(data: Omit<HelpRequest, 'id' | 'createdAt' | 'status'>): Promise<string> {
    const payload = { ...data, status: 'pending' as const, createdAt: new Date().toISOString() }
    if (!isFirebaseConfigured()) {
      mockHelpRequests.unshift({ ...payload, id: crypto.randomUUID() })
      return mockHelpRequests[0].id
    }
    return create(COLLECTIONS.helpRequests, payload)
  },
}

export const galleryService = {
  async getAll(): Promise<GalleryEvent[]> {
    if (!isFirebaseConfigured()) return [...mockGallery]
    try {
      return await getAllSimple<GalleryEvent>(COLLECTIONS.gallery)
    } catch {
      return [...mockGallery]
    }
  },
}
