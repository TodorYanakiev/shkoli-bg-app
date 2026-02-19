import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

type ProfileAvatarActionsModalProps = {
  isOpen: boolean
  hasExistingImage: boolean
  isBusy: boolean
  isDeleting: boolean
  canDelete: boolean
  selectLabel: string
  onClose: () => void
  onUpdateImage: () => void
  onDeleteImage: () => void
}

const ProfileAvatarActionsModal = ({
  isOpen,
  hasExistingImage,
  isBusy,
  isDeleting,
  canDelete,
  selectLabel,
  onClose,
  onUpdateImage,
  onDeleteImage,
}: ProfileAvatarActionsModalProps) => {
  const { t } = useTranslation()

  useEffect(() => {
    if (!isOpen || typeof document === 'undefined') return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-4 py-8 backdrop-blur-sm"
      onClick={onClose}
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
            onClick={onClose}
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
              onClick={onUpdateImage}
              disabled={isBusy}
              className="inline-flex items-center justify-center rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {selectLabel}
            </button>
            {hasExistingImage ? (
              <button
                type="button"
                onClick={onDeleteImage}
                disabled={!canDelete}
                className="inline-flex items-center justify-center rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 transition hover:border-rose-300 disabled:cursor-not-allowed disabled:opacity-60"
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
  )
}

export default ProfileAvatarActionsModal
