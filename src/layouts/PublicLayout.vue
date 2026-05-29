<template>
  <div class="flex min-h-screen flex-col">
    <AppNavbar />
    <main class="flex-1">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppNavbar from '@/components/common/AppNavbar.vue'
import AppFooter from '@/components/common/AppFooter.vue'
import { refreshAllPublicData } from '@/utils/refreshPublicData'

const route = useRoute()

watch(
  () => route.path,
  () => {
    refreshAllPublicData()
  },
  { immediate: true },
)
</script>
