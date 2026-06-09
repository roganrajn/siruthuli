import { COLLECTIONS, getAllSimple, create, update, remove } from '@/firebase/firestore'
import { isFirebaseConfigured } from '@/firebase/config'
import { mockGallery } from '@/data/mockData'
import { loadCollection, saveCollection, STORAGE_KEYS } from '@/services/localDataStore'
import type { GalleryEvent } from '@/types'

function normalizeGallery(event: GalleryEvent): GalleryEvent {
  return {
    ...event,
    photos: event.photos ?? [],
    videos: event.videos ?? [],
  }
}

let localGallery = loadCollection<GalleryEvent>(STORAGE_KEYS.gallery, mockGallery).map(normalizeGallery)

export const galleryService = {
  async getAll(): Promise<GalleryEvent[]> {
    if (!isFirebaseConfigured()) {
      localGallery = loadCollection(STORAGE_KEYS.gallery, mockGallery).map(normalizeGallery)
      return [...localGallery].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }
    const items = await getAllSimple<GalleryEvent>(COLLECTIONS.gallery)
    return items.map(normalizeGallery).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  },

  async create(data: Omit<GalleryEvent, 'id' | 'createdAt'>): Promise<string> {
    const payload = normalizeGallery({ ...data, id: '', photos: data.photos ?? [], videos: data.videos ?? [] })
    if (!isFirebaseConfigured()) {
      const item: GalleryEvent = {
        ...payload,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      }
      localGallery.unshift(item)
      saveCollection(STORAGE_KEYS.gallery, localGallery)
      return item.id
    }
    return create(COLLECTIONS.gallery, {
      title: payload.title,
      category: payload.category,
      date: payload.date,
      description: payload.description,
      photos: payload.photos,
      videos: payload.videos,
    })
  },

  async update(id: string, data: Partial<GalleryEvent>): Promise<void> {
    if (!isFirebaseConfigured()) {
      const idx = localGallery.findIndex((g) => g.id === id)
      if (idx >= 0) {
        localGallery[idx] = normalizeGallery({ ...localGallery[idx], ...data })
        saveCollection(STORAGE_KEYS.gallery, localGallery)
      }
      return
    }
    await update(COLLECTIONS.gallery, id, data as Record<string, unknown>)
  },

  async delete(id: string): Promise<void> {
    if (!isFirebaseConfigured()) {
      localGallery = localGallery.filter((g) => g.id !== id)
      saveCollection(STORAGE_KEYS.gallery, localGallery)
      return
    }
    await remove(COLLECTIONS.gallery, id)
  },
}
