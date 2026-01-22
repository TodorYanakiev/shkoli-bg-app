import { useMemo } from 'react'
import type { TFunction } from 'i18next'

import type { LyceumResponse } from '../../../../types/lyceums'
import type { LyceumEditSummaryItem } from '../types'

type UseLyceumEditViewOptions = {
  lyceum?: LyceumResponse
  hasEditAccess: boolean
  t: TFunction
}

type LyceumEditView = {
  fallbackValue: string
  pageTitle: string
  summaryItems: LyceumEditSummaryItem[]
}

export const useLyceumEditView = ({
  lyceum,
  hasEditAccess,
  t,
}: UseLyceumEditViewOptions): LyceumEditView =>
  useMemo(() => {
    const fallbackValue = t('pages.lyceums.detail.notProvided')
    const verificationStatusLabel = lyceum?.verificationStatus
      ? t(
          `pages.lyceums.detail.verificationStatus.${lyceum.verificationStatus}`,
        )
      : fallbackValue
    const summaryItems =
      lyceum && hasEditAccess
        ? [
            {
              label: t('pages.lyceums.edit.form.fields.name'),
              value: lyceum.name ?? fallbackValue,
            },
            {
              label: t('pages.lyceums.edit.form.fields.town'),
              value: lyceum.town ?? fallbackValue,
            },
            {
              label: t('pages.lyceums.detail.fields.verificationStatus'),
              value: verificationStatusLabel,
            },
          ]
        : []
    const pageTitle = `${t('pages.lyceums.edit.title')} | ${t('app.title')}`

    return {
      fallbackValue,
      pageTitle,
      summaryItems,
    }
  }, [lyceum, hasEditAccess, t])
