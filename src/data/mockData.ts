import type { Donation, Contribution, Expense, GalleryEvent, HelpRequest } from '@/types'

export const TRUSTEE_NAMES = ['Aravind', 'Azar', 'Balaji', 'Gokul', 'Kabilan', 'Nanda', 'Rogan'] as const

/** Trustee monthly amounts from spreadsheet */
const trusteeMonthlyAmounts: Record<string, Record<string, number>> = {
  '2025-10': { Aravind: 2000, Azar: 2000, Balaji: 2000, Gokul: 2000, Kabilan: 2000, Nanda: 2000, Rogan: 2000 },
  '2025-11': { Aravind: 1000, Azar: 1000, Balaji: 1000, Gokul: 1000, Kabilan: 1000, Nanda: 2000, Rogan: 1000 },
  '2025-12': { Aravind: 1000, Azar: 1000, Balaji: 1000, Gokul: 1000, Kabilan: 1000, Nanda: 2000, Rogan: 1000 },
  '2026-01': { Aravind: 1000, Azar: 1000, Balaji: 1000, Gokul: 1000, Kabilan: 1000, Nanda: 2000, Rogan: 1000 },
  '2026-02': { Aravind: 1000, Azar: 1000, Balaji: 1000, Gokul: 1000, Kabilan: 1000, Nanda: 2000, Rogan: 1000 },
  '2026-03': { Aravind: 1000, Azar: 1000, Balaji: 1000, Gokul: 1000, Kabilan: 1000, Nanda: 2000, Rogan: 1000 },
  '2026-04': { Aravind: 1000, Azar: 1000, Balaji: 1000, Gokul: 1000, Kabilan: 1000, Nanda: 2000, Rogan: 1000 },
  '2026-05': { Aravind: 1000, Azar: 1000, Balaji: 1000, Gokul: 1000, Kabilan: 1000, Nanda: 2000, Rogan: 1000 },
}

function buildTrusteeContributions(): Contribution[] {
  const items: Contribution[] = []
  let id = 1
  for (const [month, amounts] of Object.entries(trusteeMonthlyAmounts)) {
    for (const [name, amount] of Object.entries(amounts)) {
      items.push({
        id: String(id++),
        contributorName: name,
        trusteeName: name,
        amount,
        month,
        isTrustee: true,
      })
    }
  }
  return items
}

export const mockDonations: Donation[] = [
  {
    id: '1',
    name: 'Thajudeen A',
    age: 19,
    gender: 'Male',
    amount: 3000,
    reason: 'For Education',
    proposedBy: 'Azar',
    date: '2025-10-10',
    description: 'For Education',
    photos: [],
    category: 'Education',
    createdAt: '2025-10-10T10:00:00Z',
  },
  {
    id: '2',
    name: 'Siyana',
    age: 0,
    gender: 'Female',
    amount: 5000,
    reason: 'Medical Support',
    proposedBy: 'Azar',
    date: '2025-11-01',
    description:
      'Baby born in 7 month and kept NICU. Helped to grow baby weight and health.',
    photos: [],
    category: 'Medical',
    createdAt: '2025-11-01T10:00:00Z',
  },
  {
    id: '3',
    name: 'Vasanth Kumar',
    age: 21,
    gender: 'Male',
    amount: 5000,
    reason: 'Medical Emergency',
    proposedBy: 'Aravind',
    date: '2025-11-13',
    description: 'Acute Ischemic Stroke - Thalamic infarct - ICU',
    photos: [],
    category: 'Medical',
    createdAt: '2025-11-13T10:00:00Z',
  },
  {
    id: '4',
    name: 'Yogeshwaral',
    age: 25,
    gender: 'Male',
    amount: 5000,
    reason: 'Medical Emergency',
    proposedBy: 'Rogan',
    date: '2025-12-30',
    description: 'Head and Brain Injury',
    photos: [],
    category: 'Medical',
    createdAt: '2025-12-30T10:00:00Z',
  },
  {
    id: '5',
    name: 'Food distribution',
    age: 0,
    gender: 'Other',
    amount: 5345,
    reason: 'Food Support',
    proposedBy: 'Balaji',
    date: '2026-01-03',
    description: 'Given briyani to 50 people',
    photos: [],
    category: 'Food',
    createdAt: '2026-01-03T10:00:00Z',
  },
  {
    id: '6',
    name: 'Guru anna brother',
    age: 38,
    gender: 'Male',
    amount: 9084,
    reason: 'Groceries & Treatment',
    proposedBy: 'Rogan',
    date: '2026-04-23',
    description:
      'He is paralyzed and given groceries for one month (₹5,084) and ₹4,000 for their treatment',
    photos: [],
    category: 'Groceries',
    createdAt: '2026-04-23T10:00:00Z',
  },
]

export const mockContributions: Contribution[] = [
  ...buildTrusteeContributions(),
  {
    id: 'external-may-senthil',
    contributorName: 'Mr. Senthil',
    trusteeName: 'Rogan',
    amount: 1000,
    month: '2026-05',
    isTrustee: false,
    notes: 'External contributor via trustee Rogan',
  },
]

export const mockExpenses: Expense[] = []

export const mockGallery: GalleryEvent[] = [
  {
    id: '1',
    title: 'Education Support — Thajudeen A',
    category: 'Education',
    date: '2025-10-10',
    description: 'Education support for Thajudeen A.',
    photos: [],
  },
  {
    id: '2',
    title: 'Medical Support — Siyana',
    category: 'Medical',
    date: '2025-11-01',
    description: 'NICU support for premature baby Siyana.',
    photos: [],
  },
  {
    id: '3',
    title: 'Food Distribution Drive',
    category: 'Food',
    date: '2026-01-03',
    description: 'Briyani distributed to 50 people.',
    photos: [],
  },
]

export const mockHelpRequests: HelpRequest[] = []

export const trustees = [
  { name: 'Rogan', role: 'Founder & Trustee', bio: 'Passionate about community service and transparency.' },
  { name: 'Azar', role: 'Trustee', bio: 'Focused on education and youth empowerment.' },
  { name: 'Aravind', role: 'Trustee', bio: 'Leads medical outreach and emergency support.' },
  { name: 'Balaji', role: 'Trustee', bio: 'Organizes food distribution drives.' },
  { name: 'Gokul', role: 'Trustee' },
  { name: 'Kabilan', role: 'Trustee' },
  { name: 'Nanda', role: 'Trustee' },
]

const totalDonated = mockDonations.reduce((sum, d) => sum + d.amount, 0)

export const siteStats = {
  totalHelped: totalDonated,
  familiesSupported: mockDonations.length,
  coreTrustees: TRUSTEE_NAMES.length,
  monthsServing: Object.keys(trusteeMonthlyAmounts).length,
}

export const contactInfo = {
  email: 'siruthuli.foundation@gmail.com',
  instagram: '@siruthuli.foundation',
  phone: '+91 XXXXX XXXXX',
}
