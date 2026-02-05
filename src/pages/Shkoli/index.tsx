import { Helmet } from 'react-helmet-async'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import CourseFilterPanel from './components/CourseFilterPanel'
import CourseResultsSection from './components/CourseResultsSection'
import { useCourseFilterForm } from './hooks/useCourseFilterForm'
import { useCourseFilters } from './hooks/useCourseFilters'
import { useCoursesFilter } from './hooks/useCoursesFilter'
import { useShkoliPageBackground } from './hooks/useShkoliPageBackground'
import { getCourseFilterError } from './services/courseFilterErrors'

const ShkoliPage = () => {
  const { t, i18n } = useTranslation()
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
  const [isExpanded, setIsExpanded] = useState(
    Boolean(
      state.sort ||
        state.minPrice != null ||
        state.maxPrice != null ||
        state.town ||
        (state.dayOfWeek?.length ?? 0) > 0 ||
        state.startTimeFrom ||
        state.startTimeTo,
    ),
  )

  useShkoliPageBackground()

  useEffect(() => {
    if (
      state.sort ||
      state.minPrice != null ||
      state.maxPrice != null ||
      state.town ||
      (state.dayOfWeek?.length ?? 0) > 0 ||
      state.startTimeFrom ||
      state.startTimeTo
    ) {
      setIsExpanded(true)
    }
  }, [
    state.sort,
    state.minPrice,
    state.maxPrice,
    state.town,
    state.dayOfWeek?.length,
    state.startTimeFrom,
    state.startTimeTo,
  ])

  const { data, isLoading, isFetching, error } = useCoursesFilter(query)
  const appError = useMemo(
    () => getCourseFilterError(error ?? null),
    [error],
  )

  return (
    <section className="space-y-12">
      <Helmet>
        <title>{`${t('pages.shkoli.title')} | ${t('app.title')}`}</title>
      </Helmet>

      <div className="mx-auto max-w-6xl text-center shkoli-fade-up shkoli-hero-glow">
        <h1 className="shkoli-hero-title text-3xl font-semibold text-emerald-950 sm:text-4xl lg:text-5xl">
          {t('pages.shkoli.list.heroTitle')}
        </h1>
        <p className="shkoli-hero-subtitle mx-auto mt-4 max-w-2xl text-sm text-emerald-900/80 sm:text-base">
          {t('pages.shkoli.list.heroSubtitle')}
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-6xl shkoli-fade-up">
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

      <div className="mx-auto max-w-6xl">
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
