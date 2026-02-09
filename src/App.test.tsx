import { render, screen } from '@testing-library/react'
import { beforeAll, describe, expect, it } from 'vitest'
import i18n from './locales/i18n'
import App from './App'

describe('App', () => {
  beforeAll(async () => {
    await i18n.changeLanguage('en')
  })

  it('renders the courses navigation link', async () => {
    render(<App />)

    const courseLinks = await screen.findAllByRole('link', { name: 'Courses' })

    expect(
      courseLinks.some((link) => link.getAttribute('aria-current') === 'page')
    ).toBe(true)
  })
})
