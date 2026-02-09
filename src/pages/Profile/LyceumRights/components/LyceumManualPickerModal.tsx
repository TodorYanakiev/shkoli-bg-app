import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type {
  ManualLyceumOption,
  ManualLyceumTownGroup,
} from '../services/lyceumManualPicker'
import LyceumManualPickerTownGroup from './LyceumManualPickerTownGroup'

type LyceumManualPickerModalProps = {
  isOpen: boolean
  isLoading: boolean
  isError: boolean
  isSubmitting: boolean
  lyceumTownGroups: ManualLyceumTownGroup[]
  onClose: () => void
  onRetry: () => void
  onSelect: (option: ManualLyceumOption) => void
}

const LyceumManualPickerModal = ({
  isOpen,
  isLoading,
  isError,
  isSubmitting,
  lyceumTownGroups,
  onClose,
  onRetry,
  onSelect,
}: LyceumManualPickerModalProps) => {
  const { t } = useTranslation()
  const [expandedTowns, setExpandedTowns] = useState<Set<string>>(new Set())

  const handleClose = useCallback(() => {
    if (isSubmitting) return
    onClose()
  }, [isSubmitting, onClose])

  useEffect(() => {
    if (!isOpen) return
    setExpandedTowns(new Set(lyceumTownGroups.map((group) => group.town)))
  }, [isOpen, lyceumTownGroups])

  useEffect(() => {
    if (!isOpen) return undefined
    if (typeof document === 'undefined') return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleClose, isOpen])

  if (!isOpen) return null

  const titleId = 'lyceum-manual-picker-title'
  const descriptionId = 'lyceum-manual-picker-description'
  const hasLyceums = lyceumTownGroups.length > 0
  const getTownPanelId = (town: string, index: number) =>
    `lyceum-manual-picker-town-${index}-${town
      .toLowerCase()
      .replace(/\s+/g, '-')}`

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-4 py-8 backdrop-blur-sm"
      onClick={handleClose}
      role="presentation"
    >
      <div
        className="w-full max-w-3xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative rounded-2xl border border-slate-200/70 bg-white/95 p-5 shadow-sm">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label={t('feedback.dismiss')}
            title={t('feedback.dismiss')}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12" />
              <path d="M18 6l-12 12" />
            </svg>
          </button>
          <div className="space-y-1">
            <h3 id={titleId} className="text-sm font-semibold text-slate-900">
              {t('pages.profile.lyceumRights.request.manualPicker.title')}
            </h3>
            <p id={descriptionId} className="text-sm text-slate-600">
              {t('pages.profile.lyceumRights.request.manualPicker.description')}
            </p>
          </div>
          <div className="mt-4 max-h-[60vh] overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/80 p-3">
            {isLoading ? (
              <p className="py-8 text-center text-sm text-slate-500">
                {t('pages.profile.lyceumRights.request.manualPicker.loading')}
              </p>
            ) : isError ? (
              <div className="space-y-3 py-8 text-center">
                <p className="text-sm text-rose-600">
                  {t('pages.profile.lyceumRights.request.manualPicker.error')}
                </p>
                <button
                  type="button"
                  onClick={onRetry}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
                >
                  {t('pages.profile.lyceumRights.request.manualPicker.retry')}
                </button>
              </div>
            ) : !hasLyceums ? (
              <p className="py-8 text-center text-sm text-slate-500">
                {t('pages.profile.lyceumRights.request.manualPicker.empty')}
              </p>
            ) : (
              <div className="space-y-4">
                {lyceumTownGroups.map((group, index) => {
                  const isExpanded = expandedTowns.has(group.town)
                  const panelId = getTownPanelId(group.town, index)
                  return (
                    <LyceumManualPickerTownGroup
                      key={group.town}
                      group={group}
                      panelId={panelId}
                      isExpanded={isExpanded}
                      isSubmitting={isSubmitting}
                      onToggle={() => {
                        setExpandedTowns((prev) => {
                          const next = new Set(prev)
                          if (next.has(group.town)) {
                            next.delete(group.town)
                          } else {
                            next.add(group.town)
                          }
                          return next
                        })
                      }}
                      onSelect={onSelect}
                    />
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LyceumManualPickerModal
