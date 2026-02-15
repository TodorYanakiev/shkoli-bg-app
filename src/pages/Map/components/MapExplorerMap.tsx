import type { TFunction } from 'i18next'

import type { MapExplorerItem } from '../types'
import { useMapExplorerLeaflet } from '../hooks/useMapExplorerLeaflet'
import MapExplorerMapControls from './MapExplorerMapControls'
import MapExplorerPinDetails from './MapExplorerPinDetails'

type MapExplorerMapProps = {
  items: MapExplorerItem[]
  selectedLyceumId: number | null
  hoveredLyceumId: number | null
  onSelectLyceum: (lyceumId: number | null) => void
  onHoverLyceum: (lyceumId: number | null) => void
  t: TFunction
}

const MapExplorerMap = ({
  items,
  selectedLyceumId,
  hoveredLyceumId,
  onSelectLyceum,
  onHoverLyceum,
  t,
}: MapExplorerMapProps) => {
  const {
    mapContainerRef,
    selectedItem,
    detailsStyle,
    isLocating,
    locateErrorKey,
    onZoomIn,
    onZoomOut,
    onLocateMe,
    onResetView,
  } = useMapExplorerLeaflet({
    items,
    selectedLyceumId,
    hoveredLyceumId,
    onSelectLyceum,
    onHoverLyceum,
  })

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div ref={mapContainerRef} className="h-full w-full" />
      <MapExplorerMapControls
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onLocateMe={onLocateMe}
        onResetView={onResetView}
        isLocating={isLocating}
        t={t}
      />
      {locateErrorKey ? (
        <p className="absolute right-3 top-52 z-[460] rounded-xl bg-white/95 px-3 py-2 text-xs text-rose-600 shadow">
          {t(locateErrorKey)}
        </p>
      ) : null}
      {selectedItem && detailsStyle ? (
        <MapExplorerPinDetails
          item={selectedItem}
          style={detailsStyle}
          onClose={() => onSelectLyceum(null)}
          t={t}
        />
      ) : null}
    </div>
  )
}

export default MapExplorerMap