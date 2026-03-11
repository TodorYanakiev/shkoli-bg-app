import type { ReactNode } from 'react'
import type { TFunction } from 'i18next'

type MapExplorerLayoutProps = {
  panel: ReactNode
  map: ReactNode
  isPanelOpen: boolean
  onTogglePanel: () => void
  onClosePanel: () => void
  t: TFunction
}

const MapExplorerLayout = ({
  panel,
  map,
  isPanelOpen,
  onTogglePanel,
  onClosePanel,
  t,
}: MapExplorerLayoutProps) => (
  <section className="relative z-0 h-[calc(100dvh-var(--topnav-height,76px))] w-full overflow-hidden">
    <div className="flex h-full w-full">
      <div className="hidden h-full lg:block">{panel}</div>
      <div className="h-full min-w-0 flex-1">{map}</div>
    </div>

    <button
      type="button"
      onClick={onTogglePanel}
      className="absolute left-3 top-3 z-[470] rounded-xl bg-white/95 px-3 py-2 text-xs font-semibold text-slate-700 shadow lg:hidden"
    >
      {isPanelOpen
        ? t('pages.map.mobile.closeFilters')
        : t('pages.map.mobile.openFilters')}
    </button>

    <div
      className={`absolute inset-0 z-[465] bg-slate-900/30 transition-opacity lg:hidden ${
        isPanelOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
      onClick={onClosePanel}
      aria-hidden={!isPanelOpen}
    />

    <div
      className={`absolute left-0 top-0 z-[480] h-full w-[min(92vw,420px)] transition-transform duration-200 lg:hidden ${
        isPanelOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {panel}
    </div>
  </section>
)

export default MapExplorerLayout
