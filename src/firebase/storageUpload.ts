import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { getFirebaseStorage, isFirebaseConfigured } from '@/firebase/config'

export async function uploadGalleryFile(file: File, folder = 'gallery'): Promise<string> {
  if (!isFirebaseConfigured()) {
    return readAsDataUrl(file)
  }
  const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
  const storageRef = ref(getFirebaseStorage(), `${folder}/${safeName}`)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
