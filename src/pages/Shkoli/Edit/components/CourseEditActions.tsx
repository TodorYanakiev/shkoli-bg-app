import type { TFunction } from 'i18next'
import { Link } from 'react-router-dom'

import { courseEditStyles } from './courseEditStyles'

type CourseEditActionsProps = {
  courseId: number
  isSubmitting: boolean
  t: TFunction
}

export const CourseEditActions = ({
  courseId,
  isSubmitting,
  t,
}: CourseEditActionsProps) => (
  <div className={courseEditStyles.actionBarClassName}>
    <button
      type="submit"
      className={courseEditStyles.primaryActionButtonClassName}
      disabled={isSubmitting}
    >
      {isSubmitting
        ? t('pages.shkoli.edit.form.actions.submitting')
        : t('pages.shkoli.edit.form.actions.submit')}
    </button>
    <Link
      to={`/shkoli/${courseId}`}
      className={courseEditStyles.secondaryActionButtonClassName}
      aria-disabled={isSubmitting}
      tabIndex={isSubmitting ? -1 : 0}
      onClick={(event) => {
        if (isSubmitting) {
          event.preventDefault()
        }
      }}
    >
      {t('pages.shkoli.edit.form.actions.cancel')}
    </Link>
  </div>
)
