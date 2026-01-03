export const LYCEUM_TOWNS = [
  'ГРАД БУРГАС',
  'ГРАД ВАРНА',
  'ГРАД ПЛОВДИВ',
  'ГРАД СОФИЯ',
] as const

export type LyceumTown = (typeof LYCEUM_TOWNS)[number]
