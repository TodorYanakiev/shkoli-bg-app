import { useCallback, useEffect, useState } from 'react'

import type { LyceumDetailTabKey } from '../types'

const SECTION_TO_TAB: Record<string, LyceumDetailTabKey> = {
  'lyceum-overview': 'overview',
  'lyceum-info': 'overview',
  'lyceum-courses': 'courses',
  'lyceum-gallery': 'gallery',
  'lyceum-lecturers': 'lecturers',
  'lyceum-statistics': 'statistics',
  'lyceum-reviews': 'reviews',
}

const TAB_TO_SECTION: Record<LyceumDetailTabKey, string> = {
  overview: 'lyceum-overview',
  courses: 'lyceum-courses',
  gallery: 'lyceum-gallery',
  lecturers: 'lyceum-lecturers',
  statistics: 'lyceum-statistics',
  reviews: 'lyceum-reviews',
}

const resolveTabFromHash = (
  hash: string,
  canViewStatistics: boolean,
): LyceumDetailTabKey | null => {
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

type UseLyceumDetailTabsOptions = {
  canViewStatistics?: boolean
}

export const useLyceumDetailTabs = ({
  canViewStatistics = false,
}: UseLyceumDetailTabsOptions = {}) => {
  const [activeTab, setActiveTab] =
    useState<LyceumDetailTabKey>('overview')

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

  const onSelectTab = useCallback((tab: LyceumDetailTabKey) => {
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
