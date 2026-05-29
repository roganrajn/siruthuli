<template>
  <footer class="border-t border-gray-200 bg-gray-900 text-gray-300">
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="grid gap-8 md:grid-cols-3">
        <div>
          <h3 class="text-lg font-bold text-white">Siruthuli Foundation</h3>
          <p class="mt-2 text-sm">Every small drop creates an ocean of kindness.</p>
        </div>
        <div>
          <h4 class="font-semibold text-white">Quick Links</h4>
          <ul class="mt-3 space-y-2 text-sm">
            <li><RouterLink to="/about" class="hover:text-primary-400">About Us</RouterLink></li>
            <li><RouterLink to="/transparency" class="hover:text-primary-400">Transparency</RouterLink></li>
            <li><RouterLink to="/contact" class="hover:text-primary-400">Contact</RouterLink></li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold text-white">Connect</h4>
          <p class="mt-3 text-sm">{{ contactInfo.email }}</p>
          <p class="text-sm">{{ contactInfo.instagram }}</p>
        </div>
      </div>
      <div class="mt-8 border-t border-gray-800 pt-8 text-center text-sm">
        © {{ new Date().getFullYear() }} Siruthuli Foundation. All rights reserved.
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { contactInfo } from '@/data/mockData'
</script>
