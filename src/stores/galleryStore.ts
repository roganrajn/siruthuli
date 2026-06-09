import { defineStore } from 'pinia'
import { ref } from 'vue'
import { galleryService } from '@/services/galleryService'
import type { GalleryEvent } from '@/types'

export const useGalleryStore = defineStore('gallery', () => {
  const events = ref<GalleryEvent[]>([])
  const loading = ref(false)

  async function fetchAll() {
    loading.value = true
    try {
      events.value = await galleryService.getAll()
    } finally {
      loading.value = false
    }
  }

  async function addEvent(data: Omit<GalleryEvent, 'id' | 'createdAt'>) {
    await galleryService.create(data)
    await fetchAll()
  }

  async function editEvent(id: string, data: Partial<GalleryEvent>) {
    await galleryService.update(id, data)
    await fetchAll()
  }

  async function removeEvent(id: string) {
    await galleryService.delete(id)
    await fetchAll()
  }

  return { events, loading, fetchAll, addEvent, editEvent, removeEvent }
})
