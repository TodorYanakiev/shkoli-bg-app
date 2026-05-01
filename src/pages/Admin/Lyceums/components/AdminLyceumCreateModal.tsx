import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { createPortal } from 'react-dom'

import type { AppError } from '../../../../types/appError'
import { useAdminLyceumCreateForm } from '../hooks/useAdminLyceumCreateForm'
import { buildAdminLyceumCreatePayload } from '../services/adminLyceumCreatePayload'
import { getAdminLyceumsCreateError } from '../services/adminLyceumsErrors'
import { applyAdminLyceumCreateFieldErrors } from '../services/adminLyceumCreateFieldErrors'
import type {
  AdminLyceumCreatePayload,
  AdminLyceumCreateResult,
} from '../types'
import { AdminLyceumCreateForm } from './AdminLyceumCreateForm'

type AdminLyceumCreateModalProps = {
  isOpen: boolean
  isSubmitting: boolean
  onConfirm: (
    payload: AdminLyceumCreatePayload,
  ) => Promise<AdminLyceumCreateResult>
  onCancel: () => void
}

export const AdminLyceumCreateModal = ({
  isOpen,
  isSubmitting,
  onConfirm,
  onCancel,
}: AdminLyceumCreateModalProps) => {
  const { t } = useTranslation()
  const [submitError, setSubmitError] = useState<AppError | null>(null)
  const {
    control,
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useAdminLyceumCreateForm({
    isOpen,
    t,
  })

  const handleCancel = useCallback(() => {
    if (isSubmitting) return
    setSubmitError(null)
    onCancel()
  }, [isSubmitting, onCancel])

  useEffect(() => {
    if (!isOpen) {
      setSubmitError(null)
      return
    }
    if (typeof document === 'undefined') return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCancel()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleCancel, isOpen])

  if (!isOpen) return null
  if (typeof document === 'undefined') return null

  const modalTitleId = 'admin-lyceum-create-title'
  const modalDescriptionId = 'admin-lyceum-create-description'

  const onSubmit = handleSubmit(async (values) => {
    if (isSubmitting) return
    clearErrors()
    setSubmitError(null)

    const result = await onConfirm(buildAdminLyceumCreatePayload(values))

    if (result.ok) {
      onCancel()
      return
    }

    if (!result.error) return
    const hasFieldErrors = applyAdminLyceumCreateFieldErrors({
      error: result.error,
      setError,
      t,
    })
    if (!hasFieldErrors) {
      setSubmitError(getAdminLyceumsCreateError(result.error))
    }
  })

  const modalContent = (
    <div
      className="fixed inset-0 z-[70] overflow-y-auto bg-slate-900/40 px-4 py-8 backdrop-blur-sm"
      onClick={handleCancel}
      role="presentation"
    >
      <div
        className="mx-auto flex min-h-full w-full max-w-4xl items-center justify-center"
        role="presentation"
      >
        <div
          className="relative max-h-[calc(100dvh-4rem)] w-full overflow-y-auto rounded-2xl border border-slate-200/70 bg-white/95 p-5 shadow-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby={modalTitleId}
          aria-describedby={modalDescriptionId}
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            onClick={handleCancel}
            className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label={t('feedback.dismiss')}
            title={t('feedback.dismiss')}
            disabled={isSubmitting}
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

          <h3 id={modalTitleId} className="text-sm font-semibold text-slate-900">
            {t('pages.admin.lyceums.create.title')}
          </h3>
          <p id={modalDescriptionId} className="mt-1 text-sm text-slate-600">
            {t('pages.admin.lyceums.create.description')}
          </p>

          <AdminLyceumCreateForm
            control={control}
            register={register}
            errors={errors}
            isSubmitting={isSubmitting}
            submitError={submitError}
            onCancel={handleCancel}
            onSubmit={onSubmit}
          />
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
