<template>
  <div>
    <!-- Hero -->
    <section class="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 text-white">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-white/20" />
        <div class="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-accent-500/30" />
      </div>
      <div class="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <p class="text-sm font-semibold uppercase tracking-widest text-primary-200">Siruthuli Foundation</p>
        <h1 class="mt-4 max-w-3xl text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
          Every small drop creates an ocean of kindness
        </h1>
        <p class="mt-6 max-w-2xl text-lg text-primary-100">
          Helping people in medical emergencies, education, food support and critical needs.
        </p>
        <div class="mt-8 flex flex-wrap gap-4">
          <RouterLink to="/transparency" class="btn-accent">View Transparency</RouterLink>
          <RouterLink to="/contact" class="btn-secondary !border-white/30 !bg-white/10 !text-white hover:!bg-white/20">
            Contact Us
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <StatCard :stats="stats" />
    </section>

    <!-- Recent Helps -->
    <section class="bg-white py-16">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 class="section-title">Recent Helps</h2>
        <p class="section-subtitle">Real stories of people we've supported together.</p>

        <!-- Filters -->
        <div class="mt-8 grid gap-4 rounded-2xl bg-gray-50 p-4 sm:grid-cols-2 lg:grid-cols-3">
          <input v-model="donationsStore.filters.search" type="text" placeholder="Search by name..." class="input-field" />
          <select v-model="donationsStore.filters.reason" class="input-field">
            <option value="">All Reasons</option>
            <option v-for="r in donationsStore.uniqueReasons" :key="r" :value="r">{{ r }}</option>
          </select>
          <select v-model="donationsStore.filters.trustee" class="input-field">
            <option value="">All Trustees</option>
            <option v-for="t in donationsStore.uniqueTrustees" :key="t" :value="t">{{ t }}</option>
          </select>
          <input v-model="donationsStore.filters.month" type="month" class="input-field" />
          <input v-model="donationsStore.filters.minAmount" type="number" placeholder="Min amount" class="input-field" />
          <input v-model="donationsStore.filters.maxAmount" type="number" placeholder="Max amount" class="input-field" />
        </div>

        <div v-if="donationsStore.loading" class="mt-8 text-center text-gray-500">Loading...</div>
        <template v-else>
          <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <DonationCard
              v-for="donation in paginatedItems"
              :key="donation.id"
              :donation="donation"
              @click="selectedDonation = donation"
            />
          </div>

          <div v-if="donationsStore.filteredDonations.length" class="mt-8">
            <PaginationControls
              v-model:page="page"
              v-model:page-size="pageSize"
              :total="donationsStore.filteredDonations.length"
            />
          </div>

          <p v-else class="mt-8 text-center text-gray-500">No helps match your filters.</p>
        </template>
      </div>
    </section>

    <DonationDetailModal :donation="selectedDonation" @close="selectedDonation = null" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useDonationsStore } from '@/stores/donationsStore'
import { useFinanceStore } from '@/stores/financeStore'
import { usePagination } from '@/composables/usePagination'
import { TRUSTEE_NAMES } from '@/data/mockData'
import { formatCurrency } from '@/utils/formatters'
import type { Donation } from '@/types'
import StatCard from '@/components/cards/StatCard.vue'
import DonationCard from '@/components/cards/DonationCard.vue'
import DonationDetailModal from '@/components/cards/DonationDetailModal.vue'
import PaginationControls from '@/components/common/PaginationControls.vue'

const donationsStore = useDonationsStore()
const financeStore = useFinanceStore()
const selectedDonation = ref<Donation | null>(null)

const filtered = computed(() => donationsStore.filteredDonations)
const { page, pageSize, paginatedItems } = usePagination(filtered, 7)

watch(
  () => donationsStore.filters,
  () => {
    page.value = 1
  },
  { deep: true },
)

const stats = computed(() => [
  { label: 'Total Helped', value: formatCurrency(donationsStore.totalHelped) + '+' },
  { label: 'Families Supported', value: donationsStore.donations.length + '+' },
  { label: 'Core Trustees', value: String(TRUSTEE_NAMES.length) },
  {
    label: 'Months Serving',
    value: (financeStore.summary.length || 0) + ' Months',
  },
])
</script>
