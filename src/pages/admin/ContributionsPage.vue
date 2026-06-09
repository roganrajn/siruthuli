<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <p class="text-sm text-gray-500">{{ contributionsStore.contributions.length }} contributions</p>
      <button class="btn-primary" @click="openForm()">+ Add Contribution</button>
    </div>

    <div class="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 text-left text-gray-500">
          <tr>
            <th class="px-4 py-3 font-medium">Contributor</th>
            <th class="px-4 py-3 font-medium">Trustee</th>
            <th class="px-4 py-3 font-medium">Amount</th>
            <th class="px-4 py-3 font-medium">Month</th>
            <th class="px-4 py-3 font-medium">Type</th>
            <th class="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in contributionsStore.contributions" :key="c.id" class="border-t border-gray-100">
            <td class="px-4 py-3 font-medium">{{ c.contributorName }}</td>
            <td class="px-4 py-3">{{ c.trusteeName }}</td>
            <td class="px-4 py-3">{{ formatCurrency(c.amount) }}</td>
            <td class="px-4 py-3">{{ formatMonth(c.month) }}</td>
            <td class="px-4 py-3">{{ c.isTrustee !== false && c.contributorName === c.trusteeName ? 'Trustee' : 'External' }}</td>
            <td class="px-4 py-3">
              <button class="mr-2 text-primary-600 hover:underline" @click="openForm(c)">Edit</button>
              <button class="text-red-600 hover:underline" @click="handleDelete(c.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal :open="showForm" @close="closeForm">
      <h2 class="text-lg font-bold text-gray-900">{{ editingId ? 'Edit' : 'Add' }} Contribution</h2>
      <form class="mt-4 space-y-3" @submit.prevent="handleSubmit">
        <div class="grid gap-3 sm:grid-cols-2">
          <div>
            <label class="label-field">Contributor Name</label>
            <input v-model="form.contributorName" required class="input-field" />
          </div>
          <div>
            <label class="label-field">Trustee Name</label>
            <input v-model="form.trusteeName" required class="input-field" />
          </div>
          <div>
            <label class="label-field">Amount</label>
            <input v-model.number="form.amount" type="number" required class="input-field" />
          </div>
          <div>
            <label class="label-field">Month</label>
            <input v-model="form.month" type="month" required class="input-field" />
          </div>
          <div>
            <label class="label-field">Payment Method</label>
            <input v-model="form.paymentMethod" class="input-field" />
          </div>
          <div class="flex items-end">
            <label class="flex items-center gap-2">
              <input v-model="form.isTrustee" type="checkbox" class="rounded" />
              <span class="text-sm">Trustee contribution</span>
            </label>
          </div>
        </div>
        <div>
          <label class="label-field">Notes</label>
          <textarea v-model="form.notes" rows="2" class="input-field" />
        </div>
        <div class="flex justify-end gap-3 pt-2">
          <button type="button" class="btn-secondary" @click="closeForm">Cancel</button>
          <button type="submit" class="btn-primary" :disabled="saving">
            {{ saving ? 'Saving...' : 'Save' }}
          </button>
        </div>
        <p v-if="formError" class="text-sm text-red-600">{{ formError }}</p>
      </form>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useContributionsStore } from '@/stores/contributionsStore'
import { formatCurrency, formatMonth } from '@/utils/formatters'
import type { Contribution } from '@/types'
import BaseModal from '@/components/common/BaseModal.vue'

const contributionsStore = useContributionsStore()
const showForm = ref(false)
const editingId = ref<string | null>(null)
const saving = ref(false)
const formError = ref('')

const defaultForm = () => ({
  contributorName: '',
  trusteeName: '',
  amount: 0,
  month: new Date().toISOString().slice(0, 7),
  paymentMethod: '',
  notes: '',
  isTrustee: true,
})

const form = reactive(defaultForm())

function openForm(item?: Contribution) {
  formError.value = ''
  if (item) {
    editingId.value = item.id
    Object.assign(form, {
      contributorName: item.contributorName,
      trusteeName: item.trusteeName,
      amount: item.amount,
      month: item.month,
      paymentMethod: item.paymentMethod || '',
      notes: item.notes || '',
      isTrustee: item.isTrustee !== false,
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
  saving.value = true
  formError.value = ''
  try {
    const payload = {
      ...form,
      isTrustee: form.isTrustee && form.contributorName === form.trusteeName,
    }
    if (editingId.value) {
      await contributionsStore.editContribution(editingId.value, payload)
    } else {
      await contributionsStore.addContribution(payload)
    }
    closeForm()
  } catch (err) {
    formError.value = formatFirebaseError(err)
  } finally {
    saving.value = false
  }
}

function formatFirebaseError(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err)
  if (message.includes('permission') || message.includes('PERMISSION_DENIED')) {
    return 'Permission denied. In Firebase Console → Firestore → Rules, allow read/write, then try again.'
  }
  if (message.includes('unavailable') || message.includes('not-found')) {
    return 'Firestore not reachable. Make sure the database is created and seeded in Settings.'
  }
  return message || 'Save failed. Try seeding the database in Settings first.'
}

async function handleDelete(id: string) {
  if (confirm('Delete this contribution?')) {
    await contributionsStore.removeContribution(id)
  }
}

onMounted(() => contributionsStore.fetchAll())
</script>
