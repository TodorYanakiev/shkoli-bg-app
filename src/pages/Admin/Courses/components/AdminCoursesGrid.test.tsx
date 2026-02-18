import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import { AdminCoursesGrid } from './AdminCoursesGrid'
import i18n from '../../../../locales/i18n'
import type { AppError } from '../../../../types/appError'
import type { CourseResponse } from '../../../../types/courses'
import type { AdminCoursesPagination } from '../types'

const onDeleteMock = vi.hoisted(() => vi.fn())
const isDeletingMock = vi.hoisted(() => vi.fn())
const useAdminCourseActionsMock = vi.hoisted(() => vi.fn())

vi.mock('../hooks/useAdminCourseActions', () => ({
  useAdminCourseActions: useAdminCourseActionsMock,
}))

vi.mock('../../../Shkoli/hooks/useCourseCardLocation', () => ({
  useCourseCardLocation: () => ({
    resolvedAddress: 'Sofia',
    isLoading: false,
    hasError: false,
  }),
}))

vi.mock('../../components/AdminReviewsModal', () => ({
  AdminReviewsModal: ({
    isOpen,
    reviewTarget,
    onClose,
  }: {
    isOpen: boolean
    reviewTarget: { name?: string } | null
    onClose: () => void
  }) =>
    isOpen ? (
      <div data-testid="admin-reviews-modal">
        <span>{`Reviews for ${reviewTarget?.name ?? 'N/A'}`}</span>
        <button type="button" onClick={onClose}>
          Close reviews
        </button>
      </div>
    ) : null,
}))

const sampleCourse: CourseResponse = {
  id: 5,
  name: 'Painting for Kids',
  type: 'PAINTING',
  executionType: 'GROUP',
  ageGroupList: ['CHILD'],
  price: 30,
}

const buildPagination = (
  overrides: Partial<AdminCoursesPagination> = {},
): AdminCoursesPagination => ({
  currentPage: 1,
  totalPages: 1,
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

const renderGrid = (
  overrides: Partial<{
    courses: CourseResponse[]
    isLoading: boolean
    isFetching: boolean
    error: AppError | null
    hasActiveFilters: boolean
    pagination: AdminCoursesPagination
  }> = {},
) =>
  render(
    <MemoryRouter>
      <AdminCoursesGrid
        courses={[sampleCourse]}
        isLoading={false}
        isFetching={false}
        error={null}
        hasActiveFilters={false}
        pagination={buildPagination({
          totalItems: 1,
          pageStart: 1,
          pageEnd: 1,
        })}
        {...overrides}
      />
    </MemoryRouter>,
  )

beforeAll(async () => {
  await i18n.changeLanguage('en')
})

beforeEach(() => {
  onDeleteMock.mockReset()
  isDeletingMock.mockReset()
  useAdminCourseActionsMock.mockReset()

  onDeleteMock.mockResolvedValue(true)
  isDeletingMock.mockReturnValue(false)

  useAdminCourseActionsMock.mockReturnValue({
    deletingId: null,
    deleteError: null,
    onDelete: onDeleteMock,
    isDeleting: isDeletingMock,
  })
})

afterEach(() => {
  cleanup()
})

describe('AdminCoursesGrid', () => {
  it('renders loading state', async () => {
    renderGrid({
      courses: [],
      isLoading: true,
      pagination: buildPagination(),
    })

    expect(await screen.findByText('Loading courses...')).toBeDefined()
  })

  it('renders error state', async () => {
    renderGrid({
      courses: [],
      error: {
        type: 'server',
        status: 500,
        messageKey: 'pages.admin.courses.loadFailed',
      },
      pagination: buildPagination(),
    })

    expect(
      await screen.findByText("We couldn't load the courses right now."),
    ).toBeDefined()
  })

  it('renders empty states based on active filters', async () => {
    const { rerender } = renderGrid({
      courses: [],
      pagination: buildPagination(),
      hasActiveFilters: false,
    })

    expect(await screen.findByText('No courses available yet.')).toBeDefined()

    rerender(
      <MemoryRouter>
        <AdminCoursesGrid
          courses={[]}
          isLoading={false}
          isFetching={false}
          error={null}
          hasActiveFilters
          pagination={buildPagination()}
        />
      </MemoryRouter>,
    )

    expect(
      await screen.findByText('No courses match the current filters.'),
    ).toBeDefined()
  })

  it('opens delete modal and confirms course deletion', async () => {
    renderGrid()

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))

    expect(
      await screen.findByRole('heading', { name: 'Delete course' }),
    ).toBeDefined()
    fireEvent.click(screen.getByRole('button', { name: 'Delete course' }))

    await waitFor(() => {
      expect(onDeleteMock).toHaveBeenCalledWith(5)
    })
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull()
    })
  })

  it('opens and closes the reviews modal', async () => {
    renderGrid()

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Open reviews for Painting for Kids',
      }),
    )
    expect(await screen.findByTestId('admin-reviews-modal')).toBeDefined()
    expect(screen.getByText('Reviews for Painting for Kids')).toBeDefined()

    fireEvent.click(screen.getByRole('button', { name: 'Close reviews' }))

    await waitFor(() => {
      expect(screen.queryByTestId('admin-reviews-modal')).toBeNull()
    })
  })

  it('calls pagination callbacks', async () => {
    const goToPrev = vi.fn()
    const goToNext = vi.fn()

    renderGrid({
      pagination: buildPagination({
        currentPage: 2,
        totalPages: 3,
        totalItems: 22,
        pageStart: 10,
        pageEnd: 18,
        hasMultiplePages: true,
        canGoPrev: true,
        canGoNext: true,
        goToPrev,
        goToNext,
      }),
    })

    fireEvent.click(await screen.findByRole('button', { name: 'Previous page' }))
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }))

    expect(goToPrev).toHaveBeenCalledTimes(1)
    expect(goToNext).toHaveBeenCalledTimes(1)
  })
})
