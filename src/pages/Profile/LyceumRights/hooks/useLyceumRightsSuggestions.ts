import { useMemo } from 'react'

import { useLyceumSuggestions } from './useLyceumSuggestions'

type UseLyceumRightsSuggestionsOptions = {
  selectedTown: string
  isRequestLocked: boolean
  shouldFetchSuggestions: boolean
}

type LyceumRightsSuggestionsResult = {
  suggestionNames: string[]
  suggestionMessageKey: string | null
  suggestionMessageTone: string
  isSuggestionsLoading: boolean
}

export const useLyceumRightsSuggestions = ({
  selectedTown,
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
    if (!Array.isArray(lyceumSuggestions)) {
      return []
    }
    const names = lyceumSuggestions
      .map((lyceum) => lyceum.name)
      .filter((name): name is string => Boolean(name))
    return Array.from(new Set(names))
  }, [lyceumSuggestions])

  const suggestionMessageKey = useMemo(() => {
    if (isRequestLocked) {
      return null
    }
    const hasSelectedTown = Boolean(selectedTown.trim())
    if (!hasSelectedTown) {
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
    return 'pages.profile.lyceumRights.request.suggestions.hint'
  }, [
    isRequestLocked,
    selectedTown,
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
    isSuggestionsLoading,
  }
}
