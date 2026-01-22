import type { TFunction } from 'i18next'
import { Link } from 'react-router-dom'

import { courseCreateStyles } from './courseCreateStyles'

type CourseCreateActionsProps = {
  isSubmitting: boolean
  isPending: boolean
  isUploadingImages: boolean
  isValidLyceumId: boolean
  lyceumId: number | null
  t: TFunction
}

export const CourseCreateActions = ({
  isSubmitting,
  isPending,
  isUploadingImages,
  isValidLyceumId,
  lyceumId,
  t,
}: CourseCreateActionsProps) => (
  <div className={courseCreateStyles.actionBarClassName}>
    <button
      type="submit"
      className={courseCreateStyles.primaryActionButtonClassName}
      disabled={isSubmitting}
    >
      {isPending
        ? t('pages.shkoli.create.form.actions.submitting')
        : isUploadingImages
          ? t('pages.shkoli.create.form.actions.uploadingImages')
          : t('pages.shkoli.create.form.actions.submit')}
    </button>
    <Link
      to={isValidLyceumId ? `/lyceums/${lyceumId}` : '/shkoli'}
      className={courseCreateStyles.secondaryActionButtonClassName}
      aria-disabled={isSubmitting}
      tabIndex={isSubmitting ? -1 : 0}
      onClick={(event) => {
        if (isSubmitting) {
          event.preventDefault()
        }
      }}
    >
      {t('pages.shkoli.create.form.actions.cancel')}
    </Link>
  </div>
)
