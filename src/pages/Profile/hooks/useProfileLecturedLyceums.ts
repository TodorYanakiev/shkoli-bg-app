import { useEffect, useState } from 'react'

import { useLecturedLyceums } from './useLecturedLyceums'

type UseProfileLecturedLyceumsOptions = {
  lecturedLyceumIds: number[]
  enabled: boolean
}

export const useProfileLecturedLyceums = ({
  lecturedLyceumIds,
  enabled,
}: UseProfileLecturedLyceumsOptions) => {
  const lecturedLyceumQueries = useLecturedLyceums(lecturedLyceumIds, {
    enabled,
  })
  const lecturedLyceumCount = lecturedLyceumIds.length
  const [lecturedLyceumIndex, setLecturedLyceumIndex] = useState(0)

  const activeLecturedQuery =
    lecturedLyceumQueries[lecturedLyceumIndex] ?? null
  const activeLecturedLyceum = activeLecturedQuery?.data
  const isLecturedLyceumLoading =
    activeLecturedQuery?.isLoading || activeLecturedQuery?.isFetching || false
  const lecturedLyceumError = activeLecturedQuery?.error ?? null

  useEffect(() => {
    if (lecturedLyceumIndex >= lecturedLyceumCount) {
      setLecturedLyceumIndex(0)
    }
  }, [lecturedLyceumCount, lecturedLyceumIndex])

  const handleLecturedPrevious = () => {
    if (lecturedLyceumCount <= 1) return
    setLecturedLyceumIndex((prev) =>
      (prev - 1 + lecturedLyceumCount) % lecturedLyceumCount,
    )
  }

  const handleLecturedNext = () => {
    if (lecturedLyceumCount <= 1) return
    setLecturedLyceumIndex((prev) => (prev + 1) % lecturedLyceumCount)
  }

  return {
    lecturedLyceumCount,
    lecturedLyceumIndex,
    activeLecturedLyceum,
    isLecturedLyceumLoading,
    lecturedLyceumError,
    showLecturedControls: lecturedLyceumCount > 1,
    handleLecturedPrevious,
    handleLecturedNext,
  }
}
