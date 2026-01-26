import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import type { TFunction } from 'i18next'

import type { LyceumResponse } from '../../../../types/lyceums'
import {
  getLyceumUpdateSchema,
  type LyceumUpdateFormValues,
} from '../validations/lyceumUpdateSchema'

type UseLyceumEditFormOptions = {
  lyceum?: LyceumResponse
  t: TFunction
}

export const useLyceumEditForm = ({ lyceum, t }: UseLyceumEditFormOptions) => {
  const schema = useMemo(() => getLyceumUpdateSchema(t), [t])
  const form = useForm<LyceumUpdateFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      town: '',
      status: '',
      bulstat: '',
      registrationNumber: '',
      address: '',
      region: '',
      municipality: '',
      latitude: '',
      longitude: '',
      phone: '',
      email: '',
      urlToLibrariesSite: '',
      chitalishtaUrl: '',
      chairman: '',
      secretary: '',
    },
  })

  useEffect(() => {
    if (!lyceum) return
    form.reset({
      name: lyceum.name ?? '',
      town: lyceum.town ?? '',
      status: lyceum.status ?? '',
      bulstat: lyceum.bulstat ?? '',
      registrationNumber: lyceum.registrationNumber?.toString() ?? '',
      address: lyceum.address ?? '',
      region: lyceum.region ?? '',
      municipality: lyceum.municipality ?? '',
      latitude: lyceum.latitude?.toString() ?? '',
      longitude: lyceum.longitude?.toString() ?? '',
      phone: lyceum.phone ?? '',
      email: lyceum.email ?? '',
      urlToLibrariesSite: lyceum.urlToLibrariesSite ?? '',
      chitalishtaUrl: lyceum.chitalishtaUrl ?? '',
      chairman: lyceum.chairman ?? '',
      secretary: lyceum.secretary ?? '',
    })
  }, [lyceum, form])

  return {
    form,
  }
}
