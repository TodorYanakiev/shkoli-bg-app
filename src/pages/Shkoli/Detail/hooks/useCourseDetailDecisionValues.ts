import { useMemo } from 'react'
import type { TFunction } from 'i18next'

import type { CourseScheduleSlot } from '../../../../types/courses'
import {
  getScheduleDurationValue,
  getScheduleSummaryValue,
  getScheduleTimeRangeValue,
} from '../services/courseDetailFormatters'

type UseCourseDetailDecisionValuesOptions = {
  scheduleSlots: CourseScheduleSlot[]
  fallbackValue: string
  t: TFunction
}

export const useCourseDetailDecisionValues = ({
  scheduleSlots,
  fallbackValue,
  t,
}: UseCourseDetailDecisionValuesOptions) => {
  const scheduleSummary = useMemo(
    () => getScheduleSummaryValue(scheduleSlots, fallbackValue, t),
    [scheduleSlots, fallbackValue, t],
  )
  const scheduleTimeRange = useMemo(
    () => getScheduleTimeRangeValue(scheduleSlots, fallbackValue),
    [scheduleSlots, fallbackValue],
  )
  const scheduleDuration = useMemo(
    () => getScheduleDurationValue(scheduleSlots, fallbackValue, t),
    [scheduleSlots, fallbackValue, t],
  )

  const scheduleFactValue =
    scheduleTimeRange === fallbackValue
      ? scheduleSummary
      : `${scheduleSummary} ${scheduleTimeRange}`

  return {
    scheduleDuration,
    scheduleFactValue,
  }
}
