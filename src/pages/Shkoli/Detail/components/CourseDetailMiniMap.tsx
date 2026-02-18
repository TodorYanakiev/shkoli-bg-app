import { useEffect, useMemo, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

type CourseDetailMiniMapProps = {
  latitude?: number
  longitude?: number
  className?: string
}

const DEFAULT_CENTER: [number, number] = [42.7339, 25.4858]
const DEFAULT_ZOOM = 7
const DETAIL_ZOOM = 15

const parseCoordinates = (
  latitude?: number,
  longitude?: number,
): [number, number] | null => {
  const hasValidLatitude =
    typeof latitude === 'number' &&
    Number.isFinite(latitude) &&
    latitude >= -90 &&
    latitude <= 90
  const hasValidLongitude =
    typeof longitude === 'number' &&
    Number.isFinite(longitude) &&
    longitude >= -180 &&
    longitude <= 180

  if (!hasValidLatitude || !hasValidLongitude) {
    return null
  }

  return [latitude, longitude]
}

const CourseDetailMiniMap = ({
  latitude,
  longitude,
  className,
}: CourseDetailMiniMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markerLayerRef = useRef<L.LayerGroup | null>(null)
  const coordinates = useMemo<[number, number] | null>(
    () => parseCoordinates(latitude, longitude),
    [latitude, longitude],
  )
  const hasCoordinates = coordinates !== null
  const center = coordinates ?? DEFAULT_CENTER

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return
    }

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      touchZoom: false,
      keyboard: false,
    })

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      className: 'map-explorer-tiles',
    }).addTo(map)

    mapRef.current = map
    const invalidateSizeTimeout = window.setTimeout(() => {
      map.invalidateSize()
    }, 0)

    return () => {
      window.clearTimeout(invalidateSizeTimeout)
      map.remove()
      mapRef.current = null
      markerLayerRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) {
      return
    }

    map.setView(center, hasCoordinates ? DETAIL_ZOOM : DEFAULT_ZOOM)

    if (markerLayerRef.current) {
      markerLayerRef.current.remove()
      markerLayerRef.current = null
    }

    if (!hasCoordinates) {
      return
    }

    const outerPin = L.circleMarker(center, {
      radius: 16,
      color: '#1f7a49',
      fillColor: '#1f7a49',
      fillOpacity: 0.94,
      weight: 1.5,
    })

    const innerPin = L.circleMarker(center, {
      radius: 5,
      color: '#ffffff',
      fillColor: '#ffffff',
      fillOpacity: 1,
      weight: 0,
    })

    markerLayerRef.current = L.layerGroup([outerPin, innerPin]).addTo(map)
  }, [center, hasCoordinates])

  return (
    <div className={className ?? ''}>
      <div ref={mapContainerRef} className="h-full w-full" />
    </div>
  )
}

export default CourseDetailMiniMap
