import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import LoginForm from './LoginForm'
import i18n from '../../../locales/i18n'
import type { ApiError } from '../../../types/api'
import type { AuthenticationRequest, AuthenticationResponse } from '../../../types/auth'

const navigateMock = vi.hoisted(() => vi.fn())
const useLoginMutationMock = vi.hoisted(() => vi.fn())
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

vi.mock('../hooks/useLoginMutation', () => ({
  useLoginMutation: useLoginMutationMock,
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
  mutate: (values: AuthenticationRequest, options?: MutateOptions) => void
  isPending: boolean
  error: ApiError | null
}

const renderForm = () =>
  render(
    <MemoryRouter>
      <LoginForm />
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
  useLoginMutationMock.mockReset()
  useLoginMutationMock.mockReturnValue({
    mutate: vi.fn(),
    isPending: false,
    error: null,
  } satisfies MutationResult)
})

describe('LoginForm', () => {
  it('shows required validation errors on empty submit', async () => {
    renderForm()

    fireEvent.click(screen.getByRole('button', { name: 'Log in' }))

    const errors = await screen.findAllByText('This field is required.')
    expect(errors).toHaveLength(2)
  })

  it('renders an invalid credentials error', () => {
    const error: ApiError = { status: 401, kind: 'unauthorized' }
    useLoginMutationMock.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      error,
    } satisfies MutationResult)

    renderForm()

    const alert = screen.getByRole('alert')
    expect(alert.textContent).toContain('Incorrect email or password.')
  })

  it('submits and handles success flow', async () => {
    const mutateMock: MutationResult['mutate'] = vi.fn((_values, options) => {
      options?.onSuccess?.({
        access_token: 'access',
        refresh_token: 'refresh',
      })
    })

    useLoginMutationMock.mockReturnValue({
      mutate: mutateMock,
      isPending: false,
      error: null,
    } satisfies MutationResult)

    renderForm()

    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'user@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Log in' }))

    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalledWith(
        { email: 'user@example.com', password: 'password123' },
        expect.objectContaining({ onSuccess: expect.any(Function) }),
      )
    })
    expect(setTokensMock).toHaveBeenCalledWith({
      accessToken: 'access',
      refreshToken: 'refresh',
    })
    expect(showToastMock).toHaveBeenCalledWith({
      message: 'Welcome back! You are signed in.',
      tone: 'success',
    })
    expect(navigateMock).toHaveBeenCalledWith('/shkoli', { replace: true })
  })

  it('shows pending state', () => {
    useLoginMutationMock.mockReturnValue({
      mutate: vi.fn(),
      isPending: true,
      error: null,
    } satisfies MutationResult)

    renderForm()

    const button = screen.getByRole('button', { name: 'Signing in...' })
    expect(button).toBeDefined()
    expect((button as HTMLButtonElement).disabled).toBe(true)
  })
})
