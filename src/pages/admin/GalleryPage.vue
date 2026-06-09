<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <p class="text-sm text-gray-500">{{ galleryStore.events.length }} gallery events</p>
      <button class="btn-primary" @click="openForm()">+ Add Gallery Event</button>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="event in galleryStore.events" :key="event.id" class="card overflow-hidden !p-0">
        <div class="relative h-40 bg-gray-100">
          <img
            v-if="event.photos[0]"
            :src="event.photos[0]"
            :alt="event.title"
            class="h-full w-full object-cover"
          />
          <div v-else-if="event.videos[0]" class="flex h-full items-center justify-center bg-gray-900 text-white">
            <span class="text-4xl">▶</span>
          </div>
          <div v-else class="flex h-full items-center justify-center bg-primary-100 text-4xl">📷</div>
          <span
            v-if="event.videos.length"
            class="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white"
          >
            {{ event.videos.length }} video{{ event.videos.length > 1 ? 's' : '' }}
          </span>
        </div>
        <div class="p-4">
          <span :class="['rounded-full px-2 py-0.5 text-xs font-medium', categoryColors[event.category]]">
            {{ event.category }}
          </span>
          <h3 class="mt-2 font-semibold text-gray-900">{{ event.title }}</h3>
          <p class="mt-1 text-xs text-gray-500">{{ formatDate(event.date) }}</p>
          <p class="mt-2 line-clamp-2 text-sm text-gray-600">{{ event.description }}</p>
          <div class="mt-3 flex gap-2">
            <button class="text-sm text-primary-600 hover:underline" @click="openForm(event)">Edit</button>
            <button class="text-sm text-red-600 hover:underline" @click="handleDelete(event.id)">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <BaseModal :open="showForm" @close="closeForm">
      <h2 class="text-lg font-bold text-gray-900">{{ editingId ? 'Edit' : 'Add' }} Gallery Event</h2>
      <form class="mt-4 max-h-[70vh] space-y-4 overflow-y-auto pr-1" @submit.prevent="handleSubmit">
        <div>
          <label class="label-field">Event Title</label>
          <input v-model="form.title" required class="input-field" placeholder="Food Distribution Drive" />
        </div>

        <div class="grid gap-3 sm:grid-cols-2">
          <div>
            <label class="label-field">Category</label>
            <select v-model="form.category" class="input-field">
              <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>
          <div>
            <label class="label-field">Date (when it happened)</label>
            <input v-model="form.date" type="date" required class="input-field" />
          </div>
        </div>

        <div>
          <label class="label-field">Description</label>
          <textarea v-model="form.description" rows="3" required class="input-field" />
        </div>

        <!-- Photos -->
        <div>
          <label class="label-field">Photos</label>
          <div class="space-y-2">
            <div v-for="(_, i) in form.photos" :key="i" class="flex gap-2">
              <input v-model="form.photos[i]" class="input-field" placeholder="Image URL" />
              <button type="button" class="btn-secondary !px-3" @click="form.photos.splice(i, 1)">✕</button>
            </div>
            <div class="flex flex-wrap gap-2">
              <button type="button" class="btn-secondary !text-xs" @click="form.photos.push('')">+ Add Photo URL</button>
              <label class="btn-secondary !cursor-pointer !text-xs">
                Upload Image
                <input type="file" accept="image/*" class="hidden" @change="uploadImage" />
              </label>
            </div>
          </div>
        </div>

        <!-- Videos -->
        <div>
          <label class="label-field">Videos</label>
          <p class="mb-2 text-xs text-gray-500">YouTube links or direct video URLs (.mp4)</p>
          <div class="space-y-2">
            <div v-for="(_, i) in form.videos" :key="i" class="flex gap-2">
              <input v-model="form.videos[i]" class="input-field" placeholder="https://youtube.com/watch?v=..." />
              <button type="button" class="btn-secondary !px-3" @click="form.videos.splice(i, 1)">✕</button>
            </div>
            <div class="flex flex-wrap gap-2">
              <button type="button" class="btn-secondary !text-xs" @click="form.videos.push('')">+ Add Video URL</button>
              <label class="btn-secondary !cursor-pointer !text-xs">
                Upload Video
                <input type="file" accept="video/*" class="hidden" @change="uploadVideo" />
              </label>
            </div>
          </div>
        </div>

        <p v-if="uploading" class="text-sm text-primary-600">Uploading file...</p>
        <p v-if="formError" class="text-sm text-red-600">{{ formError }}</p>

        <div class="flex justify-end gap-3 pt-2">
          <button type="button" class="btn-secondary" @click="closeForm">Cancel</button>
          <button type="submit" class="btn-primary" :disabled="saving || uploading">
            {{ saving ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </form>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useGalleryStore } from '@/stores/galleryStore'
import { uploadGalleryFile } from '@/firebase/storageUpload'
import { formatDate, categoryColors } from '@/utils/formatters'
import type { DonationCategory, GalleryEvent } from '@/types'
import BaseModal from '@/components/common/BaseModal.vue'

const galleryStore = useGalleryStore()
const showForm = ref(false)
const editingId = ref<string | null>(null)
const saving = ref(false)
const uploading = ref(false)
const formError = ref('')

const categories: (DonationCategory | 'General')[] = [
  'General', 'Medical', 'Education', 'Food', 'Emergency', 'Groceries', 'Others',
]

const defaultForm = () => ({
  title: '',
  category: 'General' as GalleryEvent['category'],
  date: new Date().toISOString().slice(0, 10),
  description: '',
  photos: [] as string[],
  videos: [] as string[],
})

const form = reactive(defaultForm())

function openForm(event?: GalleryEvent) {
  formError.value = ''
  if (event) {
    editingId.value = event.id
    Object.assign(form, {
      title: event.title,
      category: event.category,
      date: event.date,
      description: event.description,
      photos: [...(event.photos ?? [])],
      videos: [...(event.videos ?? [])],
    })
  } else {
    editingId.value = null
    Object.assign(form, defaultForm())
  }
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  editingId.value = null
}

async function uploadImage(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploading.value = true
  try {
    const url = await uploadGalleryFile(file, 'gallery/images')
    form.photos.push(url)
  } catch {
    formError.value = 'Image upload failed'
  } finally {
    uploading.value = false
  }
}

async function uploadVideo(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploading.value = true
  try {
    const url = await uploadGalleryFile(file, 'gallery/videos')
    form.videos.push(url)
  } catch {
    formError.value = 'Video upload failed'
  } finally {
    uploading.value = false
  }
}

async function handleSubmit() {
  saving.value = true
  formError.value = ''
  const payload = {
    title: form.title,
    category: form.category,
    date: form.date,
    description: form.description,
    photos: form.photos.filter(Boolean),
    videos: form.videos.filter(Boolean),
  }
  try {
    if (editingId.value) {
      await galleryStore.editEvent(editingId.value, payload)
    } else {
      await galleryStore.addEvent(payload)
    }
    closeForm()
  } catch (err) {
    formError.value = err instanceof Error ? err.message : 'Save failed'
  } finally {
    saving.value = false
  }
}

async function handleDelete(id: string) {
  if (confirm('Delete this gallery event?')) {
    await galleryStore.removeEvent(id)
  }
}

onMounted(() => galleryStore.fetchAll())
</script>
