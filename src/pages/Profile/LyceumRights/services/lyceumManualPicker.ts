import type { LyceumResponse } from '../../../../types/lyceums'

export type ManualLyceumOption = {
  name: string
  town: string
}

export type ManualLyceumTownGroup = {
  town: string
  lyceums: ManualLyceumOption[]
}

const textCollator = new Intl.Collator('bg', { sensitivity: 'base' })

const normalizeText = (value?: string) => (value ?? '').trim()

const compareByTownAndName = (
  left: ManualLyceumOption,
  right: ManualLyceumOption,
) => {
  const townOrder = textCollator.compare(left.town, right.town)
  if (townOrder !== 0) {
    return townOrder
  }
  return textCollator.compare(left.name, right.name)
}

export const getManualLyceumOptions = (
  lyceums?: LyceumResponse[],
): ManualLyceumOption[] => {
  if (!lyceums || lyceums.length === 0) {
    return []
  }

  const uniqueOptions = new Map<string, ManualLyceumOption>()

  lyceums.forEach((lyceum) => {
    const name = normalizeText(lyceum.name)
    const town = normalizeText(lyceum.town)
    if (!name || !town) {
      return
    }
    const key = `${town.toLowerCase()}::${name.toLowerCase()}`
    if (!uniqueOptions.has(key)) {
      uniqueOptions.set(key, { name, town })
    }
  })

  return Array.from(uniqueOptions.values()).sort(compareByTownAndName)
}

export const groupManualLyceumsByTown = (
  options: ManualLyceumOption[],
): ManualLyceumTownGroup[] => {
  if (options.length === 0) {
    return []
  }

  const grouped = new Map<string, ManualLyceumOption[]>()

  options.forEach((option) => {
    const townEntries = grouped.get(option.town)
    if (townEntries) {
      townEntries.push(option)
      return
    }
    grouped.set(option.town, [option])
  })

  return Array.from(grouped.entries()).map(([town, lyceums]) => ({
    town,
    lyceums,
  }))
}
