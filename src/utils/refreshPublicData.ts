import { useContributionsStore } from '@/stores/contributionsStore'
import { useDonationsStore } from '@/stores/donationsStore'
import { useFinanceStore } from '@/stores/financeStore'

/** Reload all public-facing data from storage / Firebase */
export async function refreshAllPublicData(): Promise<void> {
  const contributionsStore = useContributionsStore()
  const donationsStore = useDonationsStore()
  const financeStore = useFinanceStore()

  await Promise.all([
    contributionsStore.fetchAll(),
    donationsStore.fetchAll(),
    financeStore.fetchAll(),
  ])
}
