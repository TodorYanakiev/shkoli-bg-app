import type { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'

import UserAvatar from '../../../components/ui/UserAvatar'
import {
  formatImageSize,
  getDefaultUserProfileImageAltText,
} from '../../../utils/userImages'

type RegisterProfileImageFieldProps = {
  username: string
  selectedFile: File | null
  previewUrl: string | null
  validationError: string | null
  uploadProgress: number | null
  isProcessing: boolean
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void
  onClearSelection: () => void
}

const RegisterProfileImageField = ({
  username,
  selectedFile,
  previewUrl,
  validationError,
  uploadProgress,
  isProcessing,
  onFileChange,
  onClearSelection,
}: RegisterProfileImageFieldProps) => {
  const { t } = useTranslation()
  const hasSelection = Boolean(selectedFile)

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-slate-800">
        {t('pages.register.form.profileImageLabel')}
      </p>
      <div className="flex flex-wrap items-center gap-4">
        <div className="group relative h-24 w-24">
          <UserAvatar
            alt={getDefaultUserProfileImageAltText(username)}
            src={previewUrl}
            size="full"
            className="h-full w-full"
          />
          <label
            htmlFor="register-profile-image"
            className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-slate-900/60 px-2 text-center text-[11px] font-semibold text-white opacity-0 transition duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
          >
            {hasSelection
              ? t('pages.register.form.profileImageChange')
              : t('pages.register.form.profileImageSelect')}
          </label>
          <input
            data-testid="register-profile-image"
            id="register-profile-image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={onFileChange}
          />
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          {hasSelection && selectedFile ? (
            <p className="text-xs text-slate-600">
              {selectedFile.name} ({formatImageSize(selectedFile.size)})
            </p>
          ) : null}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onClearSelection}
              disabled={!hasSelection || isProcessing}
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
            >
              {t('pages.register.form.profileImageRemove')}
            </button>
            {isProcessing && typeof uploadProgress === 'number' ? (
              <span className="text-xs text-slate-600">
                {t('pages.register.form.profileImageUploading', {
                  progress: uploadProgress,
                })}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {validationError ? (
        <p className="text-xs text-rose-600" role="alert">
          {validationError}
        </p>
      ) : null}
    </div>
  )
}

export default RegisterProfileImageField
