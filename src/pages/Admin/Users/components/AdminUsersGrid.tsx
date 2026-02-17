import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { AppError } from '../../../../types/appError'
import type { UserResponse } from '../../../../types/users'
import { useAdminUserActions } from '../hooks/useAdminUserActions'
import type { AdminUsersPagination } from '../types'
import { AdminUserCard } from './AdminUserCard'
import { AdminUserDeleteModal } from './AdminUserDeleteModal'
import { AdminUserEditModal } from './AdminUserEditModal'
import { AdminUsersPaginationControls } from './AdminUsersPagination'

type AdminUsersGridProps = {
  users: UserResponse[]
  isLoading: boolean
  error: AppError | null
  hasActiveFilters: boolean
  pagination: AdminUsersPagination
}

const AdminUsersSkeleton = () => (
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: 6 }).map((_, index) => (
      <div
        key={`admin-user-skeleton-${index}`}
        className="flex h-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div className="h-6 w-28 animate-pulse rounded-full bg-slate-200" />
          <div className="h-6 w-24 animate-pulse rounded-full bg-slate-200" />
        </div>
        <div className="space-y-3">
          <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
          <div className="h-5 w-48 animate-pulse rounded bg-slate-200" />
          <div className="h-3 w-40 animate-pulse rounded bg-slate-200" />
        </div>
        <div className="space-y-3">
          <div className="h-3 w-full animate-pulse rounded bg-slate-200" />
          <div className="h-3 w-full animate-pulse rounded bg-slate-200" />
          <div className="h-3 w-full animate-pulse rounded bg-slate-200" />
        </div>
      </div>
    ))}
  </div>
)

export const AdminUsersGrid = ({
  users,
  isLoading,
  error,
  hasActiveFilters,
  pagination,
}: AdminUsersGridProps) => {
  const { t } = useTranslation()
  const {
    onUpdate,
    onDelete,
    onDeleteProfileImage,
    isUpdating,
    isDeleting,
    isDeletingProfileImage,
  } = useAdminUserActions()
  const [editTarget, setEditTarget] = useState<UserResponse | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number
    name?: string
  } | null>(null)

  const isEditSubmitting = editTarget ? isUpdating(editTarget.id) : false
  const isEditImageDeleting = editTarget
    ? isDeletingProfileImage(editTarget.id)
    : false
  const isDeleteSubmitting = deleteTarget
    ? isDeleting(deleteTarget.id)
    : false

  return (
    <>
      <div className="relative overflow-hidden rounded-3xl px-3 py-6 shadow-sm sm:p-6">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-8 left-10 h-24 w-24 rounded-full bg-brand/10 blur-2xl" />
          <div className="absolute bottom-6 right-8 h-28 w-28 rounded-full bg-emerald-100/80 blur-3xl" />
        </div>
        {isLoading ? (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              {t('pages.admin.users.loading')}
            </p>
            <AdminUsersSkeleton />
          </div>
        ) : error ? (
          <div
            className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
            role="alert"
          >
            {t(error.messageKey)}
          </div>
        ) : users.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-600">
            {hasActiveFilters
              ? t('pages.admin.users.emptyFiltered')
              : t('pages.admin.users.empty')}
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                {t('pages.admin.users.rangeLabel', {
                  start: pagination.pageStart,
                  end: pagination.pageEnd,
                  total: pagination.totalItems,
                })}
              </span>
              <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
                {t('pages.admin.users.badgeCountLabel', {
                  count: pagination.totalItems,
                })}
              </span>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {users.map((user, index) => (
                <li key={user.id ?? `admin-user-${index}`} className="h-full">
                  <AdminUserCard
                    user={user}
                    onRequestEdit={(targetUser) => {
                      if (!targetUser.id) return
                      setEditTarget(targetUser)
                    }}
                    onRequestDelete={(id, name) => {
                      if (!id) return
                      setDeleteTarget({ id, name })
                    }}
                    isUpdating={isUpdating(user.id)}
                    isDeleting={isDeleting(user.id)}
                  />
                </li>
              ))}
            </ul>
            {pagination.hasMultiplePages ? (
              <AdminUsersPaginationControls pagination={pagination} />
            ) : null}
          </div>
        )}
      </div>
      <AdminUserEditModal
        isOpen={Boolean(editTarget)}
        user={editTarget}
        isSubmitting={isEditSubmitting}
        isImageDeleting={isEditImageDeleting}
        onCancel={() => setEditTarget(null)}
        onConfirm={async (payload) => {
          const result = await onUpdate(payload)
          if (result.ok) {
            setEditTarget(null)
          }
          return result
        }}
        onDeleteProfileImage={onDeleteProfileImage}
      />
      <AdminUserDeleteModal
        isOpen={Boolean(deleteTarget)}
        userName={deleteTarget?.name}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) return
          const didDelete = await onDelete(deleteTarget.id)
          if (didDelete) {
            setDeleteTarget(null)
          }
        }}
        isSubmitting={isDeleteSubmitting}
      />
    </>
  )
}
