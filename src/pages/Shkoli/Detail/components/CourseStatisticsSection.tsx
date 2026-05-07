import { useTranslation } from 'react-i18next'

import { StatisticsPanel } from '../../../../components/ui/StatisticsPanel'
import { useCourseStatistics } from '../hooks/useCourseStatistics'
import { getSectionError } from '../services/courseDetailErrors'

type CourseStatisticsSectionProps = {
  courseId?: number
}

const formatNumber = (value: number | undefined, locale: string) =>
  new Intl.NumberFormat(locale).format(value ?? 0)

export const CourseStatisticsSection = ({
  courseId,
}: CourseStatisticsSectionProps) => {
  const { t, i18n } = useTranslation()
  const {
    data: statistics,
    isLoading,
    error,
  } = useCourseStatistics(courseId)
  const appError = getSectionError(
    error ?? null,
    'errors.courses.statistics.loadFailed',
  )
  const errorMessage = appError ? t(appError.messageKey) : null
  const metrics = [
    'seenInResults',
    'visits',
    'shares',
    'subscriptions',
  ] as const
  const items = metrics.map((metric) => ({
    key: metric,
    label: t(`pages.shkoli.detail.statistics.metrics.${metric}.label`),
    description: t(
      `pages.shkoli.detail.statistics.metrics.${metric}.description`,
    ),
    value: formatNumber(statistics?.[metric], i18n.language),
  }))

  return (
    <StatisticsPanel
      id="course-statistics"
      title={t('pages.shkoli.detail.statistics.title')}
      subtitle={t('pages.shkoli.detail.statistics.subtitle')}
      items={items}
      isLoading={isLoading}
      errorMessage={errorMessage}
    />
  )
}
