import { render, screen } from '@testing-library/react'
import { beforeAll, describe, expect, it } from 'vitest'
import i18n from './locales/i18n'
import App from './App'

describe('App', () => {
  beforeAll(async () => {
    await i18n.changeLanguage('en')
  })

  it('renders the courses page heading', async () => {
    render(<App />)

    expect(
      await screen.findByRole('heading', { name: 'Courses', level: 1 })
    ).toBeDefined()
  })
})
