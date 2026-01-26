import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { UserResponse } from '../../../../types/users'
import { getUserDisplayName } from '../../../../utils/user'
import LyceumLecturerListItem from './LyceumLecturerListItem'

type LyceumLecturerListProps = {
  lecturers?: UserResponse[]
  isLoading: boolean
  loadErrorKey: string | null
  removeErrorKey: string | null
  isRemoving: boolean
  removingId: number | null
  onRemove: (userId?: number) => void
}

const LyceumLecturerList = ({
  lecturers,
  isLoading,
  loadErrorKey,
  removeErrorKey,
  isRemoving,
  removingId,
  onRemove,
}: LyceumLecturerListProps) => {
  const { t } = useTranslation()
  const [confirmingId, setConfirmingId] = useState<number | null>(null)
  const fallbackValue = t('pages.lyceums.detail.notProvided')

  useEffect(() => {
    if (confirmingId == null) return
    if (lecturers?.some((lecturer) => lecturer.id === confirmingId)) return
    setConfirmingId(null)
  }, [confirmingId, lecturers])

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">
        {t('pages.lyceums.edit.lecturers.listTitle')}
      </h3>
      <p className="mt-1 text-sm text-slate-600">
        {t('pages.lyceums.edit.lecturers.listDescription')}
      </p>
      {isLoading ? (
        <div className="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-4 text-sm text-slate-600">
          {t('pages.lyceums.edit.lecturers.loading')}
        </div>
      ) : loadErrorKey ? (
        <div
          className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-4 text-sm text-rose-700"
          role="alert"
        >
          {t(loadErrorKey)}
        </div>
      ) : lecturers && lecturers.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {lecturers.map((lecturer, index) => {
            const displayName = getUserDisplayName(lecturer) || fallbackValue
            const email = lecturer.email ?? fallbackValue
            const lecturerId = lecturer.id
            const isRowRemoving = isRemoving && removingId === lecturerId
            const isRemoveDisabled = isRemoving || !lecturerId
            const isConfirming = confirmingId === lecturerId

            return (
              <LyceumLecturerListItem
                key={lecturer.id ?? `${displayName}-${index}`}
                displayName={displayName}
                email={email}
                isRemoving={isRowRemoving}
                isRemoveDisabled={isRemoveDisabled}
                isConfirming={isConfirming}
                onRequestConfirm={() =>
                  setConfirmingId(lecturerId ?? null)
                }
                onCancelConfirm={() => setConfirmingId(null)}
                onConfirmRemove={() => {
                  setConfirmingId(null)
                  onRemove(lecturerId)
                }}
              />
            )
          })}
        </ul>
      ) : (
        <div className="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-4 text-sm text-slate-600">
          {t('pages.lyceums.edit.lecturers.empty')}
        </div>
      )}
      {removeErrorKey ? (
        <div
          className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
          role="alert"
        >
          {t(removeErrorKey)}
        </div>
      ) : null}
    </div>
  )
}

export default LyceumLecturerList
