import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useToast } from '../../components/feedback/ToastContext'
import { clearTokens } from '../../utils/authStorage'
import DeleteAccountModal from './components/DeleteAccountModal'
import ProfileActionsCard from './components/ProfileActionsCard'
import ProfileDetailsCard from './components/ProfileDetailsCard'
import ProfileHeader from './components/ProfileHeader'
import ProfileLecturedCoursesPanel from './components/ProfileLecturedCoursesPanel'
import ProfileLyceumsPanel from './components/ProfileLyceumsPanel'
import ProfileSummaryCard from './components/ProfileSummaryCard'
import { useAdministratedLyceum } from './hooks/useAdministratedLyceum'
import { useDeleteUserMutation } from './hooks/useDeleteUserMutation'
import { useProfileLecturedCourses } from './hooks/useProfileLecturedCourses'
import { useProfileLecturedLyceums } from './hooks/useProfileLecturedLyceums'
import { useProfileImageManager } from './hooks/useProfileImageManager'
import { useProfileUserSummary } from './hooks/useProfileUserSummary'
import { userProfileQueryKey, useUserProfile } from './hooks/useUserProfile'
import { getProfileDeleteErrorKey, getProfileErrorKey } from './services/profileErrors'

const ProfilePage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const { data: user, isLoading, error } = useUserProfile()
  const deleteUserMutation = useDeleteUserMutation()
  const errorKey = getProfileErrorKey(error ?? null)
  const errorMessage = errorKey ? t(errorKey) : null
  const deleteErrorKey = getProfileDeleteErrorKey(deleteUserMutation.error ?? null)
  const summary = useProfileUserSummary(user, t)
  const profileImageManager = useProfileImageManager({
    user,
    t,
    showToast,
  })
  const {
    data: administratedLyceum,
    isLoading: isAdministratedLyceumLoading,
    error: administratedLyceumError,
  } = useAdministratedLyceum(summary.administratedLyceumId, {
    enabled: Boolean(summary.administratedLyceumId),
  })
  const lecturedLyceumState = useProfileLecturedLyceums({
    lecturedLyceumIds: summary.lecturedLyceumIds,
    enabled: summary.hasLecturedLyceum,
  })
  const lecturedCoursesState = useProfileLecturedCourses({
    lecturerId: summary.lecturerId,
    enabled: summary.hasLecturedCourses,
  })

  const administratedLyceumName = summary.administratedLyceumId
    ? isAdministratedLyceumLoading
      ? t('pages.profile.details.administratedLyceumLoading')
      : administratedLyceumError
        ? t('pages.profile.details.administratedLyceumUnavailable')
        : administratedLyceum?.name ??
          t('pages.profile.details.administratedLyceumUnknown')
    : t('pages.profile.emptyValue')
  const fallbackValue = t('pages.profile.emptyValue')
  const hasRightCourses = summary.hasLecturedCourses
  const hasRightLyceums =
    summary.hasLyceumAdministration || summary.hasLecturedLyceum
  const hasRightContent = hasRightCourses || hasRightLyceums
  const userId = typeof user?.id === 'number' ? user.id : null
  const rightColumnClassName = [
    'lg:ml-auto',
    hasRightCourses && hasRightLyceums
      ? 'grid gap-4 lg:grid-cols-2 lg:items-start'
      : 'space-y-4',
  ].join(' ')

  const handleDeleteAccountConfirm = () => {
    if (!userId) return

    deleteUserMutation.mutate(
      { userId },
      {
        onSuccess: () => {
          clearTokens()
          queryClient.removeQueries({ queryKey: ['users'] })
          queryClient.removeQueries({ queryKey: userProfileQueryKey })
          showToast({
            message: t('feedback.profile.deleted'),
            tone: 'success',
          })
          navigate('/auth/login', { replace: true })
        },
      },
    )
  }

  return (
    <section className="space-y-6">
      <Helmet>
        <title>{`${t('pages.profile.title')} | ${t('app.title')}`}</title>
      </Helmet>
      <ProfileHeader />
      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          {t('pages.profile.loading')}
        </div>
      ) : errorMessage ? (
        <div
          className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 shadow-sm"
          role="alert"
        >
          {errorMessage}
        </div>
      ) : user ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_auto] lg:items-start">
          <div className="space-y-6">
            <ProfileSummaryCard
              displayName={summary.displayName}
              username={summary.username}
              roleLabel={summary.roleLabel}
              avatarUrl={summary.profileImageUrl}
              validationError={profileImageManager.validationError}
              actionError={profileImageManager.actionError}
              uploadProgress={profileImageManager.uploadProgress}
              hasExistingImage={profileImageManager.hasExistingImage}
              isSaving={profileImageManager.isSaving}
              isDeleting={profileImageManager.isDeleting}
              canDelete={profileImageManager.canDelete}
              onImageFileChange={profileImageManager.handleImageFileChange}
              onDeleteImage={profileImageManager.handleDeleteImage}
            />
            <ProfileDetailsCard
              fullName={summary.fullName}
              username={summary.username}
              email={summary.email}
              description={summary.description}
              administratedLyceumName={administratedLyceumName}
              showAdministratedLyceum={Boolean(summary.administratedLyceumId)}
            />
            <ProfileActionsCard
              hasLyceumAdministration={summary.hasLyceumAdministration}
              deleteErrorKey={deleteErrorKey}
              isDeletingAccount={deleteUserMutation.isPending}
              onDeleteAccount={() => setIsDeleteModalOpen(true)}
            />
            <DeleteAccountModal
              isOpen={isDeleteModalOpen}
              username={summary.username || t('pages.profile.unknownUser')}
              onCancel={() => setIsDeleteModalOpen(false)}
              onConfirm={handleDeleteAccountConfirm}
              isSubmitting={deleteUserMutation.isPending}
            />
          </div>
          {hasRightContent ? (
            <div className={rightColumnClassName}>
              {hasRightCourses ? (
                <ProfileLecturedCoursesPanel
                  displayName={summary.displayName}
                  fallbackValue={fallbackValue}
                  activeCourse={lecturedCoursesState.activeLecturedCourse}
                  isLoading={lecturedCoursesState.isLecturedCoursesLoading}
                  error={lecturedCoursesState.lecturedCoursesError ?? null}
                  count={lecturedCoursesState.lecturedCoursesCount}
                  showControls={lecturedCoursesState.showCourseControls}
                  currentIndex={lecturedCoursesState.lecturedCourseIndex}
                  onPrevious={lecturedCoursesState.handleLecturedCoursePrevious}
                  onNext={lecturedCoursesState.handleLecturedCourseNext}
                />
              ) : null}
              {hasRightLyceums ? (
                <ProfileLyceumsPanel
                  hasLyceumAdministration={summary.hasLyceumAdministration}
                  administratedLyceumId={summary.administratedLyceumId}
                  administratedLyceum={administratedLyceum}
                  isAdministratedLyceumLoading={isAdministratedLyceumLoading}
                  administratedLyceumError={administratedLyceumError ?? null}
                  hasLecturedLyceum={summary.hasLecturedLyceum}
                  activeLecturedLyceum={lecturedLyceumState.activeLecturedLyceum}
                  isLecturedLyceumLoading={
                    lecturedLyceumState.isLecturedLyceumLoading
                  }
                  lecturedLyceumError={lecturedLyceumState.lecturedLyceumError}
                  showLecturedControls={lecturedLyceumState.showLecturedControls}
                  currentLecturedIndex={lecturedLyceumState.lecturedLyceumIndex}
                  lecturedCount={lecturedLyceumState.lecturedLyceumCount}
                  onLecturedPrevious={lecturedLyceumState.handleLecturedPrevious}
                  onLecturedNext={lecturedLyceumState.handleLecturedNext}
                />
              ) : null}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          {t('pages.profile.empty')}
        </div>
      )}
    </section>
  )
}

export default ProfilePage
