import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import type { FeedbackResponse } from '../../../../types/feedback'

type AdminFeedbackCardProps = {
  feedback: FeedbackResponse
  onMarkRead: (id?: number) => void
  onMarkUnread: (id?: number) => void
  onRequestDelete: (feedback: FeedbackResponse) => void
  isUpdating?: boolean
  isDeleting?: boolean
}

const getStatusBadgeStyles = (isRead: boolean) => {
  if (isRead) {
    return 'border-slate-200 bg-slate-100 text-slate-700'
  }
  return 'border-emerald-200 bg-emerald-100 text-emerald-700'
}

const formatFeedbackDate = (value: string, locale: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

export const AdminFeedbackCard = ({
  feedback,
  onMarkRead,
  onMarkUnread,
  onRequestDelete,
  isUpdating = false,
  isDeleting = false,
}: AdminFeedbackCardProps) => {
  const { t, i18n } = useTranslation()
  const actionBaseClassName =
    'inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold transition'
  const actionClassName = `${actionBaseClassName} border-slate-200 bg-white text-slate-600 hover:border-brand/40 hover:text-brand disabled:cursor-not-allowed disabled:opacity-60`
  const deleteClassName = useMemo(
    () =>
      [
        actionBaseClassName,
        'border-rose-200 bg-rose-50 text-rose-700 hover:border-rose-300',
        isDeleting ? 'cursor-wait opacity-70' : '',
      ]
        .filter(Boolean)
        .join(' '),
    [actionBaseClassName, isDeleting],
  )
  const statusLabel = feedback.read
    ? t('pages.admin.feedback.status.read')
    : t('pages.admin.feedback.status.unread')

  return (
    <article className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {feedback.read ? (
            <button
              type="button"
              className={actionClassName}
              onClick={() => onMarkUnread(feedback.id)}
              disabled={isUpdating || isDeleting}
            >
              {isUpdating
                ? t('pages.admin.feedback.actions.marking')
                : t('pages.admin.feedback.actions.markUnread')}
            </button>
          ) : (
            <button
              type="button"
              className={actionClassName}
              onClick={() => onMarkRead(feedback.id)}
              disabled={isUpdating || isDeleting}
            >
              {isUpdating
                ? t('pages.admin.feedback.actions.marking')
                : t('pages.admin.feedback.actions.markRead')}
            </button>
          )}
          <button
            type="button"
            className={deleteClassName}
            onClick={() => onRequestDelete(feedback)}
            disabled={isDeleting || isUpdating}
          >
            {isDeleting
              ? t('pages.admin.feedback.actions.deleting')
              : t('pages.admin.feedback.actions.delete')}
          </button>
        </div>
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getStatusBadgeStyles(
            feedback.read,
          )}`}
        >
          {statusLabel}
        </span>
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {feedback.fullName}
        </p>
        <h3 className="text-base font-semibold text-slate-900">
          {feedback.title}
        </h3>
        <a
          href={`mailto:${feedback.email}`}
          className="inline-flex text-xs font-medium text-brand-dark transition hover:text-brand"
        >
          {feedback.email}
        </a>
      </div>

      <p className="mt-4 line-clamp-6 whitespace-pre-line text-sm leading-6 text-slate-600">
        {feedback.message}
      </p>

      <dl className="mt-4 space-y-3 text-xs text-slate-600">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-slate-500">
            {t('pages.admin.feedback.fields.createdAt')}
          </dt>
          <dd className="text-right font-medium text-slate-900">
            {formatFeedbackDate(feedback.createdAt, i18n.language)}
          </dd>
        </div>
      </dl>
    </article>
  )
}
