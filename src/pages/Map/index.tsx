import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'

import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import SeoHead from '../../components/ui/SeoHead'
import { useCurrentLocale } from '../../hooks/useCurrentLocale'
import MapExplorerLayout from './components/MapExplorerLayout'
import MapExplorerMap from './components/MapExplorerMap'
import MapExplorerPanel from './components/MapExplorerPanel'
import { useMapExplorerData } from './hooks/useMapExplorerData'
import { useMapExplorerFilters } from './hooks/useMapExplorerFilters'
import { useMapPageBackground } from './hooks/useMapPageBackground'
import { useMapExplorerUserLocation } from './hooks/useMapExplorerUserLocation'
import type { MapUserLocation } from './types'
import { useCourseFilterForm } from '../Shkoli/hooks/useCourseFilterForm'

const sameCoordinate = (left: number, right: number) =>
  Math.abs(left - right) < 0.00001

const isSameLocation = (
  left: MapUserLocation | null,
  right: MapUserLocation | null,
) => {
  if (!left || !right) return false
  return (
    sameCoordinate(left.latitude, right.latitude) &&
    sameCoordinate(left.longitude, right.longitude)
  )
}

const MapPage = () => {
  const { t, i18n } = useTranslation()
  const locale = useCurrentLocale()
  const {
    state,
    search,
    courseFormDefaults,
    lyceumQuery,
    courseQuery,
    applyFilters,
    clearFilters,
    setLocationContext,
  } = useMapExplorerFilters()

  const form = useCourseFilterForm({
    t,
    defaultValues: courseFormDefaults,
  })
  const [searchValue, setSearchValue] = useState(search)
  const [selectedLyceumId, setSelectedLyceumId] = useState<number | null>(null)
  const [hoveredLyceumId, setHoveredLyceumId] = useState<number | null>(null)
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false)
  const {
    userLocation,
    userLocationSource,
    isGeolocationDenied,
    isLocating,
    locateErrorKey,
    requestUserLocation,
    isPickingLocation,
    setManualLocation,
    startManualLocationPick,
    cancelManualLocationPick,
    clearLocateError,
  } = useMapExplorerUserLocation()

  useMapPageBackground()

  const isClosestSortEnabled = state.lyceumSort === 'closest'
  const persistedReferenceLocation = useMemo<MapUserLocation | null>(() => {
    if (
      state.referenceLatitude == null ||
      state.referenceLongitude == null
    ) {
      return null
    }

    return {
      latitude: state.referenceLatitude,
      longitude: state.referenceLongitude,
    }
  }, [state.referenceLatitude, state.referenceLongitude])
  const availableUserReferenceLocation = userLocation ?? persistedReferenceLocation

  const mapMarkerLocation = useMemo(() => {
    if (!isClosestSortEnabled) {
      return null
    }

    return availableUserReferenceLocation
  }, [isClosestSortEnabled, availableUserReferenceLocation])

  const effectiveReferenceLocation = useMemo(() => {
    if (!isClosestSortEnabled) {
      return null
    }

    return availableUserReferenceLocation
  }, [
    isClosestSortEnabled,
    availableUserReferenceLocation,
  ])

  const initialViewLocation = useMemo(() => {
    if (!isClosestSortEnabled) {
      return null
    }

    return effectiveReferenceLocation ?? persistedReferenceLocation
  }, [
    isClosestSortEnabled,
    effectiveReferenceLocation,
    persistedReferenceLocation,
  ])

  const lyceumQueryWithLocation = useMemo(
    () => ({
      ...lyceumQuery,
      latitude: effectiveReferenceLocation?.latitude,
      longitude: effectiveReferenceLocation?.longitude,
    }),
    [
      lyceumQuery,
      effectiveReferenceLocation?.latitude,
      effectiveReferenceLocation?.longitude,
    ],
  )

  const { items, summary, isLoading, isFetching, error } = useMapExplorerData({
    state,
    lyceumQuery: lyceumQueryWithLocation,
    courseQuery,
    locale: i18n.language,
  })

  useEffect(() => {
    if (!selectedLyceumId) return

    const exists = items.some((item) => item.lyceumId === selectedLyceumId)
    if (!exists) {
      setSelectedLyceumId(null)
    }
  }, [items, selectedLyceumId])

  useEffect(() => {
    if (!hoveredLyceumId) return

    const exists = items.some((item) => item.lyceumId === hoveredLyceumId)
    if (!exists) {
      setHoveredLyceumId(null)
    }
  }, [items, hoveredLyceumId])

  useEffect(() => {
    setSearchValue(search)
  }, [search])

  useEffect(() => {
    if (!persistedReferenceLocation) {
      return
    }

    if (state.locationSource == null) {
      return
    }

    const persistedUserLocationSource =
      state.locationSource === 'gps' ? 'gps' : 'manual'

    if (
      userLocation &&
      userLocationSource === persistedUserLocationSource &&
      isSameLocation(userLocation, persistedReferenceLocation)
    ) {
      return
    }

    setManualLocation(persistedReferenceLocation, persistedUserLocationSource)
  }, [
    state.locationSource,
    persistedReferenceLocation,
    userLocation,
    userLocationSource,
    setManualLocation,
  ])

  useEffect(() => {
    if (!isClosestSortEnabled || !userLocation || isPickingLocation) {
      return
    }

    const source = userLocationSource ?? 'manual'

    if (state.locationSource === 'gps' && source !== 'gps') {
      return
    }

    if (state.locationSource === 'manual' && source !== 'manual') {
      return
    }

    const hasSameReferenceLocation =
      state.referenceLatitude != null &&
      state.referenceLongitude != null &&
      isSameLocation(userLocation, {
        latitude: state.referenceLatitude,
        longitude: state.referenceLongitude,
      })

    if (state.locationSource === source && hasSameReferenceLocation) {
      return
    }

    setLocationContext(userLocation, source)
  }, [
    isClosestSortEnabled,
    state.locationSource,
    state.referenceLatitude,
    state.referenceLongitude,
    userLocation,
    userLocationSource,
    isPickingLocation,
    setLocationContext,
  ])

  const onSubmit = form.handleSubmit((values) => {
    applyFilters(values, searchValue)
    setIsMobilePanelOpen(false)
  })

  const applyCurrentFilters = () => {
    void onSubmit()
  }

  const handleClearFilters = () => {
    clearFilters()
    cancelManualLocationPick()
    clearLocateError()
    setSearchValue('')
    setSelectedLyceumId(null)
    setHoveredLyceumId(null)
  }

  const handleUseCurrentLocation = () => {
    if (userLocation && userLocationSource === 'gps') {
      setLocationContext(userLocation, 'gps', 'closest')
      return
    }

    setLocationContext(null, 'gps', 'closest')
    void requestUserLocation({ enableManualPickOnError: true })
  }

  const handlePickLocationOnMap = () => {
    if (availableUserReferenceLocation) {
      const preservedSource =
        state.locationSource === 'manual' || userLocationSource === 'manual'
          ? 'manual'
          : 'gps'

      setLocationContext(
        availableUserReferenceLocation,
        preservedSource,
        'closest',
      )
    } else {
      setLocationContext(null, 'manual', 'closest')
    }
    startManualLocationPick()
  }

  const handlePickLocation = (location: MapUserLocation) => {
    setManualLocation(location, 'manual')
    setLocationContext(location, 'manual', 'closest')
  }

  const panel = (
    <MapExplorerPanel
      form={form}
      onSubmit={onSubmit}
      onClearFilters={handleClearFilters}
      isFetching={isFetching}
      isLoading={isLoading}
      error={error}
      items={items}
      summary={summary}
      selectedLyceumId={selectedLyceumId}
      hoveredLyceumId={hoveredLyceumId}
      onHoverLyceum={setHoveredLyceumId}
      onSelectLyceum={setSelectedLyceumId}
      locale={i18n.language}
      searchValue={searchValue}
      onSearchValueChange={setSearchValue}
      onApplySearch={applyCurrentFilters}
      filtersState={state}
      showUseCurrentLocation={!isGeolocationDenied}
      isLocating={isLocating}
      onUseCurrentLocation={handleUseCurrentLocation}
      onPickLocationOnMap={handlePickLocationOnMap}
      t={t}
    />
  )

  const map = (
    <MapExplorerMap
      items={items}
      selectedLyceumId={selectedLyceumId}
      hoveredLyceumId={hoveredLyceumId}
      onSelectLyceum={setSelectedLyceumId}
      onHoverLyceum={setHoveredLyceumId}
      initialViewLocation={initialViewLocation}
      userLocation={mapMarkerLocation}
      disableAutoFit={isClosestSortEnabled}
      isLocating={isLocating}
      locateErrorKey={locateErrorKey}
      onRequestUserLocation={requestUserLocation}
      isPickingLocation={isPickingLocation}
      onPickLocation={handlePickLocation}
      onCancelLocationPick={cancelManualLocationPick}
      locale={i18n.language}
      t={t}
    />
  )

  return (
    <>
      <SeoHead
        title={`${t('pages.map.title')} | ${t('app.title')}`}
        description={t('pages.map.subtitle')}
        canonicalPath="/map"
        locale={locale}
        forceNoindex
      />

      <MapExplorerLayout
        panel={panel}
        map={map}
        isPanelOpen={isMobilePanelOpen}
        onTogglePanel={() =>
          setIsMobilePanelOpen((previousState) => !previousState)
        }
        onClosePanel={() => setIsMobilePanelOpen(false)}
        t={t}
      />
    </>
  )
}

export default MapPage
