import { describe, expect, it } from 'vitest'

import { LYCEUM_TOWNS } from '../../../../constants/lyceums'
import type { LyceumResponse } from '../../../../types/lyceums'
import {
  filterAdminLyceums,
  getAdminLyceumTownOptions,
} from './adminLyceumsFilterService'

const lyceums: LyceumResponse[] = [
  {
    id: 1,
    name: 'Central Lyceum',
    town: 'Sofia',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 2,
    name: 'Creative Hub',
    town: 'Plovdiv',
    verificationStatus: 'PENDING',
  },
  {
    id: 3,
    name: 'Music House',
    town: 'Sofia',
    verificationStatus: 'NOT_VERIFIED',
  },
]

describe('adminLyceumsFilterService', () => {
  it('filters by name with case-insensitive matching', () => {
    const result = filterAdminLyceums(lyceums, {
      name: 'central',
      town: '',
      includeVerified: true,
      includeUnverified: true,
    })

    expect(result).toHaveLength(1)
    expect(result[0]?.id).toBe(1)
  })

  it('filters by town with case-insensitive matching', () => {
    const result = filterAdminLyceums(lyceums, {
      name: '',
      town: 'sofia',
      includeVerified: true,
      includeUnverified: true,
    })

    expect(result).toHaveLength(2)
    expect(result.map((item) => item.id)).toEqual([1, 3])
  })

  it('filters by verified checkbox', () => {
    const result = filterAdminLyceums(lyceums, {
      name: '',
      town: '',
      includeVerified: true,
      includeUnverified: false,
    })

    expect(result).toHaveLength(1)
    expect(result[0]?.id).toBe(1)
  })

  it('filters by unverified checkbox', () => {
    const result = filterAdminLyceums(lyceums, {
      name: '',
      town: '',
      includeVerified: false,
      includeUnverified: true,
    })

    expect(result).toHaveLength(2)
    expect(result.map((item) => item.id)).toEqual([2, 3])
  })

  it('applies combined filters', () => {
    const result = filterAdminLyceums(lyceums, {
      name: 'music',
      town: 'sofia',
      includeVerified: false,
      includeUnverified: true,
    })

    expect(result).toHaveLength(1)
    expect(result[0]?.id).toBe(3)
  })

  it('returns every configured town option', () => {
    const result = getAdminLyceumTownOptions()

    expect(result).toEqual([...LYCEUM_TOWNS])
  })
})
