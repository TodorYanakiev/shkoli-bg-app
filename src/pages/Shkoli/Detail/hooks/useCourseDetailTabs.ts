import { useCallback, useEffect, useState } from 'react'

import type { CourseDetailTabKey } from '../types'

const SECTION_TO_TAB: Record<string, CourseDetailTabKey> = {
  'course-overview': 'overview',
  'course-lyceum': 'overview',
  'course-schedule': 'schedule',
  'course-gallery': 'gallery',
  'course-lecturers': 'lecturers',
  'course-statistics': 'statistics',
  'course-reviews': 'reviews',
}

const TAB_TO_SECTION: Record<CourseDetailTabKey, string> = {
  overview: 'course-overview',
  schedule: 'course-schedule',
  gallery: 'course-gallery',
  lecturers: 'course-lecturers',
  statistics: 'course-statistics',
  reviews: 'course-reviews',
}

const resolveTabFromHash = (
  hash: string,
  canViewStatistics: boolean,
): CourseDetailTabKey | null => {
  const normalized = hash.replace(/^#/, '')
  const resolved = SECTION_TO_TAB[normalized] ?? null

  if (resolved === 'statistics' && !canViewStatistics) {
    return null
  }

  return resolved
}

const buildHashUrl = (sectionId: string) => {
  if (typeof window === 'undefined') {
    return `#${sectionId}`
  }

  return `${window.location.pathname}${window.location.search}#${sectionId}`
}

type UseCourseDetailTabsOptions = {
  canViewStatistics?: boolean
}

export const useCourseDetailTabs = ({
  canViewStatistics = false,
}: UseCourseDetailTabsOptions = {}) => {
  const [activeTab, setActiveTab] =
    useState<CourseDetailTabKey>('overview')

  useEffect(() => {
    if (typeof window === 'undefined') return

    const syncWithHash = () => {
      const hash = window.location.hash.replace(/^#/, '')
      const resolved = resolveTabFromHash(hash, canViewStatistics)
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
  }, [canViewStatistics])

  useEffect(() => {
    if (!canViewStatistics && activeTab === 'statistics') {
      setActiveTab('overview')
    }
  }, [activeTab, canViewStatistics])

  const onSelectTab = useCallback((tab: CourseDetailTabKey) => {
    if (tab === 'statistics' && !canViewStatistics) return

    setActiveTab(tab)

    if (typeof window === 'undefined') return

    const sectionId = TAB_TO_SECTION[tab]
    const nextHash = `#${sectionId}`

    if (window.location.hash === nextHash) return

    window.history.replaceState(null, '', buildHashUrl(sectionId))
  }, [canViewStatistics])

  return {
    activeTab,
    onSelectTab,
  }
}
