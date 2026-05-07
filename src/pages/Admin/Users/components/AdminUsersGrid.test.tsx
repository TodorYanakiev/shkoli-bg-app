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

import { AdminUsersGrid } from './AdminUsersGrid'
import i18n from '../../../../locales/i18n'
import type { AppError } from '../../../../types/appError'
import type { UserResponse } from '../../../../types/users'
import type { AdminUsersPagination, AdminUserUpdateResult } from '../types'

const onUpdateMock = vi.hoisted(() => vi.fn())
const onDeleteMock = vi.hoisted(() => vi.fn())
const onDeleteProfileImageMock = vi.hoisted(() => vi.fn())
const isUpdatingMock = vi.hoisted(() => vi.fn())
const isDeletingMock = vi.hoisted(() => vi.fn())
const isDeletingProfileImageMock = vi.hoisted(() => vi.fn())
const useAdminUserActionsMock = vi.hoisted(() => vi.fn())

vi.mock('../hooks/useAdminUserActions', () => ({
  useAdminUserActions: useAdminUserActionsMock,
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

const sampleUser: UserResponse = {
  id: 7,
  firstname: 'Ivan',
  lastname: 'Petrov',
  username: 'ivanp',
  email: 'ivan@example.com',
  role: 'USER',
  enabled: true,
  averageRating: 4.2,
}

const buildPagination = (
  overrides: Partial<AdminUsersPagination> = {},
): AdminUsersPagination => ({
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

const renderGrid = (
  overrides: Partial<{
    users: UserResponse[]
    isLoading: boolean
    error: AppError | null
    hasActiveFilters: boolean
    pagination: AdminUsersPagination
  }> = {},
) =>
  render(
    <MemoryRouter>
      <AdminUsersGrid
        users={[sampleUser]}
        isLoading={false}
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
  onUpdateMock.mockReset()
  onDeleteMock.mockReset()
  onDeleteProfileImageMock.mockReset()
  isUpdatingMock.mockReset()
  isDeletingMock.mockReset()
  isDeletingProfileImageMock.mockReset()
  useAdminUserActionsMock.mockReset()

  onUpdateMock.mockResolvedValue({
    ok: true,
    error: null,
  } satisfies AdminUserUpdateResult)
  onDeleteMock.mockResolvedValue(true)
  onDeleteProfileImageMock.mockResolvedValue(true)
  isUpdatingMock.mockReturnValue(false)
  isDeletingMock.mockReturnValue(false)
  isDeletingProfileImageMock.mockReturnValue(false)

  useAdminUserActionsMock.mockReturnValue({
    updatingId: null,
    deletingId: null,
    deletingImageId: null,
    onUpdate: onUpdateMock,
    onDelete: onDeleteMock,
    onDeleteProfileImage: onDeleteProfileImageMock,
    isUpdating: isUpdatingMock,
    isDeleting: isDeletingMock,
    isDeletingProfileImage: isDeletingProfileImageMock,
  })
})

afterEach(() => {
  cleanup()
})

describe('AdminUsersGrid', () => {
  it('renders loading state', async () => {
    renderGrid({
      users: [],
      isLoading: true,
      pagination: buildPagination(),
    })

    expect(await screen.findByText('Loading users...')).toBeDefined()
  })

  it('renders error state', async () => {
    renderGrid({
      users: [],
      error: {
        type: 'server',
        status: 500,
        messageKey: 'pages.admin.users.loadFailed',
      },
      pagination: buildPagination(),
    })

    expect(await screen.findByText("We couldn't load users right now.")).toBeDefined()
  })

  it('renders empty states based on active filters', async () => {
    const { rerender } = renderGrid({
      users: [],
      pagination: buildPagination(),
      hasActiveFilters: false,
    })

    expect(await screen.findByText('No users available yet.')).toBeDefined()

    rerender(
      <MemoryRouter>
        <AdminUsersGrid
          users={[]}
          isLoading={false}
          error={null}
          hasActiveFilters
          pagination={buildPagination()}
        />
      </MemoryRouter>,
    )

    expect(
      await screen.findByText('No users match the current filters.'),
    ).toBeDefined()
  })

  it('opens edit modal and submits updated data', async () => {
    renderGrid()

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }))
    expect(await screen.findByText('Edit user')).toBeDefined()

    fireEvent.change(screen.getByLabelText('First name'), {
      target: { value: '  Ivaylo  ' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }))

    await waitFor(() => {
      expect(onUpdateMock).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 7,
          role: 'USER',
          currentRole: 'USER',
          payload: expect.objectContaining({
            firstname: 'Ivaylo',
            lastname: 'Petrov',
            username: 'ivanp',
            email: 'ivan@example.com',
          }),
        }),
      )
    })

    await waitFor(() => {
      expect(screen.queryByText('Edit user')).toBeNull()
    })
  })

  it('opens delete modal and confirms user deletion', async () => {
    renderGrid()

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(
      await screen.findByRole('heading', { name: 'Delete user' }),
    ).toBeDefined()

    fireEvent.click(screen.getByRole('button', { name: 'Delete user' }))

    await waitFor(() => {
      expect(onDeleteMock).toHaveBeenCalledWith(7)
    })
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull()
    })
  })

  it('opens and closes the reviews modal', async () => {
    renderGrid()

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Open reviews for Ivan Petrov',
      }),
    )
    expect(await screen.findByTestId('admin-reviews-modal')).toBeDefined()
    expect(screen.getByText('Reviews for Ivan Petrov')).toBeDefined()

    fireEvent.click(screen.getByRole('button', { name: 'Close reviews' }))

    await waitFor(() => {
      expect(screen.queryByTestId('admin-reviews-modal')).toBeNull()
    })
  })

  it('calls pagination callbacks', async () => {
    const goToPrev = vi.fn()
    const goToNext = vi.fn()
    const scrollToSpy = vi
      .spyOn(window, 'scrollTo')
      .mockImplementation(() => {})

    renderGrid({
      pagination: buildPagination({
        currentPage: 2,
        totalPages: 3,
        totalItems: 21,
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
    expect(scrollToSpy).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
  })
})
