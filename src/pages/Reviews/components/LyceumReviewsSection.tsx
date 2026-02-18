import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'

import { useAuthStatus } from '../../../hooks/useAuthStatus'
import { useUserProfile } from '../../Profile/hooks/useUserProfile'
import { ReviewsSection } from './ReviewsSection'
import {
  useCreateLyceumReviewMutation,
  useDeleteLyceumReviewMutation,
  useLyceumReview,
  useLyceumReviews,
  useUpdateLyceumReviewMutation,
} from '../hooks/useLyceumReviews'

type LyceumReviewsSectionProps = {
  lyceumId?: number
  averageRating?: number | null
  className?: string
}

export const LyceumReviewsSection = ({
  lyceumId,
  averageRating,
  className,
}: LyceumReviewsSectionProps) => {
  const queryClient = useQueryClient()
  const { isAuthenticated } = useAuthStatus()
  const { data: currentUser } = useUserProfile({ enabled: isAuthenticated })

  const currentUserId = currentUser?.id
  const reviewsQuery = useLyceumReviews(lyceumId)
  const reviews = useMemo(() => reviewsQuery.data ?? [], [reviewsQuery.data])
  const hasOwnReviewInList = useMemo(
    () =>
      !isAuthenticated || currentUserId == null
        ? false
        : reviews.some((review) => review.userId === currentUserId),
    [currentUserId, isAuthenticated, reviews],
  )
  const ownReviewQuery = useLyceumReview(lyceumId, currentUserId, {
    enabled: isAuthenticated && hasOwnReviewInList,
    allowMissing: true,
  })
  const createMutation = useCreateLyceumReviewMutation(lyceumId)
  const updateMutation = useUpdateLyceumReviewMutation(lyceumId, currentUserId)
  const deleteMutation = useDeleteLyceumReviewMutation(lyceumId, currentUserId)

  const onMutated = useCallback(() => {
    if (lyceumId != null) {
      void queryClient.invalidateQueries({
        queryKey: ['lyceums', 'detail', lyceumId],
      })
    }

    void queryClient.invalidateQueries({ queryKey: ['lyceums'] })
  }, [lyceumId, queryClient])

  return (
    <ReviewsSection
      titleKey="pages.reviews.sections.lyceum.title"
      sectionId="lyceum-reviews"
      editorMode="modal"
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
