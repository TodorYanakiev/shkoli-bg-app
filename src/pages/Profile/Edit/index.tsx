import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'

import { useToast } from '../../../components/feedback/ToastContext'
import type { CurrentUser } from '../../../types/users'
import { clearTokens } from '../../../utils/authStorage'
import {
  getUpdateUserSchema,
  type UpdateUserFormValues,
} from '../../../validations/users'
import DeleteAccountModal from '../components/DeleteAccountModal'
import ProfileSummaryCard from '../components/ProfileSummaryCard'
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

const EditProfilePage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
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

  const onSubmit = (values: UpdateUserFormValues) => {
    if (!userId) return

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
      <Helmet>
        <title>{`${t('pages.profile.edit.title')} | ${t('app.title')}`}</title>
      </Helmet>
      <Link to="/profile" className="text-sm font-semibold text-brand">
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
