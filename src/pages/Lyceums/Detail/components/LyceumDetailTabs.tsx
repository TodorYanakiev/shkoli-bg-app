import type { TFunction } from 'i18next'

import type { LyceumDetailTabKey } from '../types'

type LyceumDetailTabsProps = {
  activeTab: LyceumDetailTabKey
  onSelectTab: (tab: LyceumDetailTabKey) => void
  t: TFunction
}

type LyceumDetailTabItem = {
  key: LyceumDetailTabKey
  label: string
}

export const LyceumDetailTabs = ({
  activeTab,
  onSelectTab,
  t,
}: LyceumDetailTabsProps) => {
  const tabs: LyceumDetailTabItem[] = [
    { key: 'overview', label: t('pages.lyceums.detail.sections.overview') },
    { key: 'courses', label: t('pages.lyceums.detail.sections.courses') },
    { key: 'gallery', label: t('pages.lyceums.detail.sections.gallery') },
    { key: 'lecturers', label: t('pages.lyceums.detail.sections.lecturers') },
    { key: 'reviews', label: t('pages.lyceums.detail.sideNav.reviews') },
  ]

  return (
    <div className="overflow-x-auto border-y border-slate-200 bg-white px-4 sm:px-6 lg:px-9">
      <div
        role="tablist"
        aria-label={t('pages.lyceums.detail.tabs.label')}
        className="flex min-w-max items-center gap-3 sm:gap-4 lg:gap-5"
      >
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab
          return (
            <button
              key={tab.key}
              id={`lyceum-tab-${tab.key}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`lyceum-panel-${tab.key}`}
              onClick={() => onSelectTab(tab.key)}
              className={[
                'relative inline-flex items-center border-b-2 pb-2.5 pt-3 text-base font-medium transition sm:pb-3 sm:pt-4 sm:text-lg lg:text-xl',
                isActive
                  ? 'border-brand text-slate-900'
                  : 'border-transparent text-slate-600 hover:text-slate-900',
              ].join(' ')}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
