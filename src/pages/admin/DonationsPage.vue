<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <p class="text-sm text-gray-500">{{ donationsStore.donations.length }} donations</p>
      <button class="btn-primary" @click="openForm()">+ Add Donation</button>
    </div>

    <div class="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 text-left text-gray-500">
          <tr>
            <th class="px-4 py-3 font-medium">Name</th>
            <th class="px-4 py-3 font-medium">Amount</th>
            <th class="px-4 py-3 font-medium">Category</th>
            <th class="px-4 py-3 font-medium">Proposed By</th>
            <th class="px-4 py-3 font-medium">Date</th>
            <th class="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="d in donationsStore.sortedDonations" :key="d.id" class="border-t border-gray-100">
            <td class="px-4 py-3 font-medium">{{ d.name }}</td>
            <td class="px-4 py-3">{{ formatCurrency(d.amount) }}</td>
            <td class="px-4 py-3">{{ d.category }}</td>
            <td class="px-4 py-3">{{ d.proposedBy }}</td>
            <td class="px-4 py-3">{{ formatDate(d.date) }}</td>
            <td class="px-4 py-3">
              <button class="mr-2 text-primary-600 hover:underline" @click="openForm(d)">Edit</button>
              <button class="text-red-600 hover:underline" @click="handleDelete(d.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal :open="showForm" @close="closeForm">
      <h2 class="text-lg font-bold text-gray-900">{{ editingId ? 'Edit' : 'Add' }} Donation</h2>
      <form class="mt-4 space-y-3" @submit.prevent="handleSubmit">
        <div class="grid gap-3 sm:grid-cols-2">
          <div>
            <label class="label-field">Name</label>
            <input v-model="form.name" required class="input-field" />
          </div>
          <div>
            <label class="label-field">Age</label>
            <input v-model.number="form.age" type="number" required class="input-field" />
          </div>
          <div>
            <label class="label-field">Gender</label>
            <select v-model="form.gender" class="input-field">
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label class="label-field">Amount</label>
            <input v-model.number="form.amount" type="number" required class="input-field" />
          </div>
          <div>
            <label class="label-field">Category</label>
            <select v-model="form.category" class="input-field">
              <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>
          <div>
            <label class="label-field">Proposed By</label>
            <input v-model="form.proposedBy" required class="input-field" />
          </div>
          <div>
            <label class="label-field">Date</label>
            <input v-model="form.date" type="date" required class="input-field" />
          </div>
          <div>
            <label class="label-field">Reason</label>
            <input v-model="form.reason" required class="input-field" />
          </div>
        </div>
        <div>
          <label class="label-field">Description</label>
          <textarea v-model="form.description" rows="3" class="input-field" />
        </div>
        <div class="flex justify-end gap-3 pt-2">
          <button type="button" class="btn-secondary" @click="closeForm">Cancel</button>
          <button type="submit" class="btn-primary">Save</button>
        </div>
      </form>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useDonationsStore } from '@/stores/donationsStore'
import { formatCurrency, formatDate } from '@/utils/formatters'
import type { Donation, DonationCategory } from '@/types'
import BaseModal from '@/components/common/BaseModal.vue'

const donationsStore = useDonationsStore()
const showForm = ref(false)
const editingId = ref<string | null>(null)

const categories: DonationCategory[] = ['Medical', 'Education', 'Food', 'Emergency', 'Groceries', 'Others']

const defaultForm = () => ({
  name: '',
  age: 0,
  gender: 'Male' as Donation['gender'],
  amount: 0,
  reason: '',
  proposedBy: '',
  date: new Date().toISOString().slice(0, 10),
  description: '',
  photos: [] as string[],
  category: 'Others' as DonationCategory,
})

const form = reactive(defaultForm())

function openForm(donation?: Donation) {
  if (donation) {
    editingId.value = donation.id
    Object.assign(form, {
      name: donation.name,
      age: donation.age,
      gender: donation.gender,
      amount: donation.amount,
      reason: donation.reason,
      proposedBy: donation.proposedBy,
      date: donation.date,
      description: donation.description,
      photos: donation.photos,
      category: donation.category,
    })
  } else {
    editingId.value = null
    Object.assign(form, defaultForm())
  }
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  editingId.value = null
}

async function handleSubmit() {
  if (editingId.value) {
    await donationsStore.editDonation(editingId.value, { ...form })
  } else {
    await donationsStore.addDonation({ ...form })
  }
  closeForm()
}

async function handleDelete(id: string) {
  if (confirm('Delete this donation?')) {
    await donationsStore.removeDonation(id)
  }
}

onMounted(() => donationsStore.fetchAll())
</script>
