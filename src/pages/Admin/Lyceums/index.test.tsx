import { cleanup, render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import AdminLyceumsPage from './index'
import i18n from '../../../locales/i18n'
import type { AppError } from '../../../types/appError'
import type { LyceumResponse } from '../../../types/lyceums'
import type { AdminLyceumsPagination } from './types'
import ToastProvider from '../../../components/feedback/ToastProvider'

const useAdminLyceumsDataMock = vi.hoisted(() => vi.fn())

vi.mock('./hooks/useAdminLyceumsData', () => ({
  useAdminLyceumsData: useAdminLyceumsDataMock,
}))

const buildPagination = (
  overrides: Partial<AdminLyceumsPagination> = {},
): AdminLyceumsPagination => ({
  currentPage: 1,
  totalPages: 1,
  pageSize: 9,
  totalItems: 0,
  pageStart: 0,
  pageEnd: 0,
  canGoPrev: false,
  canGoNext: false,
  hasMultiplePages: false,
  goToPrev: vi.fn(),
  goToNext: vi.fn(),
  ...overrides,
})

const buildFilters = () => ({
  state: {
    name: '',
    town: '',
    includeVerified: true,
    includeUnverified: true,
  },
  townOptions: [],
  hasActiveFilters: false,
  setNameFilter: vi.fn(),
  setTownFilter: vi.fn(),
  setIncludeVerifiedFilter: vi.fn(),
  setIncludeUnverifiedFilter: vi.fn(),
  clearFilters: vi.fn(),
})

const renderPage = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <ToastProvider>
          <MemoryRouter>
            <AdminLyceumsPage />
          </MemoryRouter>
        </ToastProvider>
      </HelmetProvider>
    </QueryClientProvider>,
  )
}

beforeAll(async () => {
  await i18n.changeLanguage('en')
})

beforeEach(() => {
  useAdminLyceumsDataMock.mockReset()
})

afterEach(() => {
  cleanup()
})

describe('AdminLyceumsPage', () => {
  it('renders the header and verified count', async () => {
    const lyceums: LyceumResponse[] = [
      { id: 1, name: 'Lyceum One', verificationStatus: 'VERIFIED' },
      { id: 2, name: 'Lyceum Two', verificationStatus: 'NOT_VERIFIED' },
    ]
    useAdminLyceumsDataMock.mockReturnValue({
      lyceums,
      isLoading: false,
      error: null,
      pagination: buildPagination({ totalItems: lyceums.length, pageEnd: 2 }),
      verifiedCount: 1,
      filters: buildFilters(),
    })

    renderPage()

    expect(await screen.findByText('Lyceums')).toBeDefined()
    expect(screen.getByText('1 verified')).toBeDefined()
    expect(screen.getByRole('button', { name: 'Create lyceum' })).toBeDefined()
  })

  it('renders loading state', async () => {
    useAdminLyceumsDataMock.mockReturnValue({
      lyceums: [],
      isLoading: true,
      error: null,
      pagination: buildPagination(),
      verifiedCount: 0,
      filters: buildFilters(),
    })

    renderPage()

    const loadingLabels = await screen.findAllByText('Loading lyceums...')
    expect(loadingLabels.length).toBeGreaterThan(0)
  })

  it('renders empty state', async () => {
    useAdminLyceumsDataMock.mockReturnValue({
      lyceums: [],
      isLoading: false,
      error: null,
      pagination: buildPagination(),
      verifiedCount: 0,
      filters: buildFilters(),
    })

    renderPage()

    expect(await screen.findByText('No lyceums available yet.')).toBeDefined()
  })

  it('renders filtered empty state when filters are active', async () => {
    useAdminLyceumsDataMock.mockReturnValue({
      lyceums: [],
      isLoading: false,
      error: null,
      pagination: buildPagination(),
      verifiedCount: 0,
      filters: {
        ...buildFilters(),
        hasActiveFilters: true,
      },
    })

    renderPage()

    expect(
      await screen.findByText('No lyceums match the current filters.'),
    ).toBeDefined()
  })

  it('renders error state', async () => {
    const error: AppError = {
      type: 'server',
      status: 500,
      messageKey: 'pages.admin.lyceums.loadFailed',
    }

    useAdminLyceumsDataMock.mockReturnValue({
      lyceums: [],
      isLoading: false,
      error,
      pagination: buildPagination(),
      verifiedCount: 0,
      filters: buildFilters(),
    })

    renderPage()

    expect(
      await screen.findByText("We couldn't load the lyceums right now."),
    ).toBeDefined()
  })
})
