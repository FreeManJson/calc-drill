export const STORAGE_KEYS = {
  settings: 'calc-drill:settings',
  scoreSummary: 'calc-drill:score-summary',
} as const

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]
