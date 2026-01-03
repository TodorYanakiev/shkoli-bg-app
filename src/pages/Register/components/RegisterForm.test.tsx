import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import RegisterForm from './RegisterForm'
import i18n from '../../../locales/i18n'
import type { ApiError } from '../../../types/api'
import type { AuthenticationResponse, RegisterRequest } from '../../../types/auth'

const navigateMock = vi.hoisted(() => vi.fn())
const useRegisterMutationMock = vi.hoisted(() => vi.fn())
const showToastMock = vi.hoisted(() => vi.fn())
const setTokensMock = vi.hoisted(() => vi.fn())

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom',
  )
  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

vi.mock('../hooks/useRegisterMutation', () => ({
  useRegisterMutation: useRegisterMutationMock,
}))

vi.mock('../../../components/feedback/ToastContext', () => ({
  useToast: () => ({ showToast: showToastMock }),
}))

vi.mock('../../../utils/authStorage', () => ({
  setTokens: setTokensMock,
}))

type MutateOptions = {
  onSuccess?: (data: AuthenticationResponse) => void
}

type MutationResult = {
  mutate: (values: RegisterRequest, options?: MutateOptions) => void
  isPending: boolean
  error: ApiError | null
}

const renderForm = () =>
  render(
    <MemoryRouter>
      <RegisterForm />
    </MemoryRouter>,
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
  setTokensMock.mockReset()
  useRegisterMutationMock.mockReset()
  useRegisterMutationMock.mockReturnValue({
    mutate: vi.fn(),
    isPending: false,
    error: null,
  } satisfies MutationResult)
})

describe('RegisterForm', () => {
  it('shows password mismatch error when passwords differ', async () => {
    renderForm()

    fireEvent.change(screen.getByLabelText('First name'), {
      target: { value: 'Jamie' },
    })
    fireEvent.change(screen.getByLabelText('Last name'), {
      target: { value: 'Nguyen' },
    })
    fireEvent.change(screen.getByLabelText('Username'), {
      target: { value: 'jnguyen' },
    })
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'jamie@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    })
    fireEvent.change(screen.getByLabelText('Confirm password'), {
      target: { value: 'password456' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Create account' }))

    const mismatch = await screen.findByText('Passwords do not match.')
    expect(mismatch).toBeDefined()
  })

  it('renders a duplicate account error', () => {
    const error: ApiError = { status: 409, kind: 'unknown' }
    useRegisterMutationMock.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      error,
    } satisfies MutationResult)

    renderForm()

    const alert = screen.getByRole('alert')
    expect(alert.textContent).toContain(
      'An account with these details already exists.',
    )
  })

  it('submits and handles success flow', async () => {
    const mutateMock: MutationResult['mutate'] = vi.fn((_values, options) => {
      options?.onSuccess?.({
        access_token: 'access',
        refresh_token: 'refresh',
      })
    })

    useRegisterMutationMock.mockReturnValue({
      mutate: mutateMock,
      isPending: false,
      error: null,
    } satisfies MutationResult)

    renderForm()

    fireEvent.change(screen.getByLabelText('First name'), {
      target: { value: 'Jamie' },
    })
    fireEvent.change(screen.getByLabelText('Last name'), {
      target: { value: 'Nguyen' },
    })
    fireEvent.change(screen.getByLabelText('Username'), {
      target: { value: 'jnguyen' },
    })
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'jamie@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    })
    fireEvent.change(screen.getByLabelText('Confirm password'), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Create account' }))

    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalledWith(
        {
          firstname: 'Jamie',
          lastname: 'Nguyen',
          username: 'jnguyen',
          email: 'jamie@example.com',
          password: 'password123',
          repeatedPassword: 'password123',
        },
        expect.objectContaining({ onSuccess: expect.any(Function) }),
      )
    })
    expect(setTokensMock).toHaveBeenCalledWith({
      accessToken: 'access',
      refreshToken: 'refresh',
    })
    expect(showToastMock).toHaveBeenCalledWith({
      message: "Account created. You're signed in.",
      tone: 'success',
    })
    expect(navigateMock).toHaveBeenCalledWith('/shkoli', { replace: true })
  })

  it('shows pending state', () => {
    useRegisterMutationMock.mockReturnValue({
      mutate: vi.fn(),
      isPending: true,
      error: null,
    } satisfies MutationResult)

    renderForm()

    const button = screen.getByRole('button', { name: 'Creating account...' })
    expect(button).toBeDefined()
    expect((button as HTMLButtonElement).disabled).toBe(true)
  })
})
