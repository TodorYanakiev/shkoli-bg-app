import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import type { TFunction } from 'i18next'
import type { LyceumResponse } from '../../../types/lyceums'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { MapExplorerItem } from '../types'
import MapExplorerResultsList from './MapExplorerResultsList'

const t = ((key: string, options?: Record<string, unknown>) => {
  if (key === 'pages.map.results.pagination.prev') {
    return 'Prev'
  }
  if (key === 'pages.map.results.pagination.next') {
    return 'Next'
  }
  if (key === 'pages.map.results.pagination.page') {
    return `Page ${options?.current} of ${options?.total}`
  }
  if (key === 'pages.map.results.pagination.range') {
    return `${options?.from}-${options?.to} / ${options?.total}`
  }
  return key
}) as unknown as TFunction

const createItem = (id: number): MapExplorerItem => ({
  lyceumId: id,
  name: `Lyceum ${id}`,
  town: 'Town',
  address: 'Address',
  averageRating: null,
  latitude: 42 + id * 0.001,
  longitude: 24 + id * 0.001,
  imageUrl: null,
  imageAlt: null,
  distanceKm: null,
  activityCount: 0,
  categories: [],
  activities: [],
  lyceum: {} as unknown as LyceumResponse,
})

const items = Array.from({ length: 12 }, (_, index) => createItem(index + 1))

describe('MapExplorerResultsList', () => {
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('keeps manual pagination even when selected lyceum is on another page', () => {
    const scrollToSpy = vi
      .spyOn(window, 'scrollTo')
      .mockImplementation(() => {})

    render(
      <MapExplorerResultsList
        isLoading={false}
        error={null}
        items={items}
        selectedLyceumId={1}
        hoveredLyceumId={null}
        onHoverLyceum={vi.fn()}
        onSelectLyceum={vi.fn()}
        locale="bg"
        t={t}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Next' }))

    expect(screen.queryByText('Lyceum 1')).toBeNull()
    expect(screen.getByText('Lyceum 9')).toBeTruthy()
    expect(scrollToSpy).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
  })

  it('jumps to the page of selected lyceum when selection changes', async () => {
    const { rerender } = render(
      <MapExplorerResultsList
        isLoading={false}
        error={null}
        items={items}
        selectedLyceumId={null}
        hoveredLyceumId={null}
        onHoverLyceum={vi.fn()}
        onSelectLyceum={vi.fn()}
        locale="bg"
        t={t}
      />,
    )

    rerender(
      <MapExplorerResultsList
        isLoading={false}
        error={null}
        items={items}
        selectedLyceumId={10}
        hoveredLyceumId={null}
        onHoverLyceum={vi.fn()}
        onSelectLyceum={vi.fn()}
        locale="bg"
        t={t}
      />,
    )

    await waitFor(() => {
      expect(screen.getByText('Lyceum 10')).toBeTruthy()
    })
  })
})
