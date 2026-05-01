import { describe, expect, it } from 'vitest'

import { getLyceumSuggestionItems } from './useLyceumSuggestions'

describe('getLyceumSuggestionItems', () => {
  it('keeps array responses as-is', () => {
    const lyceums = [{ id: 1, name: 'Community Center', town: 'Sofia' }]

    expect(getLyceumSuggestionItems(lyceums)).toEqual(lyceums)
  })

  it('unwraps paged lyceum filter responses', () => {
    const lyceums = [{ id: 2, name: 'Readers Club', town: 'Plovdiv' }]

    expect(getLyceumSuggestionItems({ content: lyceums })).toEqual(lyceums)
  })
})
