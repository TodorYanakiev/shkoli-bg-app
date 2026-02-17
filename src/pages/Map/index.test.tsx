import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import type { ReactNode } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { CourseFilterFormValues } from '../Shkoli/validations/courseFilterSchema'
import MapPage from './index'
import type { MapFilterState, MapUserLocation } from './types'

const DEFAULT_FILTER_VALUES: CourseFilterFormValues = {
  courseTypes: [],
  ageGroups: [],
  dayOfWeek: [],
  town: '',
  startTimeFrom: '',
  startTimeTo: '',
  minPrice: '',
  maxPrice: '',
  sort: '',
}

const DEFAULT_FILTER_STATE: MapFilterState = {
  search: '',
  town: '',
  lyceumSort: 'default',
}

const mocks = vi.hoisted(() => ({
  useMapExplorerFilters: vi.fn(),
  useMapExplorerData: vi.fn(),
  useMapExplorerUserLocation: vi.fn(),
  useCourseFilterForm: vi.fn(),
  useMapPageBackground: vi.fn(),
  setLocationContext: vi.fn(),
  applyFilters: vi.fn(),
  clearFilters: vi.fn(),
  requestUserLocation: vi.fn(),
  setManualLocation: vi.fn(),
  startManualLocationPick: vi.fn(),
  cancelManualLocationPick: vi.fn(),
  clearLocateError: vi.fn(),
}))

type MockPanelProps = {
  showUseCurrentLocation: boolean
  onUseCurrentLocation: () => void
  onPickLocationOnMap: () => void
}

type MockLayoutProps = {
  panel: ReactNode
  map: ReactNode
}

type MockMapProps = {
  onPickLocation: (location: MapUserLocation) => void
}

vi.mock('react-helmet-async', () => ({
  Helmet: ({ children }: { children?: ReactNode }) => <>{children}</>,
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'bg' },
  }),
}))

vi.mock('./hooks/useMapExplorerFilters', () => ({
  useMapExplorerFilters: mocks.useMapExplorerFilters,
}))

vi.mock('./hooks/useMapExplorerData', () => ({
  useMapExplorerData: mocks.useMapExplorerData,
}))

vi.mock('./hooks/useMapExplorerUserLocation', () => ({
  useMapExplorerUserLocation: mocks.useMapExplorerUserLocation,
}))

vi.mock('../Shkoli/hooks/useCourseFilterForm', () => ({
  useCourseFilterForm: mocks.useCourseFilterForm,
}))

vi.mock('./hooks/useMapPageBackground', () => ({
  useMapPageBackground: mocks.useMapPageBackground,
}))

vi.mock('./components/MapExplorerPanel', () => ({
  default: ({
    showUseCurrentLocation,
    onUseCurrentLocation,
    onPickLocationOnMap,
  }: MockPanelProps) => (
    <div>
      <span data-testid="show-use-current-location">
        {String(showUseCurrentLocation)}
      </span>
      <button type="button" onClick={onUseCurrentLocation}>
        use-current-location
      </button>
      <button type="button" onClick={onPickLocationOnMap}>
        pick-location-on-map
      </button>
    </div>
  ),
}))

vi.mock('./components/MapExplorerMap', () => ({
  default: ({ onPickLocation }: MockMapProps) => (
    <div data-testid="map-mock">
      <button
        type="button"
        onClick={() =>
          onPickLocation({ latitude: 43.123, longitude: 24.987 })
        }
      >
        map-pick-confirm
      </button>
    </div>
  ),
}))

vi.mock('./components/MapExplorerLayout', () => ({
  default: ({ panel, map }: MockLayoutProps) => (
    <div>
      {panel}
      {map}
    </div>
  ),
}))

type HookOptions = {
  state?: MapFilterState
  userLocation?: MapUserLocation | null
  userLocationSource?: 'gps' | 'manual' | null
  isGeolocationDenied?: boolean
  isPickingLocation?: boolean
}

