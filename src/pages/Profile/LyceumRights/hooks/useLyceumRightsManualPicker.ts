import { useMemo } from 'react'

import {
  getManualLyceumOptions,
  groupManualLyceumsByTown,
} from '../services/lyceumManualPicker'
import { useLyceumSuggestions } from './useLyceumSuggestions'

type UseLyceumRightsManualPickerOptions = {
  enabled: boolean
}

export const useLyceumRightsManualPicker = ({
  enabled,
}: UseLyceumRightsManualPickerOptions) => {
  const query = useLyceumSuggestions(undefined, { enabled })
  const sortedLyceums = useMemo(
    () => getManualLyceumOptions(query.data),
    [query.data],
  )
  const lyceumTownGroups = useMemo(
    () => groupManualLyceumsByTown(sortedLyceums),
    [sortedLyceums],
  )

  return {
    ...query,
    lyceumTownGroups,
  }
}
