import { useTranslation } from 'react-i18next'

import LyceumCard from '../../../components/ui/LyceumCard'
import type { ApiError } from '../../../types/api'
import type { LyceumResponse } from '../../../types/lyceums'

type ProfileLyceumsPanelProps = {
  hasLyceumAdministration: boolean
  administratedLyceumId?: number
  administratedLyceum?: LyceumResponse
  isAdministratedLyceumLoading: boolean
  administratedLyceumError: ApiError | null
  hasLecturedLyceum: boolean
  activeLecturedLyceum?: LyceumResponse
  isLecturedLyceumLoading: boolean
  lecturedLyceumError: ApiError | null
  showLecturedControls: boolean
  currentLecturedIndex: number
  lecturedCount: number
  onLecturedPrevious: () => void
  onLecturedNext: () => void
}

const ProfileLyceumsPanel = ({
  hasLyceumAdministration,
  administratedLyceumId,
  administratedLyceum,
  isAdministratedLyceumLoading,
  administratedLyceumError,
  hasLecturedLyceum,
  activeLecturedLyceum,
  isLecturedLyceumLoading,
  lecturedLyceumError,
  showLecturedControls,
  currentLecturedIndex,
  lecturedCount,
  onLecturedPrevious,
  onLecturedNext,
}: ProfileLyceumsPanelProps) => {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      {hasLyceumAdministration ? (
        <LyceumCard
          lyceum={administratedLyceum}
          isLoading={isAdministratedLyceumLoading}
          error={administratedLyceumError ?? null}
          linkTo={`/lyceums/${administratedLyceumId}`}
          linkLabel={t('components.lyceumCard.manageCta')}
        />
      ) : null}
      {hasLecturedLyceum ? (
        <div className="space-y-3">
          {showLecturedControls ? (
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>
                {t('pages.profile.lecturedLyceums.count', {
                  current: currentLecturedIndex + 1,
                  total: lecturedCount,
                })}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onLecturedPrevious}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-brand/40 hover:text-brand"
                  aria-label={t('pages.profile.lecturedLyceums.previous')}
                >
                  {t('pages.profile.lecturedLyceums.previous')}
                </button>
                <button
                  type="button"
                  onClick={onLecturedNext}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-brand/40 hover:text-brand"
                  aria-label={t('pages.profile.lecturedLyceums.next')}
                >
                  {t('pages.profile.lecturedLyceums.next')}
                </button>
              </div>
            </div>
          ) : null}
          <LyceumCard
            lyceum={activeLecturedLyceum}
            isLoading={isLecturedLyceumLoading}
            error={lecturedLyceumError}
            linkTo={
              activeLecturedLyceum?.id
                ? `/lyceums/${activeLecturedLyceum.id}`
                : undefined
            }
            title={t('components.lyceumCard.lecturerTitle')}
            subtitle={t('components.lyceumCard.lecturerSubtitle')}
          />
        </div>
      ) : null}
    </div>
  )
}

export default ProfileLyceumsPanel
