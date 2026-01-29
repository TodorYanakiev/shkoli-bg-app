import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { AppError } from '../../../../types/appError'
import { getUserDisplayName } from '../../../../utils/user'
import { useAdminLyceumAdmins } from '../hooks/useAdminLyceumAdmins'
import { getAdminLyceumsAdminsLoadError } from '../services/adminLyceumsErrors'

type AdminLyceumAdminListProps = {
  lyceumId: number
  isOpen: boolean
  isRemoving: boolean
  removingId: number | null
  removeError: AppError | null
  onRemove: (lyceumId: number, userId?: number) => Promise<boolean>
}

export const AdminLyceumAdminList = ({
  lyceumId,
  isOpen,
  isRemoving,
  removingId,
  removeError,
  onRemove,
}: AdminLyceumAdminListProps) => {
  const { t } = useTranslation()
  const [confirmingId, setConfirmingId] = useState<number | null>(null)
  const adminsQuery = useAdminLyceumAdmins(lyceumId, { enabled: isOpen })
  const loadError = getAdminLyceumsAdminsLoadError(
    adminsQuery.error ?? null,
  )
  const fallbackValue = t('pages.lyceums.detail.notProvided')

  useEffect(() => {
    if (confirmingId == null) return
    if (adminsQuery.data?.some((admin) => admin.id === confirmingId)) return
    setConfirmingId(null)
  }, [adminsQuery.data, confirmingId])

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4">
      <h4 className="text-sm font-semibold text-slate-900">
        {t('pages.admin.lyceums.admins.list.title')}
      </h4>
      <p className="mt-1 text-sm text-slate-600">
        {t('pages.admin.lyceums.admins.list.subtitle')}
      </p>
      {adminsQuery.isLoading ? (
        <div className="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-4 text-sm text-slate-600">
          {t('pages.admin.lyceums.admins.list.loading')}
        </div>
      ) : loadError ? (
        <div
          className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-4 text-sm text-rose-700"
          role="alert"
        >
          {t(loadError.messageKey)}
        </div>
      ) : adminsQuery.data && adminsQuery.data.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {adminsQuery.data.map((admin, index) => {
            const displayName = getUserDisplayName(admin) || fallbackValue
            const adminId = admin.id
            const email = admin.email ?? fallbackValue
            const isRowRemoving = isRemoving && removingId === adminId
            const isRemoveDisabled = isRemoving || !adminId
            const isConfirming = confirmingId === adminId

            return (
              <li
                key={admin.id ?? `${displayName}-${index}`}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                <div>
                  <p className="font-semibold text-slate-900">
                    {displayName}
                  </p>
                  <p className="text-xs text-slate-500">{email}</p>
                </div>
                <div className="flex items-center gap-2">
                  {isConfirming ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setConfirmingId(null)}
                        className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-600 transition hover:border-slate-300"
                      >
                        {t('pages.admin.lyceums.admins.list.cancel')}
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          if (!adminId) return
                          const didRemove = await onRemove(lyceumId, adminId)
                          if (didRemove) {
                            setConfirmingId(null)
                          }
                        }}
                        disabled={isRemoveDisabled}
                        className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-[11px] font-semibold text-rose-700 transition hover:border-rose-300 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isRowRemoving
                          ? t('pages.admin.lyceums.actions.deleting')
                          : t('pages.admin.lyceums.admins.list.confirm')}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmingId(adminId ?? null)}
                      disabled={isRemoveDisabled}
                      className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-600 transition hover:border-brand/40 hover:text-brand disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {t('pages.admin.lyceums.admins.list.remove')}
                    </button>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      ) : (
        <div className="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-4 text-sm text-slate-600">
          {t('pages.admin.lyceums.admins.list.empty')}
        </div>
      )}
      {removeError ? (
        <div
          className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
          role="alert"
        >
          {t(removeError.messageKey)}
        </div>
      ) : null}
    </div>
  )
}
