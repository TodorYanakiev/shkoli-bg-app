import type { TFunction } from 'i18next'

import type { MapExplorerItem, MapUserLocation } from '../types'
import { useMapExplorerLeaflet } from '../hooks/useMapExplorerLeaflet'
import MapExplorerMapControls from './MapExplorerMapControls'
import MapExplorerPinDetails from './MapExplorerPinDetails'

type MapExplorerMapProps = {
  items: MapExplorerItem[]
  selectedLyceumId: number | null
  hoveredLyceumId: number | null
  onSelectLyceum: (lyceumId: number | null) => void
  onHoverLyceum: (lyceumId: number | null) => void
  initialViewLocation: MapUserLocation | null
  userLocation: MapUserLocation | null
  disableAutoFit: boolean
  isLocating: boolean
  locateErrorKey: string | null
  onRequestUserLocation: () => Promise<MapUserLocation | null>
  isPickingLocation: boolean
  onPickLocation: (location: MapUserLocation) => void
  onCancelLocationPick: () => void
  locale: string
  t: TFunction
}

const MapExplorerMap = ({
  items,
  selectedLyceumId,
  hoveredLyceumId,
  onSelectLyceum,
  onHoverLyceum,
  initialViewLocation,
  userLocation,
  disableAutoFit,
  isLocating,
  locateErrorKey,
  onRequestUserLocation,
  isPickingLocation,
  onPickLocation,
  onCancelLocationPick,
  locale,
  t,
}: MapExplorerMapProps) => {
  const {
    mapContainerRef,
    selectedItem,
    detailsStyle,
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
    initialViewLocation,
    userLocation,
    disableAutoFit,
    requestUserLocation: onRequestUserLocation,
    isPickingLocation,
    onPickLocation,
  })

  const isPickerMessage =
    locateErrorKey === 'pages.map.locationPicker.pickFallback' ||
    locateErrorKey === 'pages.map.locationPicker.active'
  const pickerBannerMessageKey =
    locateErrorKey === 'pages.map.locationPicker.pickFallback'
      ? locateErrorKey
      : 'pages.map.locationPicker.active'

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
      {locateErrorKey && !isPickerMessage ? (
        <p
          className={`absolute right-3 top-52 z-[460] rounded-xl bg-white/95 px-3 py-2 text-xs shadow ${
            isPickerMessage ? 'text-emerald-700' : 'text-rose-600'
          }`}
        >
          {t(locateErrorKey)}
        </p>
      ) : null}
      {isPickingLocation ? (
        <div className="absolute left-1/2 top-3 z-[470] -translate-x-1/2 rounded-2xl border border-emerald-200 bg-white/95 px-3 py-2 shadow-md">
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold text-emerald-800">
              {t(pickerBannerMessageKey)}
            </p>
            <button
              type="button"
              onClick={onCancelLocationPick}
              className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
            >
              {t('pages.map.locationPicker.cancel')}
            </button>
          </div>
        </div>
      ) : null}
      {selectedItem && detailsStyle ? (
        <MapExplorerPinDetails
          item={selectedItem}
          style={detailsStyle}
          locale={locale}
          onClose={() => onSelectLyceum(null)}
          t={t}
        />
      ) : null}
    </div>
  )
}

export default MapExplorerMap
