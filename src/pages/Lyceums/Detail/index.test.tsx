import { cleanup, render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import LyceumDetailPage from './index'
import i18n from '../../../locales/i18n'
import type { ApiError } from '../../../types/api'
import type { CourseResponse } from '../../../types/courses'
import type { LyceumResponse } from '../../../types/lyceums'
import type { UserResponse } from '../../../types/users'

const useLyceumMock = vi.hoisted(() => vi.fn())
const useLyceumCoursesMock = vi.hoisted(() => vi.fn())
const useLyceumLecturersMock = vi.hoisted(() => vi.fn())
const useUsersByIdsMock = vi.hoisted(() => vi.fn())
const useAuthStatusMock = vi.hoisted(() => vi.fn())
const useUserProfileMock = vi.hoisted(() => vi.fn())

vi.mock('../hooks/useLyceum', () => ({
  useLyceum: useLyceumMock,
}))

vi.mock('../hooks/useLyceumCourses', () => ({
  useLyceumCourses: useLyceumCoursesMock,
}))

vi.mock('../hooks/useLyceumLecturers', () => ({
  useLyceumLecturers: useLyceumLecturersMock,
}))

vi.mock('../../../hooks/useUsersByIds', () => ({
  useUsersByIds: useUsersByIdsMock,
}))

vi.mock('../../../hooks/useAuthStatus', () => ({
  useAuthStatus: useAuthStatusMock,
}))

vi.mock('../../Profile/hooks/useUserProfile', () => ({
  useUserProfile: useUserProfileMock,
}))

const renderPage = (path = '/lyceums/1') =>
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/lyceums/:id" element={<LyceumDetailPage />} />
        </Routes>
      </MemoryRouter>
    </HelmetProvider>,
  )

beforeAll(async () => {
  await i18n.changeLanguage('en')
  if (!window.matchMedia) {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }),
    })
  }
})

afterEach(() => {
  cleanup()
})

beforeEach(() => {
  useLyceumMock.mockReset()
  useLyceumCoursesMock.mockReset()
  useLyceumLecturersMock.mockReset()
  useUsersByIdsMock.mockReset()
  useAuthStatusMock.mockReset()
  useUserProfileMock.mockReset()

  const lyceum: LyceumResponse = { id: 1, name: 'Community Center', town: 'Sofia' }

  useLyceumMock.mockReturnValue({
    data: lyceum,
    isLoading: false,
    error: null,
  })
  useLyceumCoursesMock.mockReturnValue({
    data: [],
    isLoading: false,
    error: null,
  })
  useLyceumLecturersMock.mockReturnValue({
    data: [],
    isLoading: false,
    error: null,
  })
  useUsersByIdsMock.mockReturnValue({
    data: [],
    isLoading: false,
    error: null,
  })
  useAuthStatusMock.mockReturnValue({ isAuthenticated: false })
  useUserProfileMock.mockReturnValue({ data: null })
})

describe('LyceumDetailPage', () => {
  it('renders the invalid id message', async () => {
    renderPage('/lyceums/invalid')

    expect(await screen.findByText('Invalid lyceum id.')).toBeDefined()
  })

  it('renders the not found message on 404', async () => {
    const error: ApiError = { status: 404, kind: 'unknown' }
    useLyceumMock.mockReturnValue({
      data: null,
      isLoading: false,
      error,
    })

    renderPage('/lyceums/1')

    expect(await screen.findByText('Lyceum not found.')).toBeDefined()
  })

  it('shows a lecturer name from course-only lecturers', async () => {
    const course: CourseResponse = {
      id: 12,
      name: 'Painting 101',
      lecturerIds: [42],
    }
    const extraLecturer: UserResponse = {
      id: 42,
      firstname: 'Jane',
      lastname: 'Doe',
      email: 'jane@example.com',
    }

    useLyceumCoursesMock.mockReturnValue({
      data: [course],
      isLoading: false,
      error: null,
    })
    useUsersByIdsMock.mockReturnValue({
      data: [extraLecturer],
      isLoading: false,
      error: null,
    })

    renderPage('/lyceums/1')

    expect(await screen.findByText('Jane Doe')).toBeDefined()
  })
})
