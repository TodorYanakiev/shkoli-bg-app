import { useMemo } from 'react'

import type { ApiError } from '../../../../types/api'
import type { UserResponse } from '../../../../types/users'

const MAX_SUGGESTIONS = 8

type UseLyceumLecturerSuggestionsOptions = {
  users?: UserResponse[]
  trimmedEmailValue: string
  isUsersLoading: boolean
  usersError: ApiError | null
}

type LyceumLecturerSuggestionsResult = {
  suggestionEmails: string[]
  suggestionMessageKey: string | null
  suggestionMessageTone: string
}

export const useLyceumLecturerSuggestions = ({
  users,
  trimmedEmailValue,
  isUsersLoading,
  usersError,
}: UseLyceumLecturerSuggestionsOptions): LyceumLecturerSuggestionsResult => {
  const suggestionEmails = useMemo(() => {
    if (!users) {
      return []
    }
    const emails = users
      .map((user) => user.email)
      .filter((email): email is string => Boolean(email))
    const filtered = trimmedEmailValue
      ? emails.filter((email) =>
          email.toLowerCase().includes(trimmedEmailValue),
        )
      : emails
    const uniqueEmails = Array.from(new Set(filtered))
    return uniqueEmails.slice(0, MAX_SUGGESTIONS)
  }, [users, trimmedEmailValue])

  const usersCount = users?.length ?? 0
  const suggestionMessageKey = useMemo(() => {
    if (isUsersLoading) {
      return 'pages.lyceums.edit.lecturers.suggestions.loading'
    }
    if (usersError) {
      return 'pages.lyceums.edit.lecturers.suggestions.error'
    }
    if (!trimmedEmailValue) {
      return 'pages.lyceums.edit.lecturers.suggestions.hint'
    }
    if (usersCount === 0 || suggestionEmails.length === 0) {
      return 'pages.lyceums.edit.lecturers.suggestions.empty'
    }
    return null
  }, [
    isUsersLoading,
    usersError,
    trimmedEmailValue,
    usersCount,
    suggestionEmails.length,
  ])

  const suggestionMessageTone = usersError
    ? 'text-rose-600'
    : usersCount === 0 || suggestionEmails.length === 0
      ? 'text-amber-700'
      : 'text-slate-500'

  return {
    suggestionEmails,
    suggestionMessageKey,
    suggestionMessageTone,
  }
}
