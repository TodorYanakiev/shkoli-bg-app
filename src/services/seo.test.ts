import { describe, expect, it } from 'vitest'

import {
  getHreflangAlternates,
  getRobotsContent,
  shouldNoindexRoute,
} from './seo'

describe('seo service', () => {
  it('marks protected routes as noindex', () => {
    expect(shouldNoindexRoute('/bg/profile')).toBe(true)
    expect(shouldNoindexRoute('/en/admin/users')).toBe(true)
  })

  it('marks query parameter variants as noindex', () => {
    const searchParams = new URLSearchParams('page=2')
    expect(shouldNoindexRoute('/bg/shkoli', searchParams)).toBe(true)
    expect(getRobotsContent('/bg/shkoli', searchParams)).toBe('noindex,follow')
  })

  it('returns hreflang alternates for all locales and x-default', () => {
    const alternates = getHreflangAlternates('/bg/shkoli')

    expect(alternates.find((entry) => entry.hrefLang === 'bg')).toBeTruthy()
    expect(alternates.find((entry) => entry.hrefLang === 'en')).toBeTruthy()
    expect(alternates.find((entry) => entry.hrefLang === 'x-default')).toBeTruthy()
  })
})
