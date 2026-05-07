const CYRILLIC_TEXT_PATTERN = /[\u0400-\u04ff]/u

export const getTextLanguage = (
  value: string | null | undefined,
): 'bg' | undefined => {
  if (!value) return undefined
  return CYRILLIC_TEXT_PATTERN.test(value) ? 'bg' : undefined
}
