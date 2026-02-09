import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

import { useAuthStatus } from '../../../hooks/useAuthStatus'
import { useUserProfile } from '../../Profile/hooks/useUserProfile'
import { ReviewsSection } from './ReviewsSection'
import {
  useCreateUserReviewMutation,
  useDeleteUserReviewMutation,
  useUpdateUserReviewMutation,
  useUserReview,
  useUserReviews,
} from '../hooks/useUserReviews'

type UserReviewsSectionProps = {
  userId?: number
  averageRating?: number | null
  lyceumId?: number
  className?: string
}

export const UserReviewsSection = ({
  userId,
  averageRating,
  lyceumId,
  className,
}: UserReviewsSectionProps) => {
  const queryClient = useQueryClient()
  const { isAuthenticated } = useAuthStatus()
  const { data: currentUser } = useUserProfile({ enabled: isAuthenticated })

  const currentUserId = currentUser?.id
  const reviewsQuery = useUserReviews(userId)
  const ownReviewQuery = useUserReview(userId, currentUserId, {
    enabled: isAuthenticated,
    allowMissing: true,
  })
  const createMutation = useCreateUserReviewMutation(userId)
  const updateMutation = useUpdateUserReviewMutation(userId, currentUserId)
  const deleteMutation = useDeleteUserReviewMutation(userId, currentUserId)

  const onMutated = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ['users'] })

    if (lyceumId != null) {
      void queryClient.invalidateQueries({
        queryKey: ['lyceums', 'lecturers', lyceumId],
      })
    }
  }, [lyceumId, queryClient])

  return (
    <ReviewsSection
      titleKey="pages.reviews.sections.user.title"
      sectionId="user-reviews"
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
    />
  )
}
