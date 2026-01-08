import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import LyceumEditPage from './index'
import i18n from '../../../locales/i18n'
import type { ApiError } from '../../../types/api'
import type { LyceumRequest, LyceumResponse } from '../../../types/lyceums'
import type { CurrentUser } from '../../../types/users'

const navigateMock = vi.hoisted(() => vi.fn())
const showToastMock = vi.hoisted(() => vi.fn())
const useLyceumMock = vi.hoisted(() => vi.fn())
const useUpdateLyceumMutationMock = vi.hoisted(() => vi.fn())
const useUserProfileMock = vi.hoisted(() => vi.fn())

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom',
  )
  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

vi.mock('../../../components/feedback/ToastContext', () => ({
  useToast: () => ({ showToast: showToastMock }),
}))

vi.mock('../hooks/useLyceum', () => ({
  useLyceum: useLyceumMock,
  lyceumDetailQueryKey: (id?: number) => ['lyceums', 'detail', id] as const,
}))

vi.mock('../hooks/useUpdateLyceumMutation', () => ({
  useUpdateLyceumMutation: useUpdateLyceumMutationMock,
}))

vi.mock('../../Profile/hooks/useUserProfile', () => ({
  useUserProfile: useUserProfileMock,
}))

vi.mock('./components/LyceumLecturerManager', () => ({
  default: () => <div>Lecturers panel</div>,
}))

type UpdateLyceumOptions = {
  onSuccess?: (data: LyceumResponse) => void
  onError?: (error: ApiError) => void
}

type UpdateLyceumMutationResult = {
  mutate: (
    values: { id: number; payload: LyceumRequest },
    options?: UpdateLyceumOptions,
  ) => void
  isPending: boolean
  error: ApiError | null
}

let updateMutationState: UpdateLyceumMutationResult

const renderPage = (path = '/lyceums/1/edit') => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route path="/lyceums/:id/edit" element={<LyceumEditPage />} />
          </Routes>
        </MemoryRouter>
      </HelmetProvider>
    </QueryClientProvider>,
  )
}

beforeAll(async () => {
  await i18n.changeLanguage('en')
})

afterEach(() => {
  cleanup()
})

beforeEach(() => {
  navigateMock.mockReset()
  showToastMock.mockReset()
  useLyceumMock.mockReset()
  useUpdateLyceumMutationMock.mockReset()
  useUserProfileMock.mockReset()

  const lyceum: LyceumResponse = { id: 1, name: 'Community Center', town: 'Sofia' }
  const user: CurrentUser = { id: 8, role: 'ADMIN' }

  useLyceumMock.mockReturnValue({
    data: lyceum,
    isLoading: false,
    error: null,
  })
  useUserProfileMock.mockReturnValue({
    data: user,
    isLoading: false,
    error: null,
  })

  updateMutationState = {
    mutate: vi.fn(),
    isPending: false,
    error: null,
  }
  useUpdateLyceumMutationMock.mockReturnValue(updateMutationState)
})

describe('LyceumEditPage', () => {
  it('renders the invalid id message', async () => {
    renderPage('/lyceums/invalid/edit')

    expect(await screen.findByText('Invalid lyceum id.')).toBeDefined()
  })

  it('renders the loading state', async () => {
    useLyceumMock.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    })

    renderPage('/lyceums/1/edit')

    expect(await screen.findByText('Loading lyceum details...')).toBeDefined()
  })

  it('shows forbidden message when user lacks access', async () => {
    const user: CurrentUser = { id: 12, role: 'USER', administratedLyceumId: 99 }
    useUserProfileMock.mockReturnValue({
      data: user,
      isLoading: false,
      error: null,
    })

    renderPage('/lyceums/1/edit')

    expect(
      await screen.findByText('You do not have access to this account.'),
    ).toBeDefined()
  })

  it('submits updates and navigates after success', async () => {
    const mutateMock: UpdateLyceumMutationResult['mutate'] = (values, options) => {
      options?.onSuccess?.({
        id: values.id,
        name: values.payload.name,
        town: values.payload.town,
      })
    }
    updateMutationState.mutate = vi.fn(mutateMock)

    renderPage('/lyceums/1/edit')

    await waitFor(() => {
      expect((screen.getByLabelText('Name') as HTMLInputElement).value).toBe(
        'Community Center',
      )
    })

    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: '  New Lyceum  ' },
    })
    fireEvent.change(screen.getByLabelText('Town'), {
      target: { value: '  Varna  ' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }))

    await waitFor(() => {
      expect(updateMutationState.mutate).toHaveBeenCalled()
    })

    expect(updateMutationState.mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        payload: expect.objectContaining({
          name: 'New Lyceum',
          town: 'Varna',
        }),
      }),
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    )

    await waitFor(() => {
      expect(showToastMock).toHaveBeenCalledWith({
        message: 'Lyceum updated successfully.',
        tone: 'success',
      })
      expect(navigateMock).toHaveBeenCalledWith('/lyceums/1', { replace: true })
    })
  })
})
