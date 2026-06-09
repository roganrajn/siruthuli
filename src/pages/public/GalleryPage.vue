<template>
  <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
    <section class="text-center">
      <h1 class="section-title">Gallery</h1>
      <p class="section-subtitle mx-auto">
        Moments from our food distribution, medical help, and education support programs.
      </p>
    </section>

    <div v-if="galleryStore.loading" class="mt-12 text-center text-gray-500">Loading...</div>

    <section v-else-if="galleryStore.events.length" class="mt-12 space-y-10">
      <article
        v-for="event in galleryStore.events"
        :key="event.id"
        class="card overflow-hidden !p-0"
      >
        <div class="border-b border-gray-100 p-6">
          <span :class="['rounded-full px-2.5 py-0.5 text-xs font-medium', categoryColors[event.category]]">
            {{ event.category }}
          </span>
          <h2 class="mt-2 text-xl font-semibold text-gray-900">{{ event.title }}</h2>
          <p class="mt-1 text-sm text-gray-500">{{ formatDate(event.date) }}</p>
          <p class="mt-3 text-gray-600">{{ event.description }}</p>
        </div>

        <div v-if="event.photos.length || event.videos.length" class="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="(photo, i) in event.photos"
            :key="'photo-' + i"
            class="aspect-video overflow-hidden bg-gray-100"
          >
            <img :src="photo" :alt="event.title" class="h-full w-full object-cover" loading="lazy" />
          </div>

          <div
            v-for="(video, i) in event.videos"
            :key="'video-' + i"
            class="aspect-video overflow-hidden bg-gray-900"
          >
            <iframe
              v-if="getYoutubeEmbedUrl(video)"
              :src="getYoutubeEmbedUrl(video)!"
              class="h-full w-full"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            />
            <video
              v-else-if="isDirectVideoUrl(video)"
              :src="video"
              class="h-full w-full object-cover"
              controls
            />
            <a
              v-else
              :href="video"
              target="_blank"
              rel="noopener"
              class="flex h-full items-center justify-center text-white hover:bg-gray-800"
            >
              ▶ Watch Video
            </a>
          </div>
        </div>
      </article>
    </section>

    <p v-else class="mt-12 text-center text-gray-500">No gallery events yet.</p>
  </div>
</template>

<script setup lang="ts">
import { useGalleryStore } from '@/stores/galleryStore'
import { formatDate, categoryColors } from '@/utils/formatters'
import { getYoutubeEmbedUrl, isDirectVideoUrl } from '@/utils/media'

const galleryStore = useGalleryStore()
</script>
