import type { TFunction } from 'i18next'
import { Link } from 'react-router-dom'

import {
  actionBarClassName,
  actionIconClassName,
  primaryActionButtonClassName,
  secondaryActionButtonClassName,
} from './lyceumEditFormStyles'

type LyceumEditFormActionsProps = {
  lyceumId: number
  isSubmitting: boolean
  t: TFunction
}

export const LyceumEditFormActions = ({
  lyceumId,
  isSubmitting,
  t,
}: LyceumEditFormActionsProps) => (
  <div className={actionBarClassName}>
    <button
      type="submit"
      disabled={isSubmitting}
      className={primaryActionButtonClassName}
    >
      <svg
        viewBox="0 0 24 24"
        className={actionIconClassName}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20 6.5l-9.5 9.5L4 9.5" />
      </svg>
      {isSubmitting
        ? t('pages.lyceums.edit.form.submitting')
        : t('pages.lyceums.edit.form.submit')}
    </button>
    <Link
      to={`/lyceums/${lyceumId}`}
      className={secondaryActionButtonClassName}
    >
      <svg
        viewBox="0 0 24 24"
        className={actionIconClassName}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M6.5 6.5l11 11" />
        <path d="M17.5 6.5l-11 11" />
      </svg>
      {t('pages.lyceums.edit.form.cancel')}
    </Link>
  </div>
)
