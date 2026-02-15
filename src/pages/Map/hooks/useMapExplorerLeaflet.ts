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

import type { MapExplorerItem } from '../types'

const BULGARIA_BOUNDS = L.latLngBounds(
  [41.2, 22.2],
  [44.3, 28.8],
)

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

type UseMapExplorerLeafletOptions = {
  items: MapExplorerItem[]
  selectedLyceumId: number | null
  hoveredLyceumId: number | null
  onSelectLyceum: (lyceumId: number | null) => void
  onHoverLyceum: (lyceumId: number | null) => void
}

type UseMapExplorerLeafletResult = {
  mapContainerRef: MutableRefObject<HTMLDivElement | null>
  selectedItem: MapExplorerItem | null
  detailsStyle: CSSProperties | null
  isLocating: boolean
  locateErrorKey: string | null
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
}: UseMapExplorerLeafletOptions): UseMapExplorerLeafletResult => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<L.Map | null>(null)
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null)
  const markersRef = useRef(new Map<number, L.Marker>())
  const markerCountRef = useRef(new WeakMap<L.Marker, number>())
  const [isLocating, setIsLocating] = useState(false)
  const [locateErrorKey, setLocateErrorKey] = useState<string | null>(null)
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
    const left = clamp(point.x + 18, 16, container.clientWidth - maxWidth - 16)
    const top = clamp(point.y - 24, 16, container.clientHeight - 260)

    setDetailsStyle({ left, top })
  }, [selectedLyceumId])

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
    map.on('click', () => onSelectLyceum(null))

    mapRef.current = map
    clusterRef.current = clusterGroup

    return () => {
      map.remove()
      mapRef.current = null
      clusterRef.current = null
    }
  }, [onSelectLyceum])

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
      marker.on('click', () => onSelectLyceum(item.lyceumId))

      cluster.addLayer(marker)
    })

    if (items.length === 0) {
      map.fitBounds(BULGARIA_BOUNDS, { padding: [24, 24] })
      return
    }

    if (!selectedLyceumId) {
      map.fitBounds(cluster.getBounds(), {
        padding: [36, 36],
        maxZoom: 10,
      })
    }
  }, [items, selectedLyceumId, onHoverLyceum, onSelectLyceum])

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
  const onResetView = () => mapRef.current?.fitBounds(BULGARIA_BOUNDS)

  const onLocateMe = () => {
    const map = mapRef.current
    if (!map || !navigator.geolocation) {
      setLocateErrorKey('pages.map.controls.locateUnsupported')
      return
    }

    setLocateErrorKey(null)
    setIsLocating(true)

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setIsLocating(false)
        map.flyTo([coords.latitude, coords.longitude], 12, {
          duration: 0.5,
        })
      },
      () => {
        setIsLocating(false)
        setLocateErrorKey('pages.map.controls.locateError')
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
      },
    )
  }

  return {
    mapContainerRef,
    selectedItem,
    detailsStyle,
    isLocating,
    locateErrorKey,
    onZoomIn,
    onZoomOut,
    onLocateMe,
    onResetView,
  }
}
