<template>
  <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
    <section class="text-center">
      <h1 class="section-title">Contact Us</h1>
      <p class="section-subtitle mx-auto">Reach out to us. We'd love to hear from you.</p>
    </section>

    <div class="mt-12 grid gap-8 lg:grid-cols-2">
      <div class="space-y-6">
        <div class="card">
          <h2 class="text-lg font-semibold text-gray-900">Reach Us</h2>
          <div class="mt-4 space-y-4">
            <div>
              <p class="text-sm font-medium text-gray-500">Email</p>
              <p class="text-primary-600">{{ contactInfo.email }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Instagram</p>
              <p class="text-primary-600">{{ contactInfo.instagram }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Phone</p>
              <p>{{ contactInfo.phone }}</p>
            </div>
          </div>
        </div>

        <div class="card bg-primary-50">
          <h2 class="text-lg font-semibold text-primary-800">Volunteer With Us</h2>
          <p class="mt-2 text-sm text-primary-700">
            Join our mission to help people in need. Every contribution of time makes a difference.
          </p>
        </div>
      </div>

      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900">Request Help</h2>
        <p class="mt-1 text-sm text-gray-500">Submit a request and our team will review it.</p>

        <form class="mt-6 space-y-4" @submit.prevent="submitRequest">
          <div>
            <label class="label-field">Name</label>
            <input v-model="form.name" required class="input-field" />
          </div>
          <div>
            <label class="label-field">Email</label>
            <input v-model="form.email" type="email" required class="input-field" />
          </div>
          <div>
            <label class="label-field">Phone</label>
            <input v-model="form.phone" required class="input-field" />
          </div>
          <div>
            <label class="label-field">Reason</label>
            <select v-model="form.reason" required class="input-field">
              <option value="Medical">Medical</option>
              <option value="Education">Education</option>
              <option value="Food">Food</option>
              <option value="Emergency">Emergency</option>
              <option value="Others">Others</option>
            </select>
          </div>
          <div>
            <label class="label-field">Description</label>
            <textarea v-model="form.description" required rows="4" class="input-field" />
          </div>
          <button type="submit" class="btn-primary w-full" :disabled="submitting">
            {{ submitting ? 'Submitting...' : 'Submit Request' }}
          </button>
          <p v-if="submitted" class="text-center text-sm text-primary-600">
            Request submitted successfully! We'll get back to you soon.
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { contactInfo } from '@/data/mockData'
import { helpRequestService } from '@/services/financeService'

const form = reactive({
  name: '',
  email: '',
  phone: '',
  reason: 'Medical',
  description: '',
})

const submitting = ref(false)
const submitted = ref(false)

async function submitRequest() {
  submitting.value = true
  try {
    await helpRequestService.create(form)
    submitted.value = true
    Object.assign(form, { name: '', email: '', phone: '', reason: 'Medical', description: '' })
  } finally {
    submitting.value = false
  }
}
</script>
