import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

import SeoHead from '../../components/ui/SeoHead'
import { useCurrentLocale } from '../../hooks/useCurrentLocale'
import LyceumFilterPanel from './components/LyceumFilterPanel'
import LyceumResultsSection from './components/LyceumResultsSection'
import { useLyceumFilterForm } from './hooks/useLyceumFilterForm'
import { useLyceumFilters } from './hooks/useLyceumFilters'
import { useLyceumsFilter } from './hooks/useLyceumsFilter'
import { useLyceumsPageBackground } from './hooks/useLyceumsPageBackground'
import { getLyceumFilterError } from './services/lyceumFilterErrors'

const LyceumsPage = () => {
  const { t } = useTranslation()
  const locale = useCurrentLocale()
  const location = useLocation()
  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  )
  const {
    state,
    query,
    formDefaults,
    applyFilters,
    setPage,
    pageSize,
  } = useLyceumFilters()
  const form = useLyceumFilterForm({ defaultValues: formDefaults })
  const onSubmit = form.handleSubmit(applyFilters)

  useLyceumsPageBackground()

  const { data, isLoading, isFetching, error } = useLyceumsFilter(query)
  const appError = useMemo(
    () => getLyceumFilterError(error ?? null),
    [error],
  )

  return (
    <section className="space-y-10 sm:space-y-12">
      <SeoHead
        title={`${t('pages.lyceums.title')} | ${t('app.title')}`}
        description={t('pages.lyceums.subtitle')}
        canonicalPath="/lyceums"
        locale={locale}
        searchParams={searchParams}
        breadcrumbs={[
          {
            label: t('nav.lyceums'),
            path: '/lyceums',
          },
        ]}
      />

      <div className="mx-auto max-w-6xl px-4 text-center shkoli-fade-up shkoli-hero-glow sm:px-6">
        <h1 className="shkoli-hero-title text-2xl font-semibold text-emerald-950 sm:text-4xl lg:text-5xl">
          {t('pages.lyceums.list.heroTitle')}
        </h1>
        <p className="shkoli-hero-subtitle mx-auto mt-3 max-w-2xl text-sm text-slate-600 sm:mt-4 sm:text-base">
          {t('pages.lyceums.list.heroSubtitle')}
        </p>
      </div>

      <div className="mx-auto mt-6 max-w-6xl px-4 shkoli-fade-up sm:mt-8 sm:px-6">
        <LyceumFilterPanel
          form={form}
          onSubmit={onSubmit}
          isFetching={isFetching}
          t={t}
        />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <LyceumResultsSection
          data={data}
          isLoading={isLoading}
          isFetching={isFetching}
          error={appError}
          page={state.page}
          pageSize={pageSize}
          onNextPage={setPage}
          t={t}
        />
      </div>
    </section>
  )
}

export default LyceumsPage
