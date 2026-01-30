import { useEffect, useState } from 'react'

export const useAdminLayout = () => {
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined') return true
    return window.matchMedia('(min-width: 1024px)').matches
  })
  const [isSideNavExpanded, setIsSideNavExpanded] = useState(() => {
    if (typeof window === 'undefined') return true
    return window.matchMedia('(min-width: 1024px)').matches
  })

  const sideNavWidth = !isDesktop
    ? '0px'
    : isSideNavExpanded
      ? '16rem'
      : '4.75rem'

  useEffect(() => {
    if (typeof window === 'undefined') return
    const media = window.matchMedia('(min-width: 1024px)')
    const handleChange = () => {
      setIsDesktop(media.matches)
      if (!media.matches) {
        setIsSideNavExpanded(false)
      }
    }

    handleChange()

    if (media.addEventListener) {
      media.addEventListener('change', handleChange)
      return () => media.removeEventListener('change', handleChange)
    }

    media.addListener(handleChange)
    return () => media.removeListener(handleChange)
  }, [])

  useEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement

    if (!isDesktop) {
      root.style.removeProperty('--page-sidebar-offset')
      return
    }

    root.style.setProperty('--page-sidebar-offset', sideNavWidth)

    return () => {
      root.style.removeProperty('--page-sidebar-offset')
    }
  }, [isDesktop, sideNavWidth])

  return { isDesktop, isSideNavExpanded, setIsSideNavExpanded, sideNavWidth }
}
