import { fireEvent, render, screen } from '@testing-library/react'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'

import i18n from '../../locales/i18n'
import { getCookieConsentPreferences } from '../../services/cookieConsent'
import CookieConsentBanner from './CookieConsentBanner'

describe('CookieConsentBanner', () => {
  beforeAll(async () => {
    await i18n.changeLanguage('en')
  })

  beforeEach(() => {
    window.localStorage.clear()
  })

  it('shows banner on first visit and accepts all consent', () => {
    render(<CookieConsentBanner />)

    expect(
      screen.getByRole('dialog', {
        name: 'Cookie settings',
      }),
    ).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Accept all' }))

    expect(
      screen.queryByRole('dialog', {
        name: 'Cookie settings',
      }),
    ).toBeNull()
    expect(
      screen.getByRole('button', { name: 'Cookie settings' }),
    ).toBeTruthy()

    expect(getCookieConsentPreferences()).toEqual({
      necessary: true,
      analytics: true,
      diagnostics: true,
    })
  })

  it('saves custom consent preferences', () => {
    render(<CookieConsentBanner />)

    fireEvent.click(
      screen.getByRole('checkbox', {
        name: /Analytics \(Google Analytics, Hotjar, Contentsquare\)/i,
      }),
    )

    fireEvent.click(screen.getByRole('button', { name: 'Save preferences' }))

    expect(getCookieConsentPreferences()).toEqual({
      necessary: true,
      analytics: true,
      diagnostics: false,
    })
  })
})
