import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
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

import ForgotPasswordPage from '.'
import i18n from '../../locales/i18n'
import type { ApiError } from '../../types/api'
import type {
  ForgotPasswordRequest,
  PasswordResetCodeVerificationRequest,
  ResetForgottenPasswordRequest,
} from '../../types/auth'

const navigateMock = vi.hoisted(() => vi.fn())
const showToastMock = vi.hoisted(() => vi.fn())
const clearTokensMock = vi.hoisted(() => vi.fn())
const useRequestPasswordResetMutationMock = vi.hoisted(() => vi.fn())
const useVerifyPasswordResetCodeMutationMock = vi.hoisted(() => vi.fn())
const useResetForgottenPasswordMutationMock = vi.hoisted(() => vi.fn())

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom',
  )
  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

vi.mock('../../components/feedback/ToastContext', () => ({
  useToast: () => ({ showToast: showToastMock }),
}))

vi.mock('../../utils/authStorage', () => ({
  clearTokens: clearTokensMock,
}))

vi.mock('./hooks/useRequestPasswordResetMutation', () => ({
  useRequestPasswordResetMutation: useRequestPasswordResetMutationMock,
}))

vi.mock('./hooks/useVerifyPasswordResetCodeMutation', () => ({
  useVerifyPasswordResetCodeMutation: useVerifyPasswordResetCodeMutationMock,
}))

vi.mock('./hooks/useResetForgottenPasswordMutation', () => ({
  useResetForgottenPasswordMutation: useResetForgottenPasswordMutationMock,
}))

type MutateOptions = {
  onSuccess?: (message: string) => void
}

type MutationResult<TValues> = {
  mutate: (values: TValues, options?: MutateOptions) => void
  isPending: boolean
  error: ApiError | null
  reset: () => void
}

const createMutation = <TValues,>(
  mutate: MutationResult<TValues>['mutate'] = vi.fn(),
  error: ApiError | null = null,
): MutationResult<TValues> => ({
  mutate,
  isPending: false,
  error,
  reset: vi.fn(),
})

const renderPage = () =>
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={['/bg/auth/forgot-password']}>
        <ForgotPasswordPage />
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
  clearTokensMock.mockReset()
  useRequestPasswordResetMutationMock.mockReset()
  useVerifyPasswordResetCodeMutationMock.mockReset()
  useResetForgottenPasswordMutationMock.mockReset()
  useRequestPasswordResetMutationMock.mockReturnValue(
    createMutation<ForgotPasswordRequest>(),
  )
  useVerifyPasswordResetCodeMutationMock.mockReturnValue(
    createMutation<PasswordResetCodeVerificationRequest>(),
  )
  useResetForgottenPasswordMutationMock.mockReturnValue(
    createMutation<ResetForgottenPasswordRequest>(),
  )
})

describe('ForgotPasswordPage', () => {
  it('shows email validation on empty request submit', async () => {
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: 'Send code' }))

    expect(await screen.findByText('This field is required.')).toBeDefined()
  })

  it('submits request, verify, and reset payloads', async () => {
    const requestMutate: MutationResult<ForgotPasswordRequest>['mutate'] =
      vi.fn((_values, options) => {
        options?.onSuccess?.(
          'If an account with that email exists, we have sent a verification code.',
        )
      })
    const verifyMutate: MutationResult<PasswordResetCodeVerificationRequest>['mutate'] =
      vi.fn((_values, options) => {
        options?.onSuccess?.('Verification code confirmed.')
      })
    const resetMutate: MutationResult<ResetForgottenPasswordRequest>['mutate'] =
      vi.fn((_values, options) => {
        options?.onSuccess?.('Password has been reset successfully.')
      })

    useRequestPasswordResetMutationMock.mockReturnValue(
      createMutation<ForgotPasswordRequest>(requestMutate),
    )
    useVerifyPasswordResetCodeMutationMock.mockReturnValue(
      createMutation<PasswordResetCodeVerificationRequest>(verifyMutate),
    )
    useResetForgottenPasswordMutationMock.mockReturnValue(
      createMutation<ResetForgottenPasswordRequest>(resetMutate),
    )

    renderPage()

    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: ' user@example.com ' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Send code' }))

    await waitFor(() => {
      expect(requestMutate).toHaveBeenCalledWith(
        { email: 'user@example.com' },
        expect.objectContaining({ onSuccess: expect.any(Function) }),
      )
    })

    fireEvent.change(await screen.findByLabelText('Verification code'), {
      target: { value: '123456' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Confirm code' }))

    await waitFor(() => {
      expect(verifyMutate).toHaveBeenCalledWith(
        { email: 'user@example.com', verificationCode: '123456' },
        expect.objectContaining({ onSuccess: expect.any(Function) }),
      )
    })

    fireEvent.change(await screen.findByLabelText('New password'), {
      target: { value: 'NewPassword123' },
    })
    fireEvent.change(screen.getByLabelText('Confirm new password'), {
      target: { value: 'NewPassword123' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Reset password' }))

    await waitFor(() => {
      expect(resetMutate).toHaveBeenCalledWith(
        {
          email: 'user@example.com',
          verificationCode: '123456',
          newPassword: 'NewPassword123',
          confirmationPassword: 'NewPassword123',
        },
        expect.objectContaining({ onSuccess: expect.any(Function) }),
      )
    })
    expect(clearTokensMock).toHaveBeenCalled()
    expect(showToastMock).toHaveBeenCalledWith({
      message: 'Password reset successfully.',
      tone: 'success',
    })
    expect(navigateMock).toHaveBeenCalledWith('/bg/auth/login', {
      replace: true,
    })
  })

  it('renders backend error messages', () => {
    useRequestPasswordResetMutationMock.mockReturnValue(
      createMutation<ForgotPasswordRequest>(vi.fn(), {
        status: 400,
        kind: 'unknown',
        message: 'Email must not be blank!\nInvalid email!',
      }),
    )

    renderPage()

    const alert = screen.getByRole('alert')
    expect(alert.textContent).toContain('Email must not be blank.')
    expect(alert.textContent).toContain('Enter a valid email address.')
  })
})
