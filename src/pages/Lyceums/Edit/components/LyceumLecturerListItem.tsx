import { useTranslation } from 'react-i18next'

import {
  cancelButtonClassName,
  confirmButtonClassName,
  removeButtonClassName,
} from './lyceumLecturerStyles'

type LyceumLecturerListItemProps = {
  displayName: string
  email: string
  isConfirming: boolean
  isRemoving: boolean
  isRemoveDisabled: boolean
  onConfirmRemove: () => void
  onCancelConfirm: () => void
  onRequestConfirm: () => void
}

const LyceumLecturerListItem = ({
  displayName,
  email,
  isConfirming,
  isRemoving,
  isRemoveDisabled,
  onConfirmRemove,
  onCancelConfirm,
  onRequestConfirm,
}: LyceumLecturerListItemProps) => {
  const { t } = useTranslation()

  return (
    <li className="flex flex-col gap-3 rounded-xl border border-slate-200/70 bg-white px-3 py-3 text-sm shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-slate-900">{displayName}</p>
        <p className="truncate text-xs text-slate-500">{email}</p>
      </div>
      {isConfirming ? (
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <span className="text-[10px] font-semibold text-rose-600">
            {t('pages.lyceums.edit.lecturers.confirmPrompt')}
          </span>
          <button
            type="button"
            onClick={onConfirmRemove}
            disabled={isRemoveDisabled}
            className={confirmButtonClassName}
          >
            {isRemoving
              ? t('pages.lyceums.edit.lecturers.removing')
              : t('pages.lyceums.edit.lecturers.confirmAction')}
          </button>
          <button
            type="button"
            onClick={onCancelConfirm}
            disabled={isRemoveDisabled}
            className={cancelButtonClassName}
          >
            {t('pages.lyceums.edit.lecturers.cancelAction')}
          </button>
        </div>
      ) : (
        <div className="flex items-center sm:justify-end">
          <button
            type="button"
            onClick={onRequestConfirm}
            disabled={isRemoveDisabled}
            className={removeButtonClassName}
            aria-label={t('pages.lyceums.edit.lecturers.removeLabel', {
              name: displayName,
            })}
            title={t('pages.lyceums.edit.lecturers.removeLabel', {
              name: displayName,
            })}
          >
            {t('pages.lyceums.edit.lecturers.removeAction')}
          </button>
        </div>
      )}
    </li>
  )
}

export default LyceumLecturerListItem
