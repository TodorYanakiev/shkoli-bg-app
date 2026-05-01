import { LYCEUM_TOWNS } from '../../../../constants/lyceums'
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

export const getAdminLyceumTownOptions = () => [...LYCEUM_TOWNS]
