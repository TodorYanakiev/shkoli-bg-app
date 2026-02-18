import { useCallback, useEffect, useState } from 'react'

import type { LyceumDetailTabKey } from '../types'

const SECTION_TO_TAB: Record<string, LyceumDetailTabKey> = {
  'lyceum-overview': 'overview',
  'lyceum-info': 'overview',
  'lyceum-courses': 'courses',
  'lyceum-gallery': 'gallery',
  'lyceum-lecturers': 'lecturers',
  'lyceum-reviews': 'reviews',
}

const TAB_TO_SECTION: Record<LyceumDetailTabKey, string> = {
  overview: 'lyceum-overview',
  courses: 'lyceum-courses',
  gallery: 'lyceum-gallery',
  lecturers: 'lyceum-lecturers',
  reviews: 'lyceum-reviews',
}

const resolveTabFromHash = (
  hash: string,
): LyceumDetailTabKey | null => {
  const normalized = hash.replace(/^#/, '')
  return SECTION_TO_TAB[normalized] ?? null
}

const buildHashUrl = (sectionId: string) => {
  if (typeof window === 'undefined') {
    return `#${sectionId}`
  }

  return `${window.location.pathname}${window.location.search}#${sectionId}`
}

export const useLyceumDetailTabs = () => {
  const [activeTab, setActiveTab] =
    useState<LyceumDetailTabKey>('overview')

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

  const onSelectTab = useCallback((tab: LyceumDetailTabKey) => {
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
