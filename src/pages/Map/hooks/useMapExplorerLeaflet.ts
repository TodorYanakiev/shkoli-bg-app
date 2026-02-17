import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
} from 'react'
import type { CSSProperties } from 'react'
import L from 'leaflet'
import 'leaflet.markercluster'

import type { MapExplorerItem, MapUserLocation } from '../types'

const BULGARIA_BOUNDS = L.latLngBounds(
  [41.2, 22.2],
  [44.3, 28.8],
)
const DETAILS_CARD_MAX_HEIGHT = 520

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

const createPinIcon = (
  count: number,
  isHovered: boolean,
  isSelected: boolean,
) => {
  const size = isSelected ? 44 : isHovered ? 40 : 36

  return L.divIcon({
    className: 'map-explorer-pin-wrapper',
    html: `<span class="map-explorer-pin ${
      isSelected
        ? 'is-selected'
        : isHovered
          ? 'is-hovered'
          : ''
    }">${count}</span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

const createClusterIcon = (count: number) =>
  L.divIcon({
    className: 'map-explorer-cluster-wrapper',
    html: `<span class="map-explorer-cluster">${count}</span>`,
    iconSize: [52, 52],
    iconAnchor: [26, 26],
  })

const createUserLocationIcon = () =>
  L.divIcon({
    className: 'map-explorer-user-location-wrapper',
    html: `
      <span class="map-explorer-user-location">
        <span class="map-explorer-user-location-dot"></span>
      </span>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  })

type UseMapExplorerLeafletOptions = {
  items: MapExplorerItem[]
  selectedLyceumId: number | null
  hoveredLyceumId: number | null
  onSelectLyceum: (lyceumId: number | null) => void
  onHoverLyceum: (lyceumId: number | null) => void
  initialViewLocation: MapUserLocation | null
  userLocation: MapUserLocation | null
  disableAutoFit: boolean
  requestUserLocation: () => Promise<MapUserLocation | null>
  isPickingLocation: boolean
  onPickLocation: (location: MapUserLocation) => void
}

type UseMapExplorerLeafletResult = {
  mapContainerRef: MutableRefObject<HTMLDivElement | null>
  selectedItem: MapExplorerItem | null
  detailsStyle: CSSProperties | null
  onZoomIn: () => void
  onZoomOut: () => void
  onLocateMe: () => void
  onResetView: () => void
}

export const useMapExplorerLeaflet = ({
  items,
  selectedLyceumId,
  hoveredLyceumId,
  onSelectLyceum,
  onHoverLyceum,
  initialViewLocation,
  userLocation,
  disableAutoFit,
  requestUserLocation,
  isPickingLocation,
  onPickLocation,
}: UseMapExplorerLeafletOptions): UseMapExplorerLeafletResult => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<L.Map | null>(null)
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null)
  const markersRef = useRef(new Map<number, L.Marker>())
  const userLocationMarkerRef = useRef<L.Marker | null>(null)
  const markerCountRef = useRef(new WeakMap<L.Marker, number>())
  const selectedLyceumIdRef = useRef<number | null>(selectedLyceumId)
  const isPickingLocationRef = useRef(isPickingLocation)
  const onPickLocationRef = useRef(onPickLocation)
  const onSelectLyceumRef = useRef(onSelectLyceum)
  const initialViewLocationRef = useRef(initialViewLocation)
  const preserveViewportRef = useRef(false)
  const [detailsStyle, setDetailsStyle] = useState<CSSProperties | null>(null)

  const selectedItem = useMemo(
    () => items.find((item) => item.lyceumId === selectedLyceumId) ?? null,
    [items, selectedLyceumId],
  )

  const updateDetailsStyle = useCallback(() => {
    const map = mapRef.current
    const container = mapContainerRef.current

    if (!map || !container || !selectedLyceumId) {
      setDetailsStyle(null)
      return
    }

    const marker = markersRef.current.get(selectedLyceumId)
    if (!marker) {
      setDetailsStyle(null)
      return
    }

    const point = map.latLngToContainerPoint(marker.getLatLng())
    const maxWidth = Math.min(352, container.clientWidth - 32)
    const maxHeight = Math.min(
      DETAILS_CARD_MAX_HEIGHT,
      container.clientHeight - 32,
    )
    const left = clamp(point.x + 18, 16, container.clientWidth - maxWidth - 16)
    const top = clamp(
      point.y - 24,
      16,
      container.clientHeight - maxHeight - 16,
    )

    setDetailsStyle({ left, top })
  }, [selectedLyceumId])

  useEffect(() => {
    selectedLyceumIdRef.current = selectedLyceumId
  }, [selectedLyceumId])

  useEffect(() => {
    isPickingLocationRef.current = isPickingLocation
  }, [isPickingLocation])

  useEffect(() => {
    onPickLocationRef.current = onPickLocation
  }, [onPickLocation])

  useEffect(() => {
    onSelectLyceumRef.current = onSelectLyceum
  }, [onSelectLyceum])

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return
    }

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      minZoom: 6,
      maxZoom: 18,
    })

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution:
        '&copy; OpenStreetMap contributors &copy; CARTO',
      className: 'map-explorer-tiles',
    }).addTo(map)

    const clusterGroup = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 60,
      iconCreateFunction: (cluster) => {
        const total = cluster
          .getAllChildMarkers()
          .reduce(
            (sum, marker) => sum + (markerCountRef.current.get(marker) ?? 0),
            0,
          )

        return createClusterIcon(total)
      },
    })

    map.addLayer(clusterGroup)
    map.fitBounds(BULGARIA_BOUNDS, { padding: [24, 24] })
    if (initialViewLocationRef.current) {
      preserveViewportRef.current = true
      map.setView(
        [
          initialViewLocationRef.current.latitude,
          initialViewLocationRef.current.longitude,
        ],
        11,
      )
    }
    map.on('click', (event: L.LeafletMouseEvent) => {
      onSelectLyceumRef.current(null)

      if (!isPickingLocationRef.current) {
        return
      }

      preserveViewportRef.current = true
      onPickLocationRef.current({
        latitude: event.latlng.lat,
        longitude: event.latlng.lng,
      })
    })

    mapRef.current = map
    clusterRef.current = clusterGroup

    return () => {
      map.remove()
      mapRef.current = null
      clusterRef.current = null
      userLocationMarkerRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    const cluster = clusterRef.current
    if (!map || !cluster) return

    cluster.clearLayers()
    markersRef.current.clear()
    markerCountRef.current = new WeakMap<L.Marker, number>()

    items.forEach((item) => {
      const marker = L.marker([item.latitude, item.longitude], {
        icon: createPinIcon(item.activityCount, false, false),
      })

      markerCountRef.current.set(marker, item.activityCount)
      markersRef.current.set(item.lyceumId, marker)

      marker.on('mouseover', () => onHoverLyceum(item.lyceumId))
      marker.on('mouseout', () => onHoverLyceum(null))
      marker.on('click', (event) => {
        L.DomEvent.stopPropagation(event)
        onSelectLyceum(item.lyceumId)
      })

      cluster.addLayer(marker)
    })

  }, [items, onHoverLyceum, onSelectLyceum])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    if (!userLocation) {
      const existingMarker = userLocationMarkerRef.current
      if (existingMarker) {
        map.removeLayer(existingMarker)
        userLocationMarkerRef.current = null
      }
      return
    }

    const latLng = L.latLng(userLocation.latitude, userLocation.longitude)

    if (!userLocationMarkerRef.current) {
      userLocationMarkerRef.current = L.marker(latLng, {
        icon: createUserLocationIcon(),
        interactive: false,
        keyboard: false,
        zIndexOffset: 20_000,
      }).addTo(map)
      return
    }

    userLocationMarkerRef.current.setLatLng(latLng)
  }, [userLocation])

  useEffect(() => {
    const map = mapRef.current
    const cluster = clusterRef.current
    if (!map || !cluster) return

    if (disableAutoFit) {
      return
    }

    if (preserveViewportRef.current) {
      return
    }

    if (items.length === 0) {
      map.fitBounds(BULGARIA_BOUNDS, { padding: [24, 24] })
      return
    }

    if (selectedLyceumIdRef.current != null) {
      return
    }

    map.fitBounds(cluster.getBounds(), {
      padding: [36, 36],
      maxZoom: 10,
    })
  }, [disableAutoFit, items])

  useEffect(() => {
    markersRef.current.forEach((marker, lyceumId) => {
      const count = markerCountRef.current.get(marker) ?? 0
      const isSelected = lyceumId === selectedLyceumId
      const isHovered = lyceumId === hoveredLyceumId || isSelected

      marker.setIcon(createPinIcon(count, isHovered, isSelected))
      if (isSelected) {
        marker.setZIndexOffset(10_000)
      } else {
        marker.setZIndexOffset(0)
      }
    })
  }, [hoveredLyceumId, selectedLyceumId])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !selectedLyceumId) return

    const marker = markersRef.current.get(selectedLyceumId)
    if (!marker) return

    map.flyTo(marker.getLatLng(), Math.max(map.getZoom(), 10), {
      duration: 0.5,
    })
  }, [selectedLyceumId])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    updateDetailsStyle()
    map.on('zoom move', updateDetailsStyle)
    window.addEventListener('resize', updateDetailsStyle)

    return () => {
      map.off('zoom move', updateDetailsStyle)
      window.removeEventListener('resize', updateDetailsStyle)
    }
  }, [updateDetailsStyle])

  const onZoomIn = () => mapRef.current?.zoomIn()
  const onZoomOut = () => mapRef.current?.zoomOut()
  const onResetView = () => {
    preserveViewportRef.current = false
    mapRef.current?.fitBounds(BULGARIA_BOUNDS)
  }

  const onLocateMe = () => {
    const map = mapRef.current
    if (!map) {
      return
    }

    void requestUserLocation().then((location) => {
      if (!location) {
        return
      }

      preserveViewportRef.current = true
      map.flyTo([location.latitude, location.longitude], 12, {
        duration: 0.5,
      })
    })
  }

  return {
    mapContainerRef,
    selectedItem,
    detailsStyle,
    onZoomIn,
    onZoomOut,
    onLocateMe,
    onResetView,
  }
}
