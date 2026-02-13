import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'

import UserAvatar from '../../../components/ui/UserAvatar'

type ProfileSummaryCardProps = {
  displayName: string
  username: string
  roleLabel: string
  avatarUrl: string | null
  validationError: string | null
  actionError: string | null
  uploadProgress: number | null
  hasExistingImage: boolean
  isSaving: boolean
  isDeleting: boolean
  canDelete: boolean
  onImageFileChange: (event: ChangeEvent<HTMLInputElement>) => void
  onDeleteImage: () => void
}

const ProfileSummaryCard = ({
  displayName,
  username,
  roleLabel,
  avatarUrl,
  validationError,
  actionError,
  uploadProgress,
  hasExistingImage,
  isSaving,
  isDeleting,
  canDelete,
  onImageFileChange,
  onDeleteImage,
}: ProfileSummaryCardProps) => {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)
  const selectLabel = hasExistingImage
    ? t('pages.profile.image.change')
    : t('pages.profile.image.select')
  const isBusy = isSaving || isDeleting

  useEffect(() => {
    if (!isAvatarModalOpen || typeof document === 'undefined') return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsAvatarModalOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isAvatarModalOpen])

  const handleOpenModal = () => {
    if (isBusy) return
    setIsAvatarModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsAvatarModalOpen(false)
  }

  const handleUpdateImage = () => {
    setIsAvatarModalOpen(false)
    fileInputRef.current?.click()
  }

  const handleDeleteImage = () => {
    setIsAvatarModalOpen(false)
    onDeleteImage()
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-900">
        {t('pages.profile.summary.title')}
      </h2>
      <div className="mt-4 flex items-center gap-4">
        <button
          type="button"
          onClick={handleOpenModal}
          disabled={isBusy}
          className="group relative h-24 w-24 rounded-full disabled:cursor-not-allowed disabled:opacity-70"
          aria-label={selectLabel}
        >
          <UserAvatar
            alt={`${username} profile picture`}
            src={avatarUrl}
            size="full"
            className="h-full w-full"
          />
          <span
            className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-slate-900/60 px-2 text-center text-[11px] font-semibold text-white opacity-0 transition duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
          >
            {selectLabel}
          </span>
        </button>
        <input
          ref={fileInputRef}
          id="profile-summary-avatar-upload"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={onImageFileChange}
          disabled={isBusy}
        />
        <div>
          <p className="text-lg font-semibold text-slate-900">{displayName}</p>
          <span className="mt-2 inline-flex items-center rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
            {roleLabel}
          </span>
        </div>
      </div>
      {isSaving && typeof uploadProgress === 'number' ? (
        <p className="mt-2 text-xs text-slate-600">
          {t('pages.profile.image.progress', { progress: uploadProgress })}
        </p>
      ) : null}
      {validationError ? (
        <p className="mt-2 text-xs text-rose-600" role="alert">
          {validationError}
        </p>
      ) : null}
      {actionError ? (
        <p className="mt-2 text-xs text-rose-600" role="alert">
          {actionError}
        </p>
      ) : null}
      {isAvatarModalOpen ? (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-4 py-8 backdrop-blur-sm"
          onClick={handleCloseModal}
          role="presentation"
        >
          <div
            className="w-full max-w-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-avatar-actions-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative rounded-2xl border border-slate-200/70 bg-white/95 p-5 shadow-xl">
              <button
                type="button"
                onClick={handleCloseModal}
                className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
                aria-label={t('feedback.dismiss')}
                title={t('feedback.dismiss')}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M6 6l12 12" />
                  <path d="M18 6l-12 12" />
                </svg>
              </button>
              <h3
                id="profile-avatar-actions-title"
                className="text-sm font-semibold text-slate-900"
              >
                {t('pages.profile.image.title')}
              </h3>
              <div className="mt-4 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleUpdateImage}
                  disabled={isBusy}
                  className="inline-flex items-center justify-center rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {selectLabel}
                </button>
                {hasExistingImage ? (
                  <button
                    type="button"
                    onClick={handleDeleteImage}
                    disabled={!canDelete}
                    className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
                  >
                    {isDeleting
                      ? t('pages.profile.image.actions.deleting')
                      : t('pages.profile.image.actions.delete')}
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default ProfileSummaryCard
