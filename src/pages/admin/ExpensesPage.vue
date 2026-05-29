<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <p class="text-sm text-gray-500">{{ financeStore.expenses.length }} expenses</p>
      <button class="btn-primary" @click="openForm()">+ Add Expense</button>
    </div>

    <div class="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 text-left text-gray-500">
          <tr>
            <th class="px-4 py-3 font-medium">Purpose</th>
            <th class="px-4 py-3 font-medium">Amount</th>
            <th class="px-4 py-3 font-medium">Date</th>
            <th class="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="e in financeStore.expenses" :key="e.id" class="border-t border-gray-100">
            <td class="px-4 py-3 font-medium">{{ e.reason }}</td>
            <td class="px-4 py-3">{{ formatCurrency(e.amount) }}</td>
            <td class="px-4 py-3">{{ formatDate(e.date) }}</td>
            <td class="px-4 py-3">
              <button class="mr-2 text-primary-600 hover:underline" @click="openForm(e)">Edit</button>
              <button class="text-red-600 hover:underline" @click="handleDelete(e.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal :open="showForm" @close="closeForm">
      <h2 class="text-lg font-bold text-gray-900">{{ editingId ? 'Edit' : 'Add' }} Expense</h2>
      <form class="mt-4 space-y-3" @submit.prevent="handleSubmit">
        <div>
          <label class="label-field">Purpose</label>
          <input v-model="form.reason" required class="input-field" />
        </div>
        <div>
          <label class="label-field">Amount</label>
          <input v-model.number="form.amount" type="number" required class="input-field" />
        </div>
        <div>
          <label class="label-field">Date</label>
          <input v-model="form.date" type="date" required class="input-field" />
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
import { useFinanceStore } from '@/stores/financeStore'
import { formatCurrency, formatDate } from '@/utils/formatters'
import type { Expense } from '@/types'
import BaseModal from '@/components/common/BaseModal.vue'

const financeStore = useFinanceStore()
const showForm = ref(false)
const editingId = ref<string | null>(null)

const defaultForm = () => ({
  reason: '',
  amount: 0,
  date: new Date().toISOString().slice(0, 10),
})

const form = reactive(defaultForm())

function openForm(item?: Expense) {
  if (item) {
    editingId.value = item.id
    Object.assign(form, { reason: item.reason, amount: item.amount, date: item.date })
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
    await financeStore.editExpense(editingId.value, { ...form })
  } else {
    await financeStore.addExpense({ ...form })
  }
  closeForm()
}

async function handleDelete(id: string) {
  if (confirm('Delete this expense?')) {
    await financeStore.removeExpense(id)
  }
}

onMounted(() => financeStore.fetchAll())
</script>
