import { useTranslation } from 'react-i18next'

import { StatisticsPanel } from '../../../../components/ui/StatisticsPanel'
import { useLyceumStatistics } from '../hooks/useLyceumStatistics'
import { getSectionError } from '../services/lyceumDetailErrors'

type LyceumStatisticsSectionProps = {
  lyceumId?: number
}

const formatNumber = (value: number | undefined, locale: string) =>
  new Intl.NumberFormat(locale).format(value ?? 0)

export const LyceumStatisticsSection = ({
  lyceumId,
}: LyceumStatisticsSectionProps) => {
  const { t, i18n } = useTranslation()
  const {
    data: statistics,
    isLoading,
    error,
  } = useLyceumStatistics(lyceumId)
  const appError = getSectionError(
    error ?? null,
    'errors.lyceums.statistics.loadFailed',
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
    label: t(`pages.lyceums.detail.statistics.metrics.${metric}.label`),
    description: t(
      `pages.lyceums.detail.statistics.metrics.${metric}.description`,
    ),
    value: formatNumber(statistics?.[metric], i18n.language),
  }))

  return (
    <StatisticsPanel
      id="lyceum-statistics"
      title={t('pages.lyceums.detail.statistics.title')}
      subtitle={t('pages.lyceums.detail.statistics.subtitle')}
      items={items}
      isLoading={isLoading}
      errorMessage={errorMessage}
    />
  )
}
