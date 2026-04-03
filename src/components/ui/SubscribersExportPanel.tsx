import { useTranslation } from 'react-i18next'

import type { SubscriberExportFormat } from '../../types/subscribers'

type ExportFormatOption = {
  value: SubscriberExportFormat
  label: string
}

type SubscribersExportPanelProps = {
  selectedFormat: SubscriberExportFormat
  formatOptions: ExportFormatOption[]
  exportActionLabel: string
  exportStatusLabel: string | null
  exportStatusMessage: string | null
  exportStatusTone: 'neutral' | 'success' | 'danger'
  exportErrorMessage: string | null
  isExportActionDisabled: boolean
  onChangeFormat: (format: SubscriberExportFormat) => void
  onRunExportAction: () => void
}

const statusToneClassName = {
  neutral: 'border-slate-200 bg-slate-100 text-slate-700',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  danger: 'border-rose-200 bg-rose-50 text-rose-700',
} as const

export const SubscribersExportPanel = ({
  selectedFormat,
  formatOptions,
  exportActionLabel,
  exportStatusLabel,
  exportStatusMessage,
  exportStatusTone,
  exportErrorMessage,
  isExportActionDisabled,
  onChangeFormat,
  onRunExportAction,
}: SubscribersExportPanelProps) => {
  const { t } = useTranslation()

  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-slate-900">
            {t('subscribersModal.exportTitle')}
          </h4>
          <p className="text-sm text-slate-600">
            {t('subscribersModal.exportSubtitle')}
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <label className="block min-w-[180px]">
            <span className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
              {t('subscribersModal.formatLabel')}
            </span>
            <select
              value={selectedFormat}
              onChange={(event) =>
                onChangeFormat(event.target.value as SubscriberExportFormat)
              }
              className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
            >
              {formatOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={onRunExportAction}
            disabled={isExportActionDisabled}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-brand px-5 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {exportActionLabel}
          </button>
        </div>
      </div>

      {exportStatusLabel ? (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3">
          <span
            className={[
              'inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.08em]',
              statusToneClassName[exportStatusTone],
            ].join(' ')}
          >
            {exportStatusLabel}
          </span>
          {exportStatusMessage ? (
            <p className="mt-2 text-sm text-slate-600">
              {exportStatusMessage}
            </p>
          ) : null}
        </div>
      ) : null}

      {exportErrorMessage ? (
        <div
          className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
          role="alert"
        >
          {exportErrorMessage}
        </div>
      ) : null}
    </section>
  )
}
