import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import type { TFunction } from 'i18next'

import type {
  OAuth2CompleteProfileFormValues,
  OAuth2PendingFieldName,
} from '../types'
import { getOAuth2CompleteProfileSchema } from '../validations/oauth2CompleteProfileSchema'

type UseOAuth2CompleteProfileFormParams = {
  missingFields: OAuth2PendingFieldName[]
  t: TFunction
}

export const useOAuth2CompleteProfileForm = ({
  missingFields,
  t,
}: UseOAuth2CompleteProfileFormParams) => {
  const schema = useMemo(
    () => getOAuth2CompleteProfileSchema(t, missingFields),
    [missingFields, t],
  )

  return useForm<OAuth2CompleteProfileFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: '',
      email: '',
      firstname: '',
      lastname: '',
      description: '',
    },
  })
}
