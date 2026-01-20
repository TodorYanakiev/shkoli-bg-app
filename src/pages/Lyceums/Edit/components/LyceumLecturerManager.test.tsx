import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import LyceumLecturerManager from './LyceumLecturerManager'
import i18n from '../../../../locales/i18n'
import type { ApiError } from '../../../../types/api'

const showToastMock = vi.hoisted(() => vi.fn())
const useLyceumLecturersMock = vi.hoisted(() => vi.fn())
const useUsersMock = vi.hoisted(() => vi.fn())
const useInviteLyceumLecturerMutationMock = vi.hoisted(() => vi.fn())
const useRemoveLyceumLecturerMutationMock = vi.hoisted(() => vi.fn())

vi.mock('../../../../components/feedback/ToastContext', () => ({
  useToast: () => ({ showToast: showToastMock }),
}))

vi.mock('../../hooks/useLyceumLecturers', () => ({
  useLyceumLecturers: useLyceumLecturersMock,
  lyceumLecturersQueryKey: (id?: number) => ['lyceums', 'lecturers', id] as const,
}))

vi.mock('../../hooks/useUsers', () => ({
  useUsers: useUsersMock,
}))

vi.mock('../../hooks/useInviteLyceumLecturerMutation', () => ({
  useInviteLyceumLecturerMutation: useInviteLyceumLecturerMutationMock,
}))

vi.mock('../../hooks/useRemoveLyceumLecturerMutation', () => ({
  useRemoveLyceumLecturerMutation: useRemoveLyceumLecturerMutationMock,
}))

type InviteMutationOptions = {
  onSuccess?: () => void
  onError?: (error: ApiError) => void
}

type InviteMutationResult = {
  mutate: (
    payload: { email: string; lyceumId?: number },
    options?: InviteMutationOptions,
  ) => void
  reset: () => void
  isPending: boolean
  error: ApiError | null
}

type RemoveMutationOptions = {
  onSuccess?: () => void
  onError?: (error: ApiError) => void
}

type RemoveMutationResult = {
  mutate: (
    payload: { lyceumId: number; userId: number },
    options?: RemoveMutationOptions,
  ) => void
  reset: () => void
  isPending: boolean
  error: ApiError | null
}

let inviteMutationState: InviteMutationResult
let removeMutationState: RemoveMutationResult

const renderComponent = (queryClient?: QueryClient) => {
  const client =
    queryClient ??
    new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

  return render(
    <QueryClientProvider client={client}>
      <LyceumLecturerManager lyceumId={1} />
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
  showToastMock.mockReset()
  useLyceumLecturersMock.mockReset()
  useUsersMock.mockReset()
  useInviteLyceumLecturerMutationMock.mockReset()
  useRemoveLyceumLecturerMutationMock.mockReset()

  useLyceumLecturersMock.mockReturnValue({
    data: [],
    isLoading: false,
    error: null,
  })

  useUsersMock.mockReturnValue({
    data: [],
    isLoading: false,
    error: null,
  })

  inviteMutationState = {
    mutate: vi.fn(),
    reset: vi.fn(),
    isPending: false,
    error: null,
  }
  removeMutationState = {
    mutate: vi.fn(),
    reset: vi.fn(),
    isPending: false,
    error: null,
  }

  useInviteLyceumLecturerMutationMock.mockReturnValue(inviteMutationState)
  useRemoveLyceumLecturerMutationMock.mockReturnValue(removeMutationState)
})

describe('LyceumLecturerManager', () => {
  it('submits invitation with normalized email and resets the form', async () => {
    inviteMutationState.mutate = vi.fn((_payload, options) => {
      options?.onSuccess?.()
    })

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    renderComponent(queryClient)

    const emailInput = screen.getByLabelText('Lecturer email') as HTMLInputElement
    fireEvent.change(emailInput, { target: { value: '  Test@Example.COM ' } })
    fireEvent.click(screen.getByRole('button', { name: 'Add lecturer' }))

    await waitFor(() => {
      expect(inviteMutationState.mutate).toHaveBeenCalled()
    })

    expect(inviteMutationState.mutate).toHaveBeenCalledWith(
      { email: 'test@example.com', lyceumId: 1 },
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    )

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ['lyceums', 'lecturers', 1],
      })
      expect(showToastMock).toHaveBeenCalledWith({
        message:
          'Invitation sent. If the user already exists, they are now a lecturer.',
        tone: 'success',
      })
      expect(emailInput.value).toBe('')
    })
  })

  it('keeps the invite button enabled when user suggestions fail', () => {
    useUsersMock.mockReturnValue({
      data: [],
      isLoading: false,
      error: { status: 500, kind: 'unknown' } as ApiError,
    })

    renderComponent()

    const submitButton = screen.getByRole('button', { name: 'Add lecturer' })
    expect(submitButton.hasAttribute('disabled')).toBe(false)
    expect(
      screen.getByText(
        'Unable to load user suggestions. You can still send an invite.',
      ),
    ).toBeDefined()
  })
})
