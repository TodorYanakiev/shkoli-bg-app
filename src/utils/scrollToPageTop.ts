export const scrollToPageTop = (): void => {
  if (typeof window === 'undefined' || typeof window.scrollTo !== 'function') {
    return
  }

  const scrollTo = window.scrollTo
  if (scrollTo.toString().includes('notImplementedMethod')) {
    return
  }

  try {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
  } catch {
    // Browser-like test environments may expose scrollTo without implementing it.
  }
}

export const scrollToPageTopAfterLayout = (): void => {
  scrollToPageTop()

  if (typeof window === 'undefined') {
    return
  }

  if (window.navigator.userAgent.includes('jsdom')) {
    return
  }

  window.requestAnimationFrame?.(() => {
    scrollToPageTop()
    window.requestAnimationFrame?.(scrollToPageTop)
  })
  window.setTimeout(scrollToPageTop, 80)
}
