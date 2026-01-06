import { useTranslation } from 'react-i18next'

import courseLogoPlaceholder from '../../../../assets/course-logo-placeholder.svg'
import courseMainPlaceholder from '../../../../assets/course-main-placeholder.svg'
import type {
  CourseImageResponse,
  CourseImageRole,
  CourseResponse,
} from '../../../../types/courses'

type LyceumCourseCardProps = {
  course: CourseResponse
  lecturerName: string
  additionalLecturers: number
  fallbackValue: string
}

const getImageByRole = (
  images: CourseImageResponse[] | undefined,
  role: CourseImageRole,
) => images?.find((image) => image.role === role && image.url)

const LyceumCourseCard = ({
  course,
  lecturerName,
  additionalLecturers,
  fallbackValue,
}: LyceumCourseCardProps) => {
  const { t } = useTranslation()
  const courseName = course.name ?? fallbackValue
  const mainImage = getImageByRole(course.images, 'MAIN')
  const logoImage = getImageByRole(course.images, 'LOGO')

  const mainImageUrl = mainImage?.url ?? courseMainPlaceholder
  const logoImageUrl = logoImage?.url ?? courseLogoPlaceholder

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white/90 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative">
        <img
          src={mainImageUrl}
          alt={
            mainImage?.altText ??
            t('pages.lyceums.detail.courseCard.imageAlt', { name: courseName })
          }
          className="h-36 w-full object-cover"
          loading="lazy"
        />
        <div className="absolute -bottom-4 left-4 rounded-2xl border border-white/80 bg-white/90 p-1 shadow-md">
          <img
            src={logoImageUrl}
            alt={
              logoImage?.altText ??
              t('pages.lyceums.detail.courseCard.logoAlt', { name: courseName })
            }
            className="h-12 w-12 rounded-xl object-contain"
            loading="lazy"
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col px-4 pb-4 pt-6">
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
      </div>
    </article>
  )
}

export default LyceumCourseCard
