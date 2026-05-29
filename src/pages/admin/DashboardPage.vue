<template>
  <div>
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="stat in dashboardStats" :key="stat.label" class="card">
        <p class="text-sm font-medium text-gray-500">{{ stat.label }}</p>
        <p class="mt-2 text-2xl font-bold" :class="stat.color">{{ stat.value }}</p>
      </div>
    </div>

    <div class="mt-8 grid gap-6 lg:grid-cols-2">
      <div class="card">
        <h2 class="font-semibold text-gray-900">Recent Donations</h2>
        <div class="mt-4 space-y-3">
          <div
            v-for="d in donationsStore.recentDonations.slice(0, 5)"
            :key="d.id"
            class="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3"
          >
            <div>
              <p class="font-medium text-gray-900">{{ d.name }}</p>
              <p class="text-xs text-gray-500">{{ d.reason }}</p>
            </div>
            <p class="font-semibold text-primary-600">{{ formatCurrency(d.amount) }}</p>
          </div>
        </div>
      </div>

      <div class="card">
        <h2 class="font-semibold text-gray-900">Quick Actions</h2>
        <div class="mt-4 grid gap-3">
          <RouterLink to="/admin/donations" class="btn-primary text-center">Add Donation</RouterLink>
          <RouterLink to="/admin/contributions" class="btn-secondary text-center">Add Contribution</RouterLink>
          <RouterLink to="/admin/expenses" class="btn-secondary text-center">Track Expense</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useDonationsStore } from '@/stores/donationsStore'
import { useFinanceStore } from '@/stores/financeStore'
import { formatCurrency } from '@/utils/formatters'

const donationsStore = useDonationsStore()
const financeStore = useFinanceStore()

const dashboardStats = computed(() => [
  {
    label: 'This Month Collection',
    value: formatCurrency(financeStore.thisMonthCollection),
    color: 'text-primary-600',
  },
  {
    label: 'Total Donations',
    value: formatCurrency(donationsStore.totalHelped),
    color: 'text-primary-600',
  },
  {
    label: 'Remaining Balance',
    value: formatCurrency(financeStore.currentBalance),
    color: 'text-emerald-600',
  },
  {
    label: 'Pending Help Requests',
    value: String(financeStore.pendingRequests),
    color: 'text-accent-500',
  },
])

onMounted(async () => {
  await Promise.all([donationsStore.fetchAll(), financeStore.fetchAll()])
})
</script>