const setupHookMocks = ({
  state = DEFAULT_FILTER_STATE,
  userLocation = null,
  userLocationSource = null,
  isGeolocationDenied = false,
  isPickingLocation = false,
}: HookOptions = {}) => {
  mocks.useMapExplorerFilters.mockReturnValue({
    state,
    search: state.search,
    courseFormDefaults: DEFAULT_FILTER_VALUES,
    lyceumQuery: {},
    courseQuery: {},
    applyFilters: mocks.applyFilters,
    clearFilters: mocks.clearFilters,
    setLocationContext: mocks.setLocationContext,
  })

  mocks.useMapExplorerData.mockReturnValue({
    items: [],
    summary: { lyceumsCount: 0, totalActivities: 0 },
    isLoading: false,
    isFetching: false,
    error: null,
  })

  mocks.useMapExplorerUserLocation.mockReturnValue({
    userLocation,
    userLocationSource,
    isGeolocationDenied,
    isLocating: false,
    locateErrorKey: null,
    requestUserLocation: mocks.requestUserLocation,
    isPickingLocation,
    setManualLocation: mocks.setManualLocation,
    startManualLocationPick: mocks.startManualLocationPick,
    cancelManualLocationPick: mocks.cancelManualLocationPick,
    clearLocateError: mocks.clearLocateError,
  })

  mocks.useCourseFilterForm.mockReturnValue({
    handleSubmit:
      (handler: (values: CourseFilterFormValues) => void) => () =>
        handler(DEFAULT_FILTER_VALUES),
  } as unknown as UseFormReturn<CourseFilterFormValues>)
}

describe('MapPage', () => {
  afterEach(() => {
    cleanup()
  })

  beforeEach(() => {
    vi.clearAllMocks()
    setupHookMocks()
  })

  it('passes hidden current-location action when geolocation is denied', () => {
    setupHookMocks({ isGeolocationDenied: true })

    render(<MapPage />)

    expect(screen.getByTestId('show-use-current-location').textContent).toBe(
      'false',
    )
  })

  it('requests gps when use-current-location is clicked while active source is manual', () => {
    setupHookMocks({
      userLocation: { latitude: 42.7, longitude: 23.3 },
      userLocationSource: 'manual',
    })

    render(<MapPage />)
    fireEvent.click(screen.getByRole('button', { name: 'use-current-location' }))

    expect(mocks.setLocationContext).toHaveBeenCalledWith(null, 'gps', 'closest')
    expect(mocks.requestUserLocation).toHaveBeenCalledWith({
      enableManualPickOnError: true,
    })
  })

  it('does not sync manual location back when gps source is requested', async () => {
    setupHookMocks({
      state: {
        ...DEFAULT_FILTER_STATE,
        lyceumSort: 'closest',
        locationSource: 'gps',
        referenceLatitude: 42.7,
        referenceLongitude: 23.3,
      },
      userLocation: { latitude: 41.6, longitude: 24.7 },
      userLocationSource: 'manual',
    })

    render(<MapPage />)

    await waitFor(() => {
      expect(mocks.setLocationContext).not.toHaveBeenCalled()
    })
  })

  it('syncs location when source and coordinates are out of sync', async () => {
    setupHookMocks({
      state: {
        ...DEFAULT_FILTER_STATE,
        lyceumSort: 'closest',
        locationSource: 'manual',
        referenceLatitude: 42.1,
        referenceLongitude: 25.1,
      },
      userLocation: { latitude: 43.2, longitude: 24.3 },
      userLocationSource: 'manual',
    })

    render(<MapPage />)

    await waitFor(() => {
      expect(mocks.setLocationContext).toHaveBeenCalledWith(
        { latitude: 43.2, longitude: 24.3 },
        'manual',
      )
    })
  })

  it('applies manual location after pick-on-map flow', () => {
    setupHookMocks({
      state: {
        ...DEFAULT_FILTER_STATE,
        lyceumSort: 'closest',
        locationSource: 'gps',
        referenceLatitude: 42.7,
        referenceLongitude: 23.3,
      },
      userLocation: { latitude: 42.7, longitude: 23.3 },
      userLocationSource: 'gps',
    })

    render(<MapPage />)

    fireEvent.click(screen.getByRole('button', { name: 'pick-location-on-map' }))

    expect(mocks.startManualLocationPick).toHaveBeenCalledTimes(1)
    expect(mocks.setLocationContext).toHaveBeenCalledWith(
      { latitude: 42.7, longitude: 23.3 },
      'gps',
      'closest',
    )

    fireEvent.click(screen.getByRole('button', { name: 'map-pick-confirm' }))

    expect(mocks.setManualLocation).toHaveBeenCalledWith(
      { latitude: 43.123, longitude: 24.987 },
      'manual',
    )
    expect(mocks.setLocationContext).toHaveBeenLastCalledWith(
      { latitude: 43.123, longitude: 24.987 },
      'manual',
      'closest',
    )
  })
})
