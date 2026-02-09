import { useMemo } from 'react'

import { useLyceum } from '../../Lyceums/hooks/useLyceum'
import type { LyceumResponse } from '../../../types/lyceums'

type UseCourseCardLocationArgs = {
  courseAddress?: string
  lyceumId?: number
}

const buildLyceumAddress = (lyceum?: LyceumResponse) => {
  const addressParts = [lyceum?.town, lyceum?.address]
    .map((value) => value?.trim())
    .filter(Boolean)
  return addressParts.length > 0 ? addressParts.join(', ') : undefined
}

export const useCourseCardLocation = ({
  courseAddress,
  lyceumId,
}: UseCourseCardLocationArgs) => {
  const normalizedCourseAddress = courseAddress?.trim()
  const courseAddressValue =
    normalizedCourseAddress && normalizedCourseAddress.length > 0
      ? normalizedCourseAddress
      : undefined
  const shouldLoadLyceum = !courseAddressValue && Boolean(lyceumId)
  const { data: lyceum, isLoading, error } = useLyceum(lyceumId, {
    enabled: shouldLoadLyceum,
  })

  const lyceumAddress = useMemo(
    () => buildLyceumAddress(lyceum),
    [lyceum],
  )
  const resolvedAddress = courseAddressValue ?? lyceumAddress

  return {
    resolvedAddress,
    isLoading: shouldLoadLyceum && isLoading,
    hasError: Boolean(error),
  }
}
