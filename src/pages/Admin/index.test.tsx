import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import AdminPage from './index'
import i18n from '../../locales/i18n'

const setIsSideNavExpandedMock = vi.hoisted(() => vi.fn())
const useAdminLayoutMock = vi.hoisted(() => vi.fn())

vi.mock('./hooks/useAdminLayout', () => ({
  useAdminLayout: useAdminLayoutMock,
}))

const renderPage = (path = '/admin/courses') =>
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/admin" element={<AdminPage />}>
            <Route path="courses" element={<div>Courses content</div>} />
            <Route path="lyceums" element={<div>Lyceums content</div>} />
            <Route path="users" element={<div>Users content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </HelmetProvider>,
  )

beforeAll(async () => {
  await i18n.changeLanguage('en')
})

beforeEach(() => {
  useAdminLayoutMock.mockReset()
  setIsSideNavExpandedMock.mockReset()
  useAdminLayoutMock.mockReturnValue({
    isDesktop: true,
    isSideNavExpanded: true,
    setIsSideNavExpanded: setIsSideNavExpandedMock,
    sideNavWidth: '16rem',
  })
})

afterEach(() => {
  cleanup()
})

describe('AdminPage menu', () => {
  it('renders all admin tabs and outlet content on desktop', async () => {
    renderPage('/admin/courses')

    const navigations = await screen.findAllByRole('navigation', {
      name: 'Admin sections',
    })
    expect(navigations.length).toBe(2)

    const coursesLinks = screen.getAllByRole('link', { name: 'Courses' })
    const lyceumsLinks = screen.getAllByRole('link', { name: 'Lyceums' })
    const usersLinks = screen.getAllByRole('link', { name: 'Users' })

    expect(
      coursesLinks.some((link) => link.getAttribute('href') === '/admin/courses'),
    ).toBe(true)
    expect(
      lyceumsLinks.some((link) => link.getAttribute('href') === '/admin/lyceums'),
    ).toBe(true)
    expect(
      usersLinks.some((link) => link.getAttribute('href') === '/admin/users'),
    ).toBe(true)
    expect(await screen.findByText('Courses content')).toBeDefined()
  })

  it('calls side-nav toggle handler', async () => {
    renderPage('/admin/courses')

    const toggle = await screen.findByRole('button', { name: 'Collapse menu' })
    fireEvent.click(toggle)

    expect(setIsSideNavExpandedMock).toHaveBeenCalledTimes(1)
    expect(setIsSideNavExpandedMock.mock.calls[0]?.[0]).toEqual(
      expect.any(Function),
    )
  })

  it('renders only sub-nav on mobile and marks active tab', async () => {
    useAdminLayoutMock.mockReturnValue({
      isDesktop: false,
      isSideNavExpanded: false,
      setIsSideNavExpanded: setIsSideNavExpandedMock,
      sideNavWidth: '0px',
    })

    renderPage('/admin/lyceums')

    const navigations = await screen.findAllByRole('navigation', {
      name: 'Admin sections',
    })
    expect(navigations.length).toBe(1)
    expect(screen.queryByRole('button', { name: 'Expand menu' })).toBeNull()

    const lyceumsLink = screen.getByRole('link', { name: 'Lyceums' })
    expect(lyceumsLink.getAttribute('aria-current')).toBe('page')
    expect(await screen.findByText('Lyceums content')).toBeDefined()
  })
})
