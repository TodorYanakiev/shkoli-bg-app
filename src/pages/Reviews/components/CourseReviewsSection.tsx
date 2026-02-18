import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

import { useAuthStatus } from '../../../hooks/useAuthStatus'
import { useUserProfile } from '../../Profile/hooks/useUserProfile'
import { ReviewsSection } from './ReviewsSection'
import {
  useCourseReview,
  useCourseReviews,
  useCreateCourseReviewMutation,
  useDeleteCourseReviewMutation,
  useUpdateCourseReviewMutation,
} from '../hooks/useCourseReviews'

type CourseReviewsSectionProps = {
  courseId?: number
  averageRating?: number | null
  className?: string
  hideTitle?: boolean
  editorTriggerButtonId?: string
}

export const CourseReviewsSection = ({
  courseId,
  averageRating,
  className,
  hideTitle = false,
  editorTriggerButtonId,
}: CourseReviewsSectionProps) => {
  const queryClient = useQueryClient()
  const { isAuthenticated } = useAuthStatus()
  const { data: currentUser } = useUserProfile({ enabled: isAuthenticated })

  const currentUserId = currentUser?.id
  const reviewsQuery = useCourseReviews(courseId)
  const ownReviewQuery = useCourseReview(courseId, currentUserId, {
    enabled: isAuthenticated,
    allowMissing: true,
  })
  const createMutation = useCreateCourseReviewMutation(courseId)
  const updateMutation = useUpdateCourseReviewMutation(courseId, currentUserId)
  const deleteMutation = useDeleteCourseReviewMutation(courseId, currentUserId)

  const onMutated = useCallback(() => {
    if (courseId != null) {
      void queryClient.invalidateQueries({
        queryKey: ['courses', 'detail', courseId],
      })
    }

    void queryClient.invalidateQueries({ queryKey: ['courses', 'filter'] })
    void queryClient.invalidateQueries({ queryKey: ['lyceums', 'courses'] })
  }, [courseId, queryClient])

  return (
    <ReviewsSection
      titleKey="pages.reviews.sections.course.title"
      sectionId="course-reviews"
      editorMode="modal"
      hideTitle={hideTitle}
      averageRating={averageRating}
      isAuthenticated={isAuthenticated}
      currentUserId={currentUserId}
      reviewsQuery={reviewsQuery}
      ownReviewQuery={ownReviewQuery}
      createMutation={createMutation}
      updateMutation={updateMutation}
      deleteMutation={deleteMutation}
      onMutated={onMutated}
      className={className}
      editorTriggerButtonId={editorTriggerButtonId}
    />
  )
}
