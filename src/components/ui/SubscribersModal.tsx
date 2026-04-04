import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { createPortal } from 'react-dom'

import { SubscribersExportPanel } from './SubscribersExportPanel'
import { SubscribersListSection } from './SubscribersListSection'
import type { UserResponse } from '../../types/users'
import type { SubscriberExportFormat } from '../../types/subscribers'

type ExportFormatOption = {
  value: SubscriberExportFormat
  label: string
}

type SubscribersModalProps = {
  modalId: string
  title: string
  subtitle: string
  subscriberCount: number
  subscribers?: UserResponse[]
  isSubscribersLoading: boolean
  subscribersErrorMessage: string | null
  emptyMessage: string
  selectedFormat: SubscriberExportFormat
  formatOptions: ExportFormatOption[]
  exportActionLabel: string
  exportStatusLabel: string | null
  exportStatusMessage: string | null
  exportStatusTone: 'neutral' | 'success' | 'danger'
  exportErrorMessage: string | null
  isExportActionDisabled: boolean
  onClose: () => void
  onChangeFormat: (format: SubscriberExportFormat) => void
  onRunExportAction: () => void
}

export const SubscribersModal = ({
  modalId,
  title,
  subtitle,
  subscriberCount,
  subscribers,
  isSubscribersLoading,
  subscribersErrorMessage,
  emptyMessage,
  selectedFormat,
  formatOptions,
  exportActionLabel,
  exportStatusLabel,
  exportStatusMessage,
  exportStatusTone,
  exportErrorMessage,
  isExportActionDisabled,
  onClose,
  onChangeFormat,
  onRunExportAction,
}: SubscribersModalProps) => {
  const { t } = useTranslation()
  const modalTitleId = `${modalId}-title`
  const modalDescriptionId = `${modalId}-description`

  useEffect(() => {
    if (typeof document === 'undefined') return undefined

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
  }, [onClose])

  if (typeof document === 'undefined') {
    return null
  }

  const modalContent = (
    <div
      className="fixed inset-0 z-[1400] overflow-y-auto bg-slate-950/55 px-4 py-6 backdrop-blur-md sm:px-6 sm:py-10"
      onClick={onClose}
      role="presentation"
    >
      <div className="mx-auto flex min-h-full w-full max-w-5xl items-start justify-center sm:items-center">
        <div
          id={modalId}
          role="dialog"
          aria-modal="true"
          aria-labelledby={modalTitleId}
          aria-describedby={modalDescriptionId}
          className="w-full"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="relative flex max-h-[min(780px,calc(100vh-3rem))] flex-col overflow-hidden rounded-[30px] border border-white/70 bg-white shadow-[0_32px_90px_-28px_rgba(15,23,42,0.5)]">
            <div className="border-b border-slate-200/80 bg-[linear-gradient(135deg,rgba(248,250,252,0.98),rgba(239,246,255,0.92))] px-5 py-5 sm:px-7 sm:py-6">
              <div className="flex items-start justify-between gap-3">
                <span className="inline-flex max-w-[calc(100%-3.75rem)] rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-brand shadow-sm sm:max-w-full">
                  {t('subscribersModal.countLabel', { count: subscriberCount })}
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200/80 bg-white/90 text-slate-500 shadow-sm transition hover:border-slate-300 hover:text-slate-700"
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
              </div>

              <div className="mt-4 min-w-0">
                <h3
                  id={modalTitleId}
                  className="text-lg font-semibold text-slate-950 sm:text-xl"
                >
                  {title}
                </h3>
                <p
                  id={modalDescriptionId}
                  className="mt-1 text-sm leading-6 text-slate-600"
                >
                  {subtitle}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-white px-5 py-5 sm:px-7 sm:py-6">
              <div className="space-y-5">
                <SubscribersExportPanel
                  selectedFormat={selectedFormat}
                  formatOptions={formatOptions}
                  exportActionLabel={exportActionLabel}
                  exportStatusLabel={exportStatusLabel}
                  exportStatusMessage={exportStatusMessage}
                  exportStatusTone={exportStatusTone}
                  exportErrorMessage={exportErrorMessage}
                  isExportActionDisabled={isExportActionDisabled}
                  onChangeFormat={onChangeFormat}
                  onRunExportAction={onRunExportAction}
                />
                <SubscribersListSection
                  subscribers={subscribers}
                  isSubscribersLoading={isSubscribersLoading}
                  subscribersErrorMessage={subscribersErrorMessage}
                  emptyMessage={emptyMessage}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
