import { useRef, useState, type ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'

import UserAvatar from '../../../components/ui/UserAvatar'
import ProfileAvatarActionsModal from './ProfileAvatarActionsModal'
import ProfileDashboardHeaderActions from './ProfileDashboardHeaderActions'
import ProfileDashboardRoleInfo, {
  type ProfileRoleChip,
} from './ProfileDashboardRoleInfo'

type ProfileDashboardHeaderCardProps = {
  fullName: string
  username: string
  avatarUrl: string | null
  roleChips: ProfileRoleChip[]
  subtitleText: string
  hasLyceumAdministration?: boolean
  deleteErrorKey?: string | null
  isDeletingAccount?: boolean
  showAccountActions?: boolean
  validationError: string | null
  actionError: string | null
  uploadProgress: number | null
  hasExistingImage: boolean
  isSaving: boolean
  isDeleting: boolean
  canDelete: boolean
  onDeleteAccount?: () => void
  onImageFileChange: (event: ChangeEvent<HTMLInputElement>) => void
  onDeleteImage: () => void
}

const ProfileDashboardHeaderCard = ({
  fullName,
  username,
  avatarUrl,
  roleChips,
  subtitleText,
  hasLyceumAdministration = false,
  deleteErrorKey = null,
  isDeletingAccount = false,
  showAccountActions = true,
  validationError,
  actionError,
  uploadProgress,
  hasExistingImage,
  isSaving,
  isDeleting,
  canDelete,
  onDeleteAccount,
  onImageFileChange,
  onDeleteImage,
}: ProfileDashboardHeaderCardProps) => {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)
  const selectLabel = hasExistingImage
    ? t('pages.profile.image.change')
    : t('pages.profile.image.select')
  const isBusy = isSaving || isDeleting

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
    <article className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-r from-white via-emerald-50/50 to-white p-5 shadow-sm sm:p-6 lg:p-8">
      <div className="pointer-events-none absolute -right-20 -top-16 h-56 w-56 rounded-full bg-emerald-100/70 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-brand/10 blur-3xl" />
      <div className="relative z-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={handleOpenModal}
            disabled={isBusy}
            className="group relative h-28 w-28 shrink-0 rounded-full disabled:cursor-not-allowed disabled:opacity-70"
            aria-label={selectLabel}
          >
            <UserAvatar
              alt={t('pages.profile.image.avatarAlt', { username })}
              src={avatarUrl}
              size="full"
              className="h-full w-full"
            />
            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-slate-900/60 px-3 text-center text-[11px] font-semibold text-white opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
              {selectLabel}
            </span>
          </button>
          <input
            ref={fileInputRef}
            id="profile-header-avatar-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={onImageFileChange}
            disabled={isBusy}
          />
          <div className="min-w-0">
            <h2 className="break-words text-2xl font-semibold text-slate-900 sm:text-3xl">
              {fullName}
            </h2>
            <ProfileDashboardRoleInfo
              roleChips={roleChips}
              subtitleText={subtitleText}
            />
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
          </div>
        </div>
      </div>
      {showAccountActions ? (
        <ProfileDashboardHeaderActions
          hasLyceumAdministration={hasLyceumAdministration}
          deleteErrorKey={deleteErrorKey}
          isDeletingAccount={isDeletingAccount}
          onDeleteAccount={onDeleteAccount ?? (() => undefined)}
        />
      ) : null}
      <ProfileAvatarActionsModal
        isOpen={isAvatarModalOpen}
        hasExistingImage={hasExistingImage}
        isBusy={isBusy}
        isDeleting={isDeleting}
        canDelete={canDelete}
        selectLabel={selectLabel}
        onClose={handleCloseModal}
        onUpdateImage={handleUpdateImage}
        onDeleteImage={handleDeleteImage}
      />
    </article>
  )
}

export default ProfileDashboardHeaderCard
