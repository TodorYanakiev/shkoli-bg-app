import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

import SeoHead from '../../components/ui/SeoHead'
import { useCurrentLocale } from '../../hooks/useCurrentLocale'
import CourseFilterPanel from './components/CourseFilterPanel'
import CourseResultsSection from './components/CourseResultsSection'
import { useCourseFilterForm } from './hooks/useCourseFilterForm'
import { useCourseFilters } from './hooks/useCourseFilters'
import { useCoursesFilter } from './hooks/useCoursesFilter'
import { useShkoliPageBackground } from './hooks/useShkoliPageBackground'
import { getCourseFilterError } from './services/courseFilterErrors'
import { resolveCourseImageUrl } from '../../utils/courseImages'

const ShkoliPage = () => {
  const { t, i18n } = useTranslation()
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
    clearFilters,
    setPage,
    pageSize,
  } = useCourseFilters()

  const form = useCourseFilterForm({ t, defaultValues: formDefaults })
  const onSubmit = form.handleSubmit(applyFilters)
  const hasAdvancedFilters = Boolean(
    state.sort ||
      state.minPrice != null ||
      state.maxPrice != null ||
      (state.dayOfWeek?.length ?? 0) > 0 ||
      state.startTimeFrom ||
      state.startTimeTo,
  )
  const [isExpanded, setIsExpanded] = useState(hasAdvancedFilters)

  useShkoliPageBackground()

  useEffect(() => {
    if (hasAdvancedFilters) {
      setIsExpanded(true)
    }
  }, [hasAdvancedFilters])

  const { data, isLoading, isFetching, error } = useCoursesFilter(query)
  const appError = useMemo(
    () => getCourseFilterError(error ?? null),
    [error],
  )
  const firstCourseImageUrl = useMemo(
    () => resolveCourseImageUrl(data?.content?.[0]?.mainImage),
    [data?.content],
  )

  return (
    <section className="space-y-10 sm:space-y-12">
      <SeoHead
        title={`${t('pages.shkoli.title')} | ${t('app.title')}`}
        description={t('pages.shkoli.subtitle')}
        canonicalPath="/shkoli"
        locale={locale}
        imagePath={firstCourseImageUrl ?? undefined}
        preloadImage={Boolean(firstCourseImageUrl)}
        searchParams={searchParams}
        breadcrumbs={[
          {
            label: t('nav.shkoli'),
            path: '/shkoli',
          },
        ]}
      />

      <div className="mx-auto max-w-6xl px-4 text-center shkoli-fade-up shkoli-hero-glow sm:px-6">
        <h1 className="shkoli-hero-title text-2xl font-semibold text-emerald-950 sm:text-4xl lg:text-5xl">
          {t('pages.shkoli.list.heroTitle')}
        </h1>
        <p className="shkoli-hero-subtitle mx-auto mt-3 max-w-2xl text-sm text-slate-600 sm:mt-4 sm:text-base">
          {t('pages.shkoli.list.heroSubtitle')}
        </p>
      </div>

      <div className="mx-auto mt-6 max-w-6xl px-4 shkoli-fade-up sm:mt-8 sm:px-6">
        <CourseFilterPanel
          form={form}
          onSubmit={onSubmit}
          isExpanded={isExpanded}
          onToggleExpanded={() => setIsExpanded((prev) => !prev)}
          onClear={clearFilters}
          isFetching={isFetching}
          courseTypes={state.courseTypes}
          ageGroups={state.ageGroups}
          dayOfWeek={state.dayOfWeek}
          town={state.town}
          startTimeFrom={state.startTimeFrom}
          startTimeTo={state.startTimeTo}
          minPrice={state.minPrice}
          maxPrice={state.maxPrice}
          locale={i18n.language}
          t={t}
        />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <CourseResultsSection
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

export default ShkoliPage
