import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useToast } from '../../components/feedback/ToastContext'
import SeoHead from '../../components/ui/SeoHead'
import { useCurrentLocale } from '../../hooks/useCurrentLocale'
import { useLocalizedNavigate } from '../../hooks/useLocalizedNavigate'
import { clearTokens } from '../../utils/authStorage'
import DeleteAccountModal from './components/DeleteAccountModal'
import ProfileDashboardHeaderCard from './components/ProfileDashboardHeaderCard'
import type { ProfileRoleChip } from './components/ProfileDashboardRoleInfo'
import ProfileDetailsCard from './components/ProfileDetailsCard'
import ProfileHeader from './components/ProfileHeader'
import ProfileLecturedCoursesPanel from './components/ProfileLecturedCoursesPanel'
import ProfileLyceumsPanel from './components/ProfileLyceumsPanel'
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
  const locale = useCurrentLocale()
  const navigate = useLocalizedNavigate()
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
  const userId = typeof user?.id === 'number' ? user.id : null
  const headlineName =
    summary.fullName === fallbackValue
      ? summary.displayName
      : summary.fullName

  const roleChips: ProfileRoleChip[] = []
  if (summary.hasLecturerRole) {
    roleChips.push({
      key: 'lecturer',
      label: t('pages.profile.roles.lecturer'),
    })
  }
  if (summary.hasLyceumAdministration) {
    roleChips.push({
      key: 'admin',
      label: t('pages.profile.roles.admin'),
    })
  }

  const administratedLyceumList = administratedLyceum
    ? [administratedLyceum]
    : []
  const shouldShowLecturedCoursesPanel =
    lecturedCoursesState.isLecturedCoursesLoading ||
    Boolean(lecturedCoursesState.lecturedCoursesError) ||
    lecturedCoursesState.lecturedCourses.length > 0
  const shouldShowLecturedLyceumsPanel =
    lecturedLyceumState.isLecturedLyceumsLoading ||
    Boolean(lecturedLyceumState.lecturedLyceumsError) ||
    lecturedLyceumState.lecturedLyceums.length > 0

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
      <SeoHead
        title={`${t('pages.profile.title')} | ${t('app.title')}`}
        description={t('pages.profile.subtitle')}
        canonicalPath="/profile"
        locale={locale}
        forceNoindex
      />
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
        <div className="space-y-6">
          <ProfileDashboardHeaderCard
            fullName={headlineName}
            username={summary.username}
            avatarUrl={summary.profileImageUrl}
            roleChips={roleChips}
            subtitleText={summary.email}
            hasLyceumAdministration={summary.hasLyceumAdministration}
            deleteErrorKey={deleteErrorKey}
            isDeletingAccount={deleteUserMutation.isPending}
            validationError={profileImageManager.validationError}
            actionError={profileImageManager.actionError}
            uploadProgress={profileImageManager.uploadProgress}
            hasExistingImage={profileImageManager.hasExistingImage}
            isSaving={profileImageManager.isSaving}
            isDeleting={profileImageManager.isDeleting}
            canDelete={profileImageManager.canDelete}
            onDeleteAccount={() => setIsDeleteModalOpen(true)}
            onImageFileChange={profileImageManager.handleImageFileChange}
            onDeleteImage={profileImageManager.handleDeleteImage}
          />

          <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
            <div className="order-1 lg:col-start-1">
              <ProfileDetailsCard
                fullName={summary.fullName}
                username={summary.username}
                email={summary.email}
                description={summary.description}
              />
            </div>

            {shouldShowLecturedCoursesPanel ? (
              <div className="order-2 lg:col-start-2">
                <ProfileLecturedCoursesPanel
                  courses={lecturedCoursesState.lecturedCourses}
                  isLoading={lecturedCoursesState.isLecturedCoursesLoading}
                  error={lecturedCoursesState.lecturedCoursesError ?? null}
                />
              </div>
            ) : null}

            {shouldShowLecturedLyceumsPanel ? (
              <div className="order-3 lg:col-start-1">
                <ProfileLyceumsPanel
                  title={t('pages.profile.lecturedLyceums.title')}
                  lyceums={lecturedLyceumState.lecturedLyceums}
                  isLoading={lecturedLyceumState.isLecturedLyceumsLoading}
                  error={lecturedLyceumState.lecturedLyceumsError}
                  emptyMessage={t('pages.profile.lecturedLyceums.empty')}
                />
              </div>
            ) : null}

            {summary.hasLyceumAdministration ? (
              <div className="order-4 lg:col-start-2">
                <ProfileLyceumsPanel
                  title={t('pages.profile.administratedLyceum.title')}
                  lyceums={administratedLyceumList}
                  isLoading={isAdministratedLyceumLoading}
                  error={administratedLyceumError ?? null}
                  emptyMessage={administratedLyceumName}
                />
              </div>
            ) : null}
          </div>

          <DeleteAccountModal
            isOpen={isDeleteModalOpen}
            username={summary.username || t('pages.profile.unknownUser')}
            onCancel={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteAccountConfirm}
            isSubmitting={deleteUserMutation.isPending}
          />
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
