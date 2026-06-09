<template>
  <div class="max-w-2xl space-y-6">
    <div class="card">
      <h2 class="text-lg font-semibold text-gray-900">Firebase</h2>
      <p class="mt-2 text-sm text-gray-600">
        Connected to Firestore for shared data across all visitors.
      </p>

      <div class="mt-4 space-y-2 rounded-lg bg-gray-50 p-4 text-sm">
        <p>
          Status:
          <span :class="configured ? 'font-medium text-green-600' : 'font-medium text-amber-600'">
            {{ configured ? 'Connected' : 'Not configured' }}
          </span>
        </p>
        <p v-if="configured">Project: <code class="text-primary-600">{{ projectId }}</code></p>
      </div>

      <div v-if="configured" class="mt-4 space-y-3">
        <p v-if="dbEmpty === true" class="text-sm text-amber-700">
          Firestore is empty. Seed it with your real Siruthuli data (including the ₹20,000 donation).
        </p>
        <p v-else-if="dbEmpty === false" class="text-sm text-green-700">
          Firestore has data. Admin changes sync to the public website for everyone.
        </p>

        <button
          class="btn-primary"
          :disabled="seeding || checking"
          @click="handleSeed"
        >
          {{ seeding ? 'Seeding...' : 'Seed Database with Real Data' }}
        </button>

        <p v-if="seedMessage" class="text-sm text-primary-600">{{ seedMessage }}</p>
        <p v-if="seedError" class="text-sm text-red-600">{{ seedError }}</p>
      </div>

      <div v-if="configured" class="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
        <p class="text-sm font-medium text-amber-800">Firestore Rules</p>
        <p class="mt-1 text-sm text-amber-700">
          Deploy <code>firestore.rules</code> in Firebase Console → Firestore → Rules, or run
          <code>firebase deploy --only firestore:rules</code>
        </p>
      </div>
    </div>

    <div class="card">
      <h2 class="text-lg font-semibold text-gray-900">Admin Login</h2>
      <p class="mt-2 text-sm text-gray-600">
        Credentials are loaded from <code class="rounded bg-gray-100 px-1">public/data/admin-credentials.json</code>
      </p>
      <div class="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
        <p class="text-sm text-amber-700">
          On GitHub Pages this file must exist in <code>public/data/</code> before build, or admin login won't work on the live site.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { isFirebaseConfigured, getFirebaseProjectId } from '@/firebase/config'
import { isDatabaseEmpty, seedDatabase } from '@/firebase/seedDatabase'
import { refreshAllPublicData } from '@/utils/refreshPublicData'

const configured = isFirebaseConfigured()
const projectId = getFirebaseProjectId()

const dbEmpty = ref<boolean | null>(null)
const checking = ref(false)
const seeding = ref(false)
const seedMessage = ref('')
const seedError = ref('')

async function checkDatabase() {
  if (!configured) return
  checking.value = true
  try {
    dbEmpty.value = await isDatabaseEmpty()
  } catch {
    dbEmpty.value = null
  } finally {
    checking.value = false
  }
}

async function handleSeed() {
  if (!confirm('Upload all seed data (donations, contributions, gallery) to Firestore?')) return

  seeding.value = true
  seedMessage.value = ''
  seedError.value = ''
  try {
    const result = await seedDatabase()
    seedMessage.value = `Seeded ${result.donations} donations, ${result.contributions} contributions, ${result.gallery} gallery items.`
    dbEmpty.value = false
    await refreshAllPublicData()
  } catch (err) {
    seedError.value = err instanceof Error ? err.message : 'Seed failed. Check Firestore rules in Firebase Console.'
  } finally {
    seeding.value = false
  }
}

onMounted(() => checkDatabase())
</script>
