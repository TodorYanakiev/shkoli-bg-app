import { useCallback, useEffect, useState } from 'react'

import type { CourseDetailTabKey } from '../types'

const SECTION_TO_TAB: Record<string, CourseDetailTabKey> = {
  'course-overview': 'overview',
  'course-lyceum': 'overview',
  'course-schedule': 'schedule',
  'course-gallery': 'gallery',
  'course-lecturers': 'lecturers',
  'course-reviews': 'reviews',
}

const TAB_TO_SECTION: Record<CourseDetailTabKey, string> = {
  overview: 'course-overview',
  schedule: 'course-schedule',
  gallery: 'course-gallery',
  lecturers: 'course-lecturers',
  reviews: 'course-reviews',
}

const resolveTabFromHash = (
  hash: string,
): CourseDetailTabKey | null => {
  const normalized = hash.replace(/^#/, '')
  return SECTION_TO_TAB[normalized] ?? null
}

const buildHashUrl = (sectionId: string) => {
  if (typeof window === 'undefined') {
    return `#${sectionId}`
  }

  return `${window.location.pathname}${window.location.search}#${sectionId}`
}

export const useCourseDetailTabs = () => {
  const [activeTab, setActiveTab] =
    useState<CourseDetailTabKey>('overview')

  useEffect(() => {
    if (typeof window === 'undefined') return

    const syncWithHash = () => {
      const hash = window.location.hash.replace(/^#/, '')
      const resolved = resolveTabFromHash(hash)
      if (resolved) {
        setActiveTab(resolved)
        window.setTimeout(() => {
          const sectionElement = document.getElementById(hash)
          sectionElement?.scrollIntoView({
            block: 'start',
            behavior: 'smooth',
          })
        }, 0)
      }
    }

    syncWithHash()
    window.addEventListener('hashchange', syncWithHash)

    return () => {
      window.removeEventListener('hashchange', syncWithHash)
    }
  }, [])

  const onSelectTab = useCallback((tab: CourseDetailTabKey) => {
    setActiveTab(tab)

    if (typeof window === 'undefined') return

    const sectionId = TAB_TO_SECTION[tab]
    const nextHash = `#${sectionId}`

    if (window.location.hash === nextHash) return

    window.history.replaceState(null, '', buildHashUrl(sectionId))
  }, [])

  return {
    activeTab,
    onSelectTab,
  }
}
