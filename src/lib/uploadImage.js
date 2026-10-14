import { supabase } from './supabase'

/* ──────────────────────────────────────────────────────────────
   Uploads an image an admin picked to a public storage bucket and
   returns its address. Photos are scaled to at most `maxWidth` pixels
   wide and saved as WebP (PNG where the browser can't write WebP), so
   the site stays quick to load. A GIF goes up as it is, so an
   animation survives. Buckets: supabase/admin-content.sql and
   supabase/boutique-brands.sql.
   ────────────────────────────────────────────────────────────── */

export const IMAGE_TYPES = 'image/jpeg,image/png,image/webp,image/gif'
const EXTENSIONS = { 'image/webp': 'webp', 'image/png': 'png', 'image/jpeg': 'jpg', 'image/gif': 'gif' }

async function shrink(file, maxWidth) {
  if (file.type === 'image/gif') return file
  const bitmap = await createImageBitmap(file)
  const scale  = Math.min(1, maxWidth / bitmap.width)
  const canvas = document.createElement('canvas')
  canvas.width  = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  return new Promise((resolve, reject) => canvas.toBlob(
    blob => (blob ? resolve(blob) : reject(new Error('the image could not be read'))), 'image/webp', 0.86))
}

export async function uploadImage(bucket, file, maxWidth = 1600) {
  const blob = await shrink(file, maxWidth)
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${EXTENSIONS[blob.type] || 'img'}`
  const { error } = await supabase.storage.from(bucket).upload(path, blob, { contentType: blob.type, cacheControl: '31536000' })
  if (error) throw error
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl
}
