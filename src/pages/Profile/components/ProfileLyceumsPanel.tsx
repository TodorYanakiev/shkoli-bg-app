import { useTranslation } from 'react-i18next'

import type { ApiError } from '../../../types/api'
import type { LyceumResponse } from '../../../types/lyceums'
import LyceumCard from '../../Lyceums/components/LyceumCard'
import ProfileHorizontalCarousel from './ProfileHorizontalCarousel'

type ProfileLyceumsPanelProps = {
  title: string
  lyceums: LyceumResponse[]
  isLoading: boolean
  error: ApiError | null
  emptyMessage: string
}

const ProfileLyceumsPanel = ({
  title,
  lyceums,
  isLoading,
  error,
  emptyMessage,
}: ProfileLyceumsPanelProps) => {
  const { t } = useTranslation()

  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between gap-3">
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        {!isLoading && !error && lyceums.length > 0 ? (
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            ({lyceums.length})
          </span>
        ) : null}
      </div>

      <div className="mt-5 space-y-4">
        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
            {t('pages.profile.lyceumCards.loading')}
          </div>
        ) : error ? (
          <div
            className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 shadow-sm"
            role="alert"
          >
            {t('pages.profile.lyceumCards.error')}
          </div>
        ) : lyceums.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
            {emptyMessage}
          </div>
        ) : (
          <ProfileHorizontalCarousel
            items={lyceums}
            previousLabel={t('pages.profile.lecturedLyceums.previous')}
            nextLabel={t('pages.profile.lecturedLyceums.next')}
            getItemKey={(lyceum, index) =>
              lyceum.id ?? `${lyceum.name ?? 'lyceum'}-${index}`
            }
            renderItem={(lyceum) => (
              <LyceumCard lyceum={lyceum} hideShadow />
            )}
          />
        )}
      </div>
    </section>
  )
}

export default ProfileLyceumsPanel
