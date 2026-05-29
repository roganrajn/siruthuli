<template>
  <div class="max-w-2xl space-y-6">
    <div class="card">
      <h2 class="text-lg font-semibold text-gray-900">Admin Login Credentials</h2>
      <p class="mt-2 text-sm text-gray-600">
        Login credentials are stored in a JSON file — no database required.
      </p>

      <div class="mt-4 rounded-lg bg-gray-50 p-4">
        <p class="text-sm font-medium text-gray-700">File location:</p>
        <code class="mt-1 block text-sm text-primary-600">public/data/admin-credentials.json</code>
      </div>

      <div class="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
        <p class="text-sm font-medium text-amber-800">Security Note</p>
        <p class="mt-1 text-sm text-amber-700">
          This JSON file is publicly accessible in development. For production, consider restricting access
          or moving credentials server-side. The file is gitignored — use the example file as a template.
        </p>
      </div>

      <div class="mt-4">
        <p class="text-sm font-medium text-gray-700">Example format:</p>
        <pre class="mt-2 overflow-x-auto rounded-lg bg-gray-900 p-4 text-xs text-green-400">{{ exampleJson }}</pre>
      </div>
    </div>

    <div class="card">
      <h2 class="text-lg font-semibold text-gray-900">Firebase Configuration</h2>
      <p class="mt-2 text-sm text-gray-600">
        Add your Firebase credentials to <code class="rounded bg-gray-100 px-1">.env</code> to enable
        persistent data storage. Without Firebase, the app uses in-memory mock data.
      </p>
      <div class="mt-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
        <p>Status: <span :class="configured ? 'text-green-600' : 'text-amber-600'">{{ configured ? 'Configured' : 'Using mock data' }}</span></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { isFirebaseConfigured } from '@/firebase/config'

const configured = isFirebaseConfigured()

const exampleJson = `{
  "allowedUsers": [
    {
      "email": "roganinnovator@gmail.com",
      "password": "your-password"
    }
  ]
}`
</script>
