/**
 * Compress and resize an image file in the browser using a canvas.
 * Returns a base64 JPEG data URL suitable for storing in localStorage.
 *
 * Max dimension: 600px — good quality for CV photos at print size.
 * JPEG quality: 0.82 — typically results in 30–80 KB.
 */
export function compressImage(file: File, maxDimension = 600): Promise<string> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file)
    const img = new Image()

    img.onload = () => {
      const ratio = Math.min(maxDimension / img.width, maxDimension / img.height, 1)
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * ratio)
      canvas.height = Math.round(img.height * ratio)

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Canvas not supported'))
        return
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(objectUrl)
      resolve(canvas.toDataURL('image/jpeg', 0.82))
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Failed to load image'))
    }

    img.src = objectUrl
  })
}
