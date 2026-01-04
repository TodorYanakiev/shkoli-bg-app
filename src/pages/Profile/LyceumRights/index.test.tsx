import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import LyceumRightsPage from './index'
import i18n from '../../../locales/i18n'
import type { ApiError } from '../../../types/api'
import type {
  LyceumRightsRequest,
  LyceumRightsVerificationRequest,
} from '../../../types/lyceums'

const navigateMock = vi.hoisted(() => vi.fn())
const showToastMock = vi.hoisted(() => vi.fn())
const useLyceumSuggestionsMock = vi.hoisted(() => vi.fn())
const useRequestLyceumRightsMutationMock = vi.hoisted(() => vi.fn())
const useVerifyLyceumRightsMutationMock = vi.hoisted(() => vi.fn())

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

vi.mock('./hooks/useLyceumSuggestions', () => ({
  useLyceumSuggestions: useLyceumSuggestionsMock,
}))

vi.mock('./hooks/useRequestLyceumRightsMutation', () => ({
  useRequestLyceumRightsMutation: useRequestLyceumRightsMutationMock,
}))

vi.mock('./hooks/useVerifyLyceumRightsMutation', () => ({
  useVerifyLyceumRightsMutation: useVerifyLyceumRightsMutationMock,
}))

vi.mock('../../../constants/lyceums', () => {
  const towns = ['Sofia', 'Plovdiv'] as const
  return { LYCEUM_TOWNS: towns }
})

type MockTownSelectProps = {
  id: string
  value: string
  options: readonly string[]
  placeholder: string
  disabled?: boolean
  describedById?: string
  onChange: (value: string) => void
}

vi.mock('./components/TownSelect', () => ({
  default: ({
    id,
    value,
    options,
    placeholder,
    disabled,
    describedById,
    onChange,
  }: MockTownSelectProps) => (
    <select
      id={id}
      aria-describedby={describedById}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  ),
}))

type RequestMutateOptions = {
  onSuccess?: (message: string) => void
  onError?: (error: ApiError) => void
}

type RequestMutationResult = {
  mutate: (values: LyceumRightsRequest, options?: RequestMutateOptions) => void
  isPending: boolean
  error: ApiError | null
  reset: () => void
}

type VerifyMutateOptions = {
  onSuccess?: () => void
}

type VerifyMutationResult = {
  mutate: (
    values: LyceumRightsVerificationRequest,
    options?: VerifyMutateOptions,
  ) => void
  isPending: boolean
  error: ApiError | null
  reset: () => void
}

let requestMutationState: RequestMutationResult
let verifyMutationState: VerifyMutationResult

const renderPage = () =>
  render(
    <HelmetProvider>
      <MemoryRouter>
        <LyceumRightsPage />
      </MemoryRouter>
    </HelmetProvider>,
  )

beforeAll(async () => {
  await i18n.changeLanguage('en')
})

afterEach(() => {
  cleanup()
})

beforeEach(() => {
  navigateMock.mockReset()
  showToastMock.mockReset()
  useLyceumSuggestionsMock.mockReset()
  useRequestLyceumRightsMutationMock.mockReset()
  useVerifyLyceumRightsMutationMock.mockReset()

  useLyceumSuggestionsMock.mockReturnValue({
    data: [],
    isLoading: false,
    isError: false,
  })

  requestMutationState = {
    mutate: vi.fn(),
    isPending: false,
    error: null,
    reset: vi.fn(),
  }
  verifyMutationState = {
    mutate: vi.fn(),
    isPending: false,
    error: null,
    reset: vi.fn(),
  }

  useRequestLyceumRightsMutationMock.mockReturnValue(requestMutationState)
  useVerifyLyceumRightsMutationMock.mockReturnValue(verifyMutationState)
})

describe('LyceumRightsPage (request flow)', () => {
  it('shows validation errors when submitting empty form', async () => {
    renderPage()

    fireEvent.click(
      screen.getByRole('button', { name: 'Send verification email' }),
    )

    const errors = await screen.findAllByText('This field is required.')
    expect(errors).toHaveLength(2)
    expect(requestMutationState.mutate).not.toHaveBeenCalled()
  })

  it('submits a request and renders the email sent state', async () => {
    const mutateMock: RequestMutationResult['mutate'] = (_, options) => {
      requestMutationState.error = null
      options?.onSuccess?.(
        'We have sent you an email at admin@example.com with a verification code.',
      )
    }
    requestMutationState.mutate = vi.fn(mutateMock)

    renderPage()

    fireEvent.change(screen.getByLabelText('Lyceum name'), {
      target: { value: 'Community Center' },
    })
    fireEvent.change(screen.getByLabelText('Town'), {
      target: { value: 'Sofia' },
    })
    fireEvent.click(
      screen.getByRole('button', { name: 'Send verification email' }),
    )

    await waitFor(() => {
      expect(requestMutationState.mutate).toHaveBeenCalledWith(
        { lyceumName: 'Community Center', town: 'Sofia' },
        expect.objectContaining({ onSuccess: expect.any(Function) }),
      )
    })

    expect(showToastMock).toHaveBeenCalledWith({
      message: 'Verification email sent.',
      tone: 'success',
    })
    expect(
      await screen.findByText(
        'We have sent you an email at admin@example.com with a verification code.',
      ),
    ).toBeDefined()
    expect(
      await screen.findByText('Lyceum: Community Center (Sofia).'),
    ).toBeDefined()
    expect(
      await screen.findByText('Email sent. Enter the verification code below.'),
    ).toBeDefined()
  })

  it('shows the already-admin outcome and disables the request form', async () => {
    const error: ApiError = { status: 409, kind: 'unknown' }
    const mutateMock: RequestMutationResult['mutate'] = (_, options) => {
      requestMutationState.error = error
      options?.onError?.(error)
    }
    requestMutationState.mutate = vi.fn(mutateMock)

    renderPage()

    fireEvent.change(screen.getByLabelText('Lyceum name'), {
      target: { value: 'Community Center' },
    })
    fireEvent.change(screen.getByLabelText('Town'), {
      target: { value: 'Sofia' },
    })
    fireEvent.click(
      screen.getByRole('button', { name: 'Send verification email' }),
    )

    await waitFor(() => {
      expect(
        screen.getByText(
          'Attention: You already administrate another lyceum. Requests are disabled.',
        ),
      ).toBeDefined()
    })

    const submitButton = screen.getByRole('button', {
      name: 'Send verification email',
    }) as HTMLButtonElement
    expect(submitButton.disabled).toBe(true)
    expect(screen.queryByRole('alert')).toBeNull()
  })
})
