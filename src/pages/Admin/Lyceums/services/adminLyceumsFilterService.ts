import type { LyceumResponse } from '../../../../types/lyceums'
import type { AdminLyceumsFilterState } from '../types'

const normalizeText = (value: string | undefined) =>
  value?.trim().toLocaleLowerCase() ?? ''

const matchesText = (value: string | undefined, query: string) => {
  if (query.length === 0) return true
  return normalizeText(value).includes(query)
}

const matchesVerificationStatus = (
  lyceum: LyceumResponse,
  filters: AdminLyceumsFilterState,
) => {
  const isVerified = lyceum.verificationStatus === 'VERIFIED'
  const isUnverified = !isVerified
  return (
    (filters.includeVerified && isVerified) ||
    (filters.includeUnverified && isUnverified)
  )
}

export const filterAdminLyceums = (
  lyceums: LyceumResponse[],
  filters: AdminLyceumsFilterState,
) => {
  const normalizedName = normalizeText(filters.name)
  const normalizedTown = normalizeText(filters.town)

  return lyceums.filter(
    (lyceum) =>
      matchesText(lyceum.name, normalizedName) &&
      matchesText(lyceum.town, normalizedTown) &&
      matchesVerificationStatus(lyceum, filters),
  )
}

const hasTownValue = (value: string | undefined): value is string =>
  typeof value === 'string' && value.trim().length > 0

export const getAdminLyceumTownOptions = (lyceums: LyceumResponse[]) =>
  Array.from(
    new Set(
      lyceums.map((lyceum) => lyceum.town?.trim()).filter(hasTownValue),
    ),
  ).sort((a, b) => a.localeCompare(b, 'bg', { sensitivity: 'base' }))
