import { useCallback } from 'react'

import type { LyceumDetailTabKey } from '../types'

const REVIEW_EDITOR_TRIGGER_ID = 'lyceum-reviews-editor-trigger'

type UseLyceumDetailReviewActionsOptions = {
  onSelectTab: (tab: LyceumDetailTabKey) => void
}

const scrollToReviewsSection = () => {
  const reviewsSection = document.getElementById('lyceum-reviews')
  reviewsSection?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}

export const useLyceumDetailReviewActions = ({
  onSelectTab,
}: UseLyceumDetailReviewActionsOptions) => {
  const openReviewsTab = useCallback(() => {
    onSelectTab('reviews')
    if (typeof window === 'undefined') return

    window.setTimeout(scrollToReviewsSection, 0)
  }, [onSelectTab])

  const openReviewEditor = useCallback(() => {
    onSelectTab('reviews')
    if (typeof window === 'undefined') return

    window.setTimeout(() => {
      const editorTrigger = document.getElementById(REVIEW_EDITOR_TRIGGER_ID)
      if (editorTrigger instanceof HTMLButtonElement) {
        editorTrigger.click()
        return
      }

      scrollToReviewsSection()
    }, 0)
  }, [onSelectTab])

  return {
    reviewEditorTriggerId: REVIEW_EDITOR_TRIGGER_ID,
    openReviewsTab,
    openReviewEditor,
  }
}
