import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'

import ProfileActionsCard from './components/ProfileActionsCard'
import ProfileDetailsCard from './components/ProfileDetailsCard'
import ProfileHeader from './components/ProfileHeader'
import ProfileLecturedCoursesPanel from './components/ProfileLecturedCoursesPanel'
import ProfileLyceumsPanel from './components/ProfileLyceumsPanel'
import ProfileSummaryCard from './components/ProfileSummaryCard'
import { useAdministratedLyceum } from './hooks/useAdministratedLyceum'
import { useProfileLecturedCourses } from './hooks/useProfileLecturedCourses'
import { useProfileLecturedLyceums } from './hooks/useProfileLecturedLyceums'
import { useProfileUserSummary } from './hooks/useProfileUserSummary'
import { useUserProfile } from './hooks/useUserProfile'
import { getProfileErrorKey } from './services/profileErrors'

const ProfilePage = () => {
  const { t } = useTranslation()
  const { data: user, isLoading, error } = useUserProfile()
  const errorKey = getProfileErrorKey(error ?? null)
  const errorMessage = errorKey ? t(errorKey) : null
  const summary = useProfileUserSummary(user, t)
  const {
    data: administratedLyceum,
    isLoading: isAdministratedLyceumLoading,
    error: administratedLyceumError,
  } = useAdministratedLyceum(summary.administratedLyceumId, {
    enabled: Boolean(summary.administratedLyceumId),
  })
  const lecturedLyceumState = useProfileLecturedLyceums({
    lecturedLyceumIds: summary.lecturedLyceumIds,
    enabled: summary.hasLecturedLyceum,
  })
  const lecturedCoursesState = useProfileLecturedCourses({
    lecturerId: summary.lecturerId,
    enabled: summary.hasLecturedCourses,
  })

  const administratedLyceumName = summary.administratedLyceumId
    ? isAdministratedLyceumLoading
      ? t('pages.profile.details.administratedLyceumLoading')
      : administratedLyceumError
        ? t('pages.profile.details.administratedLyceumUnavailable')
        : administratedLyceum?.name ??
          t('pages.profile.details.administratedLyceumUnknown')
    : t('pages.profile.emptyValue')
  const fallbackValue = t('pages.profile.emptyValue')
  const hasRightCourses = summary.hasLecturedCourses
  const hasRightLyceums =
    summary.hasLyceumAdministration || summary.hasLecturedLyceum
  const hasRightContent = hasRightCourses || hasRightLyceums
  const rightColumnClassName = [
    'lg:ml-auto',
    hasRightCourses && hasRightLyceums
      ? 'grid gap-4 lg:grid-cols-2 lg:items-start'
      : 'space-y-4',
  ].join(' ')

  return (
    <section className="space-y-6">
      <Helmet>
        <title>{`${t('pages.profile.title')} | ${t('app.title')}`}</title>
      </Helmet>
      <ProfileHeader />
      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          {t('pages.profile.loading')}
        </div>
      ) : errorMessage ? (
        <div
          className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 shadow-sm"
          role="alert"
        >
          {errorMessage}
        </div>
      ) : user ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_auto] lg:items-start">
          <div className="space-y-6">
            <ProfileSummaryCard
              displayName={summary.displayName}
              roleLabel={summary.roleLabel}
            />
            <ProfileDetailsCard
              fullName={summary.fullName}
              username={summary.username}
              email={summary.email}
              administratedLyceumName={administratedLyceumName}
              showAdministratedLyceum={Boolean(summary.administratedLyceumId)}
            />
            <ProfileActionsCard
              hasLyceumAdministration={summary.hasLyceumAdministration}
            />
          </div>
          {hasRightContent ? (
            <div className={rightColumnClassName}>
              {hasRightCourses ? (
                <ProfileLecturedCoursesPanel
                  displayName={summary.displayName}
                  fallbackValue={fallbackValue}
                  activeCourse={lecturedCoursesState.activeLecturedCourse}
                  isLoading={lecturedCoursesState.isLecturedCoursesLoading}
                  error={lecturedCoursesState.lecturedCoursesError ?? null}
                  count={lecturedCoursesState.lecturedCoursesCount}
                  showControls={lecturedCoursesState.showCourseControls}
                  currentIndex={lecturedCoursesState.lecturedCourseIndex}
                  onPrevious={lecturedCoursesState.handleLecturedCoursePrevious}
                  onNext={lecturedCoursesState.handleLecturedCourseNext}
                />
              ) : null}
              {hasRightLyceums ? (
                <ProfileLyceumsPanel
                  hasLyceumAdministration={summary.hasLyceumAdministration}
                  administratedLyceumId={summary.administratedLyceumId}
                  administratedLyceum={administratedLyceum}
                  isAdministratedLyceumLoading={isAdministratedLyceumLoading}
                  administratedLyceumError={administratedLyceumError ?? null}
                  hasLecturedLyceum={summary.hasLecturedLyceum}
                  activeLecturedLyceum={lecturedLyceumState.activeLecturedLyceum}
                  isLecturedLyceumLoading={
                    lecturedLyceumState.isLecturedLyceumLoading
                  }
                  lecturedLyceumError={lecturedLyceumState.lecturedLyceumError}
                  showLecturedControls={lecturedLyceumState.showLecturedControls}
                  currentLecturedIndex={lecturedLyceumState.lecturedLyceumIndex}
                  lecturedCount={lecturedLyceumState.lecturedLyceumCount}
                  onLecturedPrevious={lecturedLyceumState.handleLecturedPrevious}
                  onLecturedNext={lecturedLyceumState.handleLecturedNext}
                />
              ) : null}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          {t('pages.profile.empty')}
        </div>
      )}
    </section>
  )
}

export default ProfilePage
