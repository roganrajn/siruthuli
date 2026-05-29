export type DonationCategory =
  | 'Medical'
  | 'Education'
  | 'Food'
  | 'Emergency'
  | 'Groceries'
  | 'Others'

export interface Donation {
  id: string
  name: string
  age: number
  gender: 'Male' | 'Female' | 'Other'
  amount: number
  reason: string
  proposedBy: string
  date: string
  description: string
  photos: string[]
  category: DonationCategory
  createdAt: string
}

export interface Contribution {
  id: string
  contributorName: string
  trusteeName: string
  amount: number
  month: string
  paymentMethod?: string
  notes?: string
  isTrustee?: boolean
}

export interface Expense {
  id: string
  amount: number
  reason: string
  date: string
  bills?: string[]
  photos?: string[]
}

export interface FinanceSummary {
  id: string
  month: string
  startBalance: number
  contributed: number
  donated: number
  finalBalance: number
}

export interface HelpRequest {
  id: string
  name: string
  email: string
  phone: string
  reason: string
  description: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
}

export interface GalleryEvent {
  id: string
  title: string
  category: DonationCategory | 'General'
  date: string
  description: string
  photos: string[]
}

export interface Trustee {
  name: string
  role: string
  bio?: string
}

export interface AdminUser {
  email: string
  password: string
}

export interface AdminCredentials {
  allowedUsers: AdminUser[]
}

export interface DashboardStats {
  thisMonthCollection: number
  totalDonations: number
  remainingBalance: number
  pendingHelpRequests: number
}

export interface DonationFilters {
  search: string
  reason: string
  month: string
  trustee: string
  minAmount: string
  maxAmount: string
}
