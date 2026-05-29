<template>
  <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
    <section class="text-center">
      <h1 class="section-title">About Siruthuli</h1>
      <p class="section-subtitle mx-auto">
        A foundation built on compassion, transparency, and the belief that every act of kindness matters.
      </p>
    </section>

    <section class="mt-16 grid gap-8 lg:grid-cols-2">
      <div class="card">
        <h2 class="text-xl font-bold text-primary-700">Our Mission</h2>
        <p class="mt-4 text-gray-600 leading-relaxed">
          To provide timely support for people facing medical emergencies, education barriers, food insecurity,
          and other critical needs — with complete transparency in how every rupee is used.
        </p>
      </div>
      <div class="card">
        <h2 class="text-xl font-bold text-primary-700">Our Vision</h2>
        <p class="mt-4 text-gray-600 leading-relaxed">
          To build a community where no one faces hardship alone, and where trust in charitable giving
          is earned through openness, accountability, and genuine human connection.
        </p>
      </div>
    </section>

    <section class="mt-16">
      <h2 class="section-title text-center">Why Siruthuli Started</h2>
      <p class="section-subtitle mx-auto mt-4 text-center">
        Born from a simple idea — that a small group of committed people can create meaningful change
        when they act together with integrity.
      </p>
    </section>

    <section class="mt-16">
      <h2 class="section-title">Our Trustees</h2>
      <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="trustee in trustees" :key="trustee.name" class="card text-center">
          <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-xl font-bold text-primary-600">
            {{ trustee.name.charAt(0) }}
          </div>
          <h3 class="mt-4 font-semibold text-gray-900">{{ trustee.name }}</h3>
          <p class="text-sm text-primary-600">{{ trustee.role }}</p>
          <p v-if="trustee.bio" class="mt-2 text-sm text-gray-600">{{ trustee.bio }}</p>
        </div>
      </div>
    </section>

    <section class="mt-16">
      <h2 class="section-title">Our Journey</h2>
      <div class="mt-8 space-y-6">
        <div v-for="event in timeline" :key="event.year" class="flex gap-4">
          <div class="flex flex-col items-center">
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
              {{ event.year.slice(2) }}
            </div>
            <div v-if="event !== timeline[timeline.length - 1]" class="mt-2 h-full w-0.5 bg-primary-200" />
          </div>
          <div class="card flex-1 !py-4">
            <p class="font-semibold text-gray-900">{{ event.title }}</p>
            <p class="text-sm text-gray-500">{{ event.year }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { trustees } from '@/data/mockData'

const timeline = [
  { year: '2025', title: 'Siruthuli Foundation Started' },
  { year: '2025', title: 'First Education Help' },
  { year: '2026', title: 'Medical Support Expanded' },
]
</script>
