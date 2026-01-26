import { useMemo } from 'react'
import type { TFunction } from 'i18next'

import type { LyceumResponse } from '../../../../types/lyceums'
import type { OverviewDetail } from '../types'

type UseLyceumDetailViewOptions = {
  lyceum?: LyceumResponse
  t: TFunction
}

type LyceumDetailView = {
  fallbackValue: string
  heroLocation: string
  pageTitle: string
  overviewDetails: OverviewDetail[]
}

export const useLyceumDetailView = ({
  lyceum,
  t,
}: UseLyceumDetailViewOptions): LyceumDetailView =>
  useMemo(() => {
    const fallbackValue = t('pages.lyceums.detail.notProvided')
    const heroLocation = [lyceum?.address, lyceum?.town]
      .filter(Boolean)
      .join(', ')
    const pageTitle = lyceum?.name
      ? `${lyceum.name} | ${t('app.title')}`
      : `${t('pages.lyceums.detail.title')} | ${t('app.title')}`
    const urlToLibrariesSite = lyceum?.urlToLibrariesSite ?? ''
    const chitalishtaUrl = lyceum?.chitalishtaUrl ?? ''
    const overviewDetails: OverviewDetail[] = [
      {
        label: t('pages.lyceums.detail.fields.phone'),
        value: lyceum?.phone ?? fallbackValue,
      },
      {
        label: t('pages.lyceums.detail.fields.email'),
        value: lyceum?.email ?? fallbackValue,
      },
      {
        label: t('pages.lyceums.detail.fields.urlToLibrariesSite'),
        value: urlToLibrariesSite || fallbackValue,
        href: urlToLibrariesSite || undefined,
      },
      {
        label: t('pages.lyceums.detail.fields.chitalishtaUrl'),
        value: chitalishtaUrl || fallbackValue,
        href: chitalishtaUrl || undefined,
      },
      {
        label: t('pages.lyceums.detail.fields.chairman'),
        value: lyceum?.chairman ?? fallbackValue,
      },
      {
        label: t('pages.lyceums.detail.fields.secretary'),
        value: lyceum?.secretary ?? fallbackValue,
      },
    ]

    return {
      fallbackValue,
      heroLocation,
      pageTitle,
      overviewDetails,
    }
  }, [lyceum, t])
