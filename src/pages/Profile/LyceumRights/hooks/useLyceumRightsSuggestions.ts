import { useMemo } from 'react'

import { useLyceumSuggestions } from './useLyceumSuggestions'

const MAX_SUGGESTIONS = 8

type UseLyceumRightsSuggestionsOptions = {
  selectedTown: string
  lyceumNameValue: string
  trimmedLyceumName: string
  isRequestLocked: boolean
  shouldFetchSuggestions: boolean
}

type LyceumRightsSuggestionsResult = {
  suggestionNames: string[]
  suggestionMessageKey: string | null
  suggestionMessageTone: string
}

export const useLyceumRightsSuggestions = ({
  selectedTown,
  lyceumNameValue,
  trimmedLyceumName,
  isRequestLocked,
  shouldFetchSuggestions,
}: UseLyceumRightsSuggestionsOptions): LyceumRightsSuggestionsResult => {
  const {
    data: lyceumSuggestions,
    isLoading: isSuggestionsLoading,
    isError: isSuggestionsError,
  } = useLyceumSuggestions(selectedTown, {
    enabled: shouldFetchSuggestions,
  })

  const suggestionNames = useMemo(() => {
    if (!lyceumSuggestions) {
      return []
    }
    const query = lyceumNameValue.trim().toLowerCase()
    const normalizedTown = selectedTown.trim().toLowerCase()
    const suggestionsByTown = normalizedTown
      ? lyceumSuggestions.filter(
          (lyceum) =>
            (lyceum.town ?? '').trim().toLowerCase() === normalizedTown,
        )
      : lyceumSuggestions
    const names = suggestionsByTown
      .map((lyceum) => lyceum.name)
      .filter((name): name is string => Boolean(name))
    const filtered = query
      ? names.filter((name) => name.toLowerCase().includes(query))
      : names
    const uniqueNames = Array.from(new Set(filtered))
    return uniqueNames.slice(0, MAX_SUGGESTIONS)
  }, [selectedTown, lyceumSuggestions, lyceumNameValue])

  const suggestionMessageKey = useMemo(() => {
    if (isRequestLocked) {
      return null
    }
    const hasSelectedTown = Boolean(selectedTown)
    if (!hasSelectedTown && !trimmedLyceumName) {
      return 'pages.profile.lyceumRights.request.suggestions.selectTown'
    }
    if (isSuggestionsLoading) {
      return 'pages.profile.lyceumRights.request.suggestions.loading'
    }
    if (isSuggestionsError) {
      return 'pages.profile.lyceumRights.request.suggestions.error'
    }
    if (shouldFetchSuggestions && suggestionNames.length === 0) {
      return 'pages.profile.lyceumRights.request.suggestions.empty'
    }
    if (!trimmedLyceumName) {
      return 'pages.profile.lyceumRights.request.suggestions.hint'
    }
    return null
  }, [
    isRequestLocked,
    selectedTown,
    trimmedLyceumName,
    isSuggestionsLoading,
    isSuggestionsError,
    shouldFetchSuggestions,
    suggestionNames.length,
  ])

  const suggestionMessageTone = isSuggestionsError
    ? 'text-rose-600'
    : shouldFetchSuggestions && suggestionNames.length === 0
      ? 'text-amber-700'
      : 'text-slate-500'

  return {
    suggestionNames,
    suggestionMessageKey,
    suggestionMessageTone,
  }
}
