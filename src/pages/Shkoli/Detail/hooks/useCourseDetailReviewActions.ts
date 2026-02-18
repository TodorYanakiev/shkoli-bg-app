import { useCallback } from 'react'

import type { CourseDetailTabKey } from '../types'

const REVIEW_EDITOR_TRIGGER_ID = 'course-reviews-editor-trigger'

type UseCourseDetailReviewActionsOptions = {
  onSelectTab: (tab: CourseDetailTabKey) => void
}

const scrollToReviewsSection = () => {
  const reviewsSection = document.getElementById('course-reviews')
  reviewsSection?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}

export const useCourseDetailReviewActions = ({
  onSelectTab,
}: UseCourseDetailReviewActionsOptions) => {
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
