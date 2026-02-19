import type { TFunction } from 'i18next'

import type { UserResponse } from '../../../../types/users'
import { getUserDisplayName } from '../../../../utils/user'
import LyceumLecturerCard from './LyceumLecturerCard'

type LyceumDetailLecturersSectionProps = {
  lecturers?: UserResponse[]
  isLecturersLoading: boolean
  lecturersErrorMessage: string | null
  fallbackValue: string
  onOpenLecturerReviews?: (lecturer: UserResponse) => void
  t: TFunction
}

export const LyceumDetailLecturersSection = ({
  lecturers,
  isLecturersLoading,
  lecturersErrorMessage,
  fallbackValue,
  onOpenLecturerReviews,
  t,
}: LyceumDetailLecturersSectionProps) => (
  <section id="lyceum-lecturers" className="scroll-mt-24">
    <h3 className="text-3xl font-semibold text-slate-900">
      {t('pages.lyceums.detail.sections.lecturers')}
    </h3>
    {isLecturersLoading ? (
      <div className="mt-4 animate-pulse rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-base text-slate-600">
        {t('pages.lyceums.detail.lecturersLoading')}
      </div>
    ) : lecturersErrorMessage ? (
      <div
        className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-base text-rose-700"
        role="alert"
      >
        {lecturersErrorMessage}
      </div>
    ) : lecturers && lecturers.length > 0 ? (
      <ul className="mt-5 grid gap-4 xl:grid-cols-2">
        {lecturers.map((lecturer, index) => {
          const displayName = getUserDisplayName(lecturer) || fallbackValue

          return (
            <li key={lecturer.id ?? `${displayName}-${index}`}>
              <LyceumLecturerCard
                lecturer={lecturer}
                displayName={displayName}
                fallbackValue={fallbackValue}
                onOpenReviews={
                  onOpenLecturerReviews
                    ? () => onOpenLecturerReviews(lecturer)
                    : undefined
                }
              />
            </li>
          )
        })}
      </ul>
    ) : (
      <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-base text-slate-600">
        {t('pages.lyceums.detail.lecturersPlaceholder')}
      </div>
    )}
  </section>
)
