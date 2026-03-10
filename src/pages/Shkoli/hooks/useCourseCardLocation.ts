import { useMemo } from 'react'

import { useLyceum } from '../../Lyceums/hooks/useLyceum'

type UseCourseCardLocationArgs = {
  courseAddress?: string
  lyceumTown?: string
  lyceumAddress?: string
  lyceumId?: number
}

const getNormalizedValue = (value?: string) => {
  const trimmedValue = value?.trim()
  return trimmedValue && trimmedValue.length > 0
    ? trimmedValue
    : undefined
}

const buildLyceumAddress = ({
  town,
  address,
}: {
  town?: string
  address?: string
}) => {
  const addressParts = [town, address]
    .map(getNormalizedValue)
    .filter(Boolean)
  return addressParts.length > 0 ? addressParts.join(', ') : undefined
}

export const useCourseCardLocation = ({
  courseAddress,
  lyceumTown,
  lyceumAddress,
  lyceumId,
}: UseCourseCardLocationArgs) => {
  const courseAddressValue = getNormalizedValue(courseAddress)
  const lyceumAddressFromCourse = useMemo(
    () =>
      buildLyceumAddress({
        town: lyceumTown,
        address: lyceumAddress,
      }),
    [lyceumAddress, lyceumTown],
  )
  const shouldLoadLyceum =
    !courseAddressValue &&
    !lyceumAddressFromCourse &&
    Boolean(lyceumId)
  const { data: lyceum, isLoading, error } = useLyceum(lyceumId, {
    enabled: shouldLoadLyceum,
  })

  const lyceumAddressFromRequest = useMemo(
    () =>
      buildLyceumAddress({
        town: lyceum?.town,
        address: lyceum?.address,
      }),
    [lyceum],
  )
  const resolvedAddress =
    courseAddressValue ??
    lyceumAddressFromCourse ??
    lyceumAddressFromRequest

  return {
    resolvedAddress,
    isLoading: shouldLoadLyceum && isLoading,
    hasError: Boolean(error),
  }
}
