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

  const lecturedLyceums = lecturedLyceumQueries
    .map((query) => query.data)
    .filter((lyceum): lyceum is NonNullable<typeof lyceum> => Boolean(lyceum))
  const isLecturedLyceumsLoading =
    lecturedLyceums.length === 0 &&
    lecturedLyceumQueries.some(
      (query) => query.isLoading || query.isFetching,
    )
  const lecturedLyceumsError =
    lecturedLyceumQueries.find((query) => query.error)?.error ?? null

  return {
    lecturedLyceums,
    isLecturedLyceumsLoading,
    lecturedLyceumsError,
  }
}
