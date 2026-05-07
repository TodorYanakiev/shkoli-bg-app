import type { TFunction } from 'i18next'

import type { CourseDetailTabKey } from '../types'

type CourseDetailTabsProps = {
  activeTab: CourseDetailTabKey
  onSelectTab: (tab: CourseDetailTabKey) => void
  canViewStatistics: boolean
  t: TFunction
}

type CourseDetailTabItem = {
  key: CourseDetailTabKey
  label: string
}

export const CourseDetailTabs = ({
  activeTab,
  onSelectTab,
  canViewStatistics,
  t,
}: CourseDetailTabsProps) => {
  const tabs: CourseDetailTabItem[] = [
    { key: 'overview', label: t('pages.shkoli.detail.sections.overview') },
    { key: 'schedule', label: t('pages.shkoli.detail.sections.schedule') },
    { key: 'gallery', label: t('pages.shkoli.detail.sections.gallery') },
    {
      key: 'lecturers',
      label: t('pages.shkoli.detail.sections.lecturers'),
    },
    ...(canViewStatistics
      ? [
          {
            key: 'statistics' as const,
            label: t('pages.shkoli.detail.sections.statistics'),
          },
        ]
      : []),
    { key: 'reviews', label: t('pages.shkoli.detail.sideNav.reviews') },
  ]

  return (
    <div className="overflow-x-auto border-y border-slate-200 bg-white px-8 lg:px-9">
      <div
        role="tablist"
        aria-label={t('pages.shkoli.detail.tabs.label')}
        className="flex min-w-max items-center gap-5"
      >
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab
          return (
            <button
              key={tab.key}
              id={`course-tab-${tab.key}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`course-panel-${tab.key}`}
              onClick={() => onSelectTab(tab.key)}
              className={[
                'relative inline-flex items-center border-b-2 pb-3 pt-4 text-xl font-medium transition',
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
