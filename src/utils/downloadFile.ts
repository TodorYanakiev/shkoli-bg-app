export const downloadFile = (blob: Blob, fileName: string) => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return
  }

  const objectUrl = window.URL.createObjectURL(blob)
  const downloadLink = document.createElement('a')

  downloadLink.href = objectUrl
  downloadLink.download = fileName
  downloadLink.rel = 'noopener'

  document.body.appendChild(downloadLink)
  downloadLink.click()
  document.body.removeChild(downloadLink)

  window.setTimeout(() => {
    window.URL.revokeObjectURL(objectUrl)
  }, 0)
}

export const downloadFileFromUrl = (url: string) => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return
  }

  const downloadLink = document.createElement('a')

  downloadLink.href = url
  downloadLink.rel = 'noopener noreferrer'

  document.body.appendChild(downloadLink)
  downloadLink.click()
  document.body.removeChild(downloadLink)
}
