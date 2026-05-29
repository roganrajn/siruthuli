import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { donationService } from '@/services/donationService'
import { useFinanceStore } from '@/stores/financeStore'
import type { Donation, DonationFilters } from '@/types'

export const useDonationsStore = defineStore('donations', () => {
  const donations = ref<Donation[]>([])
  const loading = ref(false)
  const filters = ref<DonationFilters>({
    search: '',
    reason: '',
    month: '',
    trustee: '',
    minAmount: '',
    maxAmount: '',
  })

  async function fetchAll() {
    loading.value = true
    try {
      donations.value = await donationService.getAll()
    } finally {
      loading.value = false
    }
  }

  async function syncFinance() {
    await useFinanceStore().fetchAll()
  }

  async function addDonation(data: Omit<Donation, 'id' | 'createdAt'>) {
    await donationService.create(data)
    await fetchAll()
    await syncFinance()
  }

  async function editDonation(id: string, data: Partial<Donation>) {
    await donationService.update(id, data)
    await fetchAll()
    await syncFinance()
  }

  async function removeDonation(id: string) {
    await donationService.delete(id)
    await fetchAll()
    await syncFinance()
  }

  function sortByDateDesc(items: Donation[]): Donation[] {
    return [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  const filteredDonations = computed(() => {
    const filtered = donations.value.filter((d) => {
      const search = filters.value.search.toLowerCase()
      if (search && !d.name.toLowerCase().includes(search) && !d.reason.toLowerCase().includes(search)) {
        return false
      }
      if (filters.value.reason && d.reason !== filters.value.reason) return false
      if (filters.value.trustee && d.proposedBy !== filters.value.trustee) return false
      if (filters.value.month && !d.date.startsWith(filters.value.month)) return false
      if (filters.value.minAmount && d.amount < Number(filters.value.minAmount)) return false
      if (filters.value.maxAmount && d.amount > Number(filters.value.maxAmount)) return false
      return true
    })
    return sortByDateDesc(filtered)
  })

  const sortedDonations = computed(() => sortByDateDesc(donations.value))

  const totalHelped = computed(() => donations.value.reduce((sum, d) => sum + d.amount, 0))
  const recentDonations = computed(() =>
    [...donations.value].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 6),
  )

  const uniqueReasons = computed(() => [...new Set(donations.value.map((d) => d.reason))])
  const uniqueTrustees = computed(() => [...new Set(donations.value.map((d) => d.proposedBy))])

  return {
    donations,
    loading,
    filters,
    fetchAll,
    addDonation,
    editDonation,
    removeDonation,
    filteredDonations,
    sortedDonations,
    totalHelped,
    recentDonations,
    uniqueReasons,
    uniqueTrustees,
  }
})
