import { FREE_OPERATION_TYPES } from './operations'
import { DEFAULT_LANGUAGE } from '../i18n/messages'
import type { DrillSettings, ScoreSummary } from '../types/drill'

export const DEFAULT_TIME_LIMIT_SECONDS = 30

export const DEFAULT_SETTINGS: DrillSettings = {
  mode: 'timeLimit',
  timeLimitSeconds: DEFAULT_TIME_LIMIT_SECONDS,
  language: DEFAULT_LANGUAGE,
  difficulty: 'beginner',
  operations: [...FREE_OPERATION_TYPES],
  numberPadLayout: 'auto',
  backgroundTheme: 'none',
  allowNegativeAnswers: false,
}

export const DEFAULT_SCORE_SUMMARY: ScoreSummary = {
  bestCorrectCount: 0,
  totalPlayCount: 0,
  latestResult: null,
}
