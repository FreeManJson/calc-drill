import { OPERATION_TYPES } from '../types/drill'
import type { DrillSettings, ScoreSummary } from '../types/drill'

export const DEFAULT_TIME_LIMIT_SECONDS = 30

export const DEFAULT_SETTINGS: DrillSettings = {
  mode: 'timeLimit',
  timeLimitSeconds: DEFAULT_TIME_LIMIT_SECONDS,
  difficulty: 'beginner',
  operations: [...OPERATION_TYPES],
  allowNegativeAnswers: false,
}

export const DEFAULT_SCORE_SUMMARY: ScoreSummary = {
  bestCorrectCount: 0,
  totalPlayCount: 0,
  latestResult: null,
}
