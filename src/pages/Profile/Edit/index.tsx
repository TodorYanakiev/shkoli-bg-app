import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { useToast } from '../../../components/feedback/ToastContext'
import SeoHead from '../../../components/ui/SeoHead'
import { useCurrentLocale } from '../../../hooks/useCurrentLocale'
import { useLocalizedNavigate } from '../../../hooks/useLocalizedNavigate'
import { useLocalizedPath } from '../../../hooks/useLocalizedPath'
import type { CurrentUser } from '../../../types/users'
import { clearTokens } from '../../../utils/authStorage'
import {
  getUpdateUserSchema,
  type UpdateUserFormValues,
} from '../../../validations/users'
import DeleteAccountModal from '../components/DeleteAccountModal'
import ProfileDashboardHeaderCard from '../components/ProfileDashboardHeaderCard'
import type { ProfileRoleChip } from '../components/ProfileDashboardRoleInfo'
import { useProfileImageManager } from '../hooks/useProfileImageManager'
import { useProfileUserSummary } from '../hooks/useProfileUserSummary'
import DeleteAccountSection from './components/DeleteAccountSection'
import ProfileEditForm from './components/ProfileEditForm'
import { useDeleteUserMutation } from '../hooks/useDeleteUserMutation'
import { useUpdateUserMutation } from '../hooks/useUpdateUserMutation'
import { userProfileQueryKey, useUserProfile } from '../hooks/useUserProfile'
import {
  getProfileDeleteErrorKey,
  getProfileErrorKey,
  getProfileUpdateErrorKey,
} from '../services/profileErrors'
import { applyUpdateUserServerFieldErrors } from './services/updateUserFormErrors'

const EditProfilePage = () => {
  const { t } = useTranslation()
  const locale = useCurrentLocale()
  const navigate = useLocalizedNavigate()
  const localizedPath = useLocalizedPath()
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const schema = useMemo(() => getUpdateUserSchema(t), [t])

  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
  } = useUserProfile()
  const summary = useProfileUserSummary(user, t)
  const profileImageManager = useProfileImageManager({
    user,
    t,
    showToast,
  })

  const updateMutation = useUpdateUserMutation()
  const deleteMutation = useDeleteUserMutation()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<UpdateUserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstname: '',
      lastname: '',
      username: '',
      email: '',
      description: '',
    },
  })

  useEffect(() => {
    if (!user) return
    reset({
      firstname: user.firstname ?? '',
      lastname: user.lastname ?? '',
      username: user.username ?? '',
      email: user.email ?? '',
      description: user.description ?? '',
    })
  }, [reset, user])

  const userId = typeof user?.id === 'number' ? user.id : null
  const fallbackValue = t('pages.profile.emptyValue')
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

  const onSubmit = (values: UpdateUserFormValues) => {
    if (!userId) return

    clearErrors()
    updateMutation.reset()

    const payload = {
      firstname: values.firstname.trim(),
      lastname: values.lastname.trim(),
      username: values.username.trim(),
      email: values.email.trim(),
      description: values.description?.trim() ?? '',
    }

    updateMutation.mutate(
      {
        userId,
        payload,
      },
      {
        onSuccess: (updatedUser) => {
          const previousUsername = user?.username?.trim() ?? ''
          const previousEmail = user?.email?.trim() ?? ''
          const hasIdentityChanged =
            previousUsername !== payload.username ||
            previousEmail !== payload.email

          if (hasIdentityChanged) {
            clearTokens()
            queryClient.removeQueries({ queryKey: ['users'] })
            showToast({
              message: t('feedback.profile.updated'),
              tone: 'success',
            })
            navigate('/auth/login', { replace: true })
            return
          }

          queryClient.setQueryData<CurrentUser | undefined>(
            userProfileQueryKey,
            (previousUser) =>
              previousUser
                ? {
                    ...previousUser,
                    ...updatedUser,
                  }
                : (updatedUser as CurrentUser),
          )
          showToast({
            message: t('feedback.profile.updated'),
            tone: 'success',
          })
          navigate('/profile', { replace: true })
        },
        onError: (error) =>
          applyUpdateUserServerFieldErrors({
            error,
            setError,
            t,
          }),
      },
    )
  }

  const handleDeleteConfirm = () => {
    if (!userId) return

    deleteMutation.mutate(
      { userId },
      {
        onSuccess: () => {
          clearTokens()
          queryClient.removeQueries({ queryKey: ['users'] })
          showToast({
            message: t('feedback.profile.deleted'),
            tone: 'success',
          })
          navigate('/auth/login', { replace: true })
        },
      },
    )
  }

  const loadErrorKey = getProfileErrorKey(userError ?? null)
  const updateErrorKey = getProfileUpdateErrorKey(updateMutation.error ?? null)
  const deleteErrorKey = getProfileDeleteErrorKey(deleteMutation.error ?? null)

  return (
    <section className="space-y-4">
      <SeoHead
        title={`${t('pages.profile.edit.title')} | ${t('app.title')}`}
        description={t('pages.profile.edit.subtitle')}
        canonicalPath="/profile/edit"
        locale={locale}
        forceNoindex
      />
      <Link to={localizedPath('/profile')} className="text-sm font-semibold text-brand">
        {t('pages.profile.edit.backLink')}
      </Link>
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          {t('pages.profile.edit.title')}
        </h1>
        <p className="text-sm text-slate-600">{t('pages.profile.edit.subtitle')}</p>
      </div>

      {isUserLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          {t('pages.profile.loading')}
        </div>
      ) : loadErrorKey ? (
        <div
          className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 shadow-sm"
          role="alert"
        >
          {t(loadErrorKey)}
        </div>
      ) : !user ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          {t('pages.profile.empty')}
        </div>
      ) : (
        <>
          <div className="w-full max-w-2xl">
            <ProfileDashboardHeaderCard
              fullName={headlineName}
              username={summary.username}
              avatarUrl={summary.profileImageUrl}
              roleChips={roleChips}
              subtitleText={summary.email}
              showAccountActions={false}
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
          </div>
          <ProfileEditForm
            register={register}
            errors={errors}
            isSubmitting={updateMutation.isPending}
            updateErrorKey={updateErrorKey}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
          />

          <DeleteAccountSection
            deleteErrorKey={deleteErrorKey}
            isDeleting={deleteMutation.isPending}
            onOpenModal={() => setIsDeleteModalOpen(true)}
          />

          <DeleteAccountModal
            isOpen={isDeleteModalOpen}
            username={user?.username ?? t('pages.profile.unknownUser')}
            onCancel={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteConfirm}
            isSubmitting={deleteMutation.isPending}
          />
        </>
      )}
    </section>
  )
}

export default EditProfilePage
