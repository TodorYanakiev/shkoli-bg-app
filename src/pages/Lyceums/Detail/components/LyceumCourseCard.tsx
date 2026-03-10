import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import courseMainPlaceholder from '../../../../assets/course-main-placeholder.svg'
import { RatingStars } from '../../../../components/ui/RatingStars'
import { useLocalizedPath } from '../../../../hooks/useLocalizedPath'
import type { CourseResponse } from '../../../../types/courses'
import { resolveCourseImageUrl } from '../../../../utils/courseImages'

type LyceumCourseCardProps = {
  course: CourseResponse
  lecturerName: string
  additionalLecturers: number
  fallbackValue: string
}

const LyceumCourseCard = ({
  course,
  lecturerName,
  additionalLecturers,
  fallbackValue,
}: LyceumCourseCardProps) => {
  const { t } = useTranslation()
  const localizedPath = useLocalizedPath()
  const courseName = course.name ?? fallbackValue
  const mainImage = course.mainImage

  const mainImageUrl =
    resolveCourseImageUrl(mainImage) ?? courseMainPlaceholder
  const averageRating =
    typeof course.averageRating === 'number' &&
    Number.isFinite(course.averageRating)
      ? course.averageRating
      : null
  const courseLink =
    course.id != null ? localizedPath(`/shkoli/${course.id}`) : null
  const cardClassName =
    'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white/90 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-lg'
  const cardContent = (
    <article className={cardClassName}>
      <div className="relative">
        <img
          src={mainImageUrl}
          alt={
            mainImage?.altText ??
            t('pages.lyceums.detail.courseCard.imageAlt', { name: courseName })
          }
          className="h-36 w-full object-cover"
          loading="lazy"
          onError={(event) => {
            const target = event.currentTarget
            target.onerror = null
            target.src = courseMainPlaceholder
          }}
        />
      </div>
      <div className="flex flex-1 flex-col px-4 pb-4 pt-4">
        <h4 className="text-sm font-semibold text-slate-900">{courseName}</h4>
        <p className="mt-2 text-xs text-slate-600">
          <span className="text-slate-500">
            {t('pages.lyceums.detail.courseCard.lecturerLabel')}
          </span>{' '}
          <span className="font-semibold text-slate-700">{lecturerName}</span>
          {additionalLecturers > 0 ? (
            <span className="text-slate-500">
              {' '}
              {t('pages.lyceums.detail.courseCard.additionalLecturers', {
                count: additionalLecturers,
              })}
            </span>
          ) : null}
        </p>
        <div className="mt-3">
          {averageRating != null ? (
            <RatingStars
              rating={averageRating}
              ariaLabel={t('pages.lyceums.detail.courseCard.ratingLabel', {
                rating: averageRating.toFixed(1),
                max: 5,
              })}
            />
          ) : (
            <p className="text-xs font-medium text-slate-500">
              {t('pages.lyceums.detail.courseCard.noRating')}
            </p>
          )}
        </div>
      </div>
    </article>
  )

  if (!courseLink) {
    return cardContent
  }

  return (
    <Link
      to={courseLink}
      aria-label={t('pages.lyceums.detail.courseCard.openCourse', {
        name: courseName,
      })}
      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2"
    >
      {cardContent}
    </Link>
  )
}

export default LyceumCourseCard
