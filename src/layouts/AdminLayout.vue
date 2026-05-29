<template>
  <div class="flex min-h-screen bg-gray-100">
    <AdminSidebar />
    <div class="flex flex-1 flex-col">
      <AdminHeader />
      <main class="flex-1 p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import AdminSidebar from '@/components/common/AdminSidebar.vue'
import AdminHeader from '@/components/common/AdminHeader.vue'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
onMounted(() => authStore.checkSession())
</script>
