import type { TFunction } from 'i18next'

import { COURSE_TYPES } from '../constants/courses'
import type { CourseType } from '../types/courses'

const DEFAULT_SORT_LOCALE = 'bg'

export const getSortedCourseTypes = (
  t: TFunction,
  locale: string = DEFAULT_SORT_LOCALE,
): CourseType[] => {
  const collator = new Intl.Collator(locale, {
    usage: 'sort',
    sensitivity: 'base',
  })

  return [...COURSE_TYPES].sort((left, right) =>
    collator.compare(
      t(`courses.types.${left}`),
      t(`courses.types.${right}`),
    ),
  )
}
