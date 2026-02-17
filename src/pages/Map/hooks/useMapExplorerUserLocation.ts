import { useCallback, useRef, useState } from 'react'

import type { MapLocationSource, MapUserLocation } from '../types'

const GEOLOCATION_TIMEOUT_MS = 8000

type RequestLocationOptions = {
  silent?: boolean
  enableManualPickOnError?: boolean
}

type UseMapExplorerUserLocationResult = {
  userLocation: MapUserLocation | null
  userLocationSource: Exclude<MapLocationSource, 'mapCenter'> | null
  isGeolocationDenied: boolean
  isLocating: boolean
  locateErrorKey: string | null
  isPickingLocation: boolean
  requestUserLocation: (
    options?: RequestLocationOptions,
  ) => Promise<MapUserLocation | null>
  setManualLocation: (
    location: MapUserLocation,
    source?: Exclude<MapLocationSource, 'mapCenter'>,
  ) => void
  startManualLocationPick: () => void
  cancelManualLocationPick: () => void
  clearLocateError: () => void
}

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value)

const GEOLOCATION_PERMISSION_DENIED_CODE = 1

export const useMapExplorerUserLocation =
  (): UseMapExplorerUserLocationResult => {
    const [userLocation, setUserLocation] = useState<MapUserLocation | null>(null)
    const [userLocationSource, setUserLocationSource] = useState<
      Exclude<MapLocationSource, 'mapCenter'> | null
    >(null)
    const [isGeolocationDenied, setIsGeolocationDenied] = useState(false)
    const [isLocating, setIsLocating] = useState(false)
    const [locateErrorKey, setLocateErrorKey] = useState<string | null>(null)
    const [isPickingLocation, setIsPickingLocation] = useState(false)
    const pendingRequestRef = useRef<Promise<MapUserLocation | null> | null>(
      null,
    )

    const requestUserLocation = useCallback(
      (options?: RequestLocationOptions) => {
        if (pendingRequestRef.current) {
          return pendingRequestRef.current
        }

        if (
          typeof navigator === 'undefined' ||
          !navigator.geolocation
        ) {
          if (!options?.silent) {
            if (options?.enableManualPickOnError) {
              setLocateErrorKey('pages.map.locationPicker.pickFallback')
              setIsPickingLocation(true)
            } else {
              setLocateErrorKey('pages.map.controls.locateUnsupported')
            }
          }
          return Promise.resolve(null)
        }

        setLocateErrorKey(null)
        setIsPickingLocation(false)
        setIsLocating(true)

        const request = new Promise<MapUserLocation | null>((resolve) => {
          navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
              const location =
                isFiniteNumber(coords.latitude) &&
                isFiniteNumber(coords.longitude)
                  ? {
                      latitude: coords.latitude,
                      longitude: coords.longitude,
                    }
                  : null

              setUserLocation(location)
              if (location) {
                setUserLocationSource('gps')
                setIsGeolocationDenied(false)
              }
              setIsPickingLocation(false)
              setIsLocating(false)

              if (location == null && !options?.silent) {
                if (options?.enableManualPickOnError) {
                  setLocateErrorKey('pages.map.locationPicker.pickFallback')
                  setIsPickingLocation(true)
                } else {
                  setLocateErrorKey('pages.map.controls.locateError')
                }
              }

              resolve(location)
            },
            (error) => {
              setIsLocating(false)
              if (error.code === GEOLOCATION_PERMISSION_DENIED_CODE) {
                setIsGeolocationDenied(true)
              }
              if (!options?.silent) {
                if (options?.enableManualPickOnError) {
                  setLocateErrorKey('pages.map.locationPicker.pickFallback')
                  setIsPickingLocation(true)
                } else {
                  setLocateErrorKey('pages.map.controls.locateError')
                }
              }
              resolve(null)
            },
            {
              enableHighAccuracy: true,
              timeout: GEOLOCATION_TIMEOUT_MS,
              maximumAge: 60_000,
            },
          )
        }).finally(() => {
          pendingRequestRef.current = null
        })

        pendingRequestRef.current = request
        return request
      },
      [],
    )

    const setManualLocation = useCallback(
      (
        location: MapUserLocation,
        source: Exclude<MapLocationSource, 'mapCenter'> = 'manual',
      ) => {
        setUserLocation(location)
        setUserLocationSource(source)
        setLocateErrorKey(null)
        setIsPickingLocation(false)
      },
      [],
    )

    const startManualLocationPick = useCallback(() => {
      setLocateErrorKey('pages.map.locationPicker.active')
      setIsPickingLocation(true)
    }, [])

    const cancelManualLocationPick = useCallback(() => {
      setIsPickingLocation(false)
      setLocateErrorKey(null)
    }, [])

    const clearLocateError = useCallback(() => {
      setLocateErrorKey(null)
    }, [])

    return {
      userLocation,
      userLocationSource,
      isGeolocationDenied,
      isLocating,
      locateErrorKey,
      isPickingLocation,
      requestUserLocation,
      setManualLocation,
      startManualLocationPick,
      cancelManualLocationPick,
      clearLocateError,
    }
  }
