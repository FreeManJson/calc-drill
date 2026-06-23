import { OPERATION_TYPES } from '../types/drill'
import type { DrillSettings, ScoreSummary } from '../types/drill'

export const DEFAULT_SETTINGS: DrillSettings = {
  mode: 'timeLimit',
  timeLimitSeconds: 10,
  difficulty: 'beginner',
  operations: [...OPERATION_TYPES],
  allowNegativeAnswers: false,
}

export const DEFAULT_SCORE_SUMMARY: ScoreSummary = {
  bestCorrectCount: 0,
  totalPlayCount: 0,
  latestResult: null,
}
