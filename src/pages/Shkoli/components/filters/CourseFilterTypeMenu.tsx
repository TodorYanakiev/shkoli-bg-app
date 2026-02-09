import { createPortal } from 'react-dom'
import type { RefObject } from 'react'
import type { TFunction } from 'i18next'

import type { CourseType } from '../../../../types/courses'
import type { PanelStyles } from '../../hooks/useDropdownPanelPosition'

type CourseFilterTypeMenuProps = {
  isOpen: boolean
  panelStyles: PanelStyles | null
  panelRef: RefObject<HTMLDivElement>
  filteredCourseTypes: CourseType[]
  selectedTypes: CourseType[]
  onToggleType: (value: CourseType) => void
  t: TFunction
}

const CourseFilterTypeMenu = ({
  isOpen,
  panelStyles,
  panelRef,
  filteredCourseTypes,
  selectedTypes,
  onToggleType,
  t,
}: CourseFilterTypeMenuProps) => {
  if (!isOpen || !panelStyles || typeof document === 'undefined') {
    return null
  }

  return createPortal(
    <div
      ref={panelRef}
      className="fixed z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg"
      style={{
        top: panelStyles.top,
        left: panelStyles.left,
        width: panelStyles.width,
      }}
    >
      <div
        className="max-h-64 overflow-y-auto p-2"
        style={{ maxHeight: panelStyles.maxHeight }}
      >
        {filteredCourseTypes.length === 0 ? (
          <p className="px-3 py-2 text-xs text-slate-500">
            {t('pages.shkoli.list.filters.typeNoResults')}
          </p>
        ) : (
          filteredCourseTypes.map((type) => {
            const isSelected = selectedTypes.includes(type)
            return (
              <label
                key={type}
                className="flex items-center gap-2 rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-emerald-50/80"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleType(type)}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                />
                <span>{t(`courses.types.${type}`)}</span>
              </label>
            )
          })
        )}
      </div>
    </div>,
    document.body,
  )
}

export default CourseFilterTypeMenu
