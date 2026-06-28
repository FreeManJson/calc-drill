import type { Language } from '../i18n/messages'

export const GAME_MODES = ['timeLimit', 'questionGoal'] as const
export type GameMode = (typeof GAME_MODES)[number]

export const TARGET_QUESTION_COUNTS = [10, 30, 100] as const
export type TargetQuestionCount = (typeof TARGET_QUESTION_COUNTS)[number]

export const QUESTION_GOAL_TIME_LIMIT_SECONDS = [0, 60, 180, 600] as const
export type QuestionGoalTimeLimitSeconds =
  (typeof QUESTION_GOAL_TIME_LIMIT_SECONDS)[number]

export const DIFFICULTIES = ['easy', 'normal', 'hard', 'expert'] as const
export type Difficulty = (typeof DIFFICULTIES)[number]

export const OPERATION_TYPES = [
  'addition',
  'subtraction',
  'multiplication',
  'division',
] as const
export type OperationType = (typeof OPERATION_TYPES)[number]

export const NUMBER_PAD_LAYOUTS = ['auto', 'bottom', 'side'] as const
export type NumberPadLayout = (typeof NUMBER_PAD_LAYOUTS)[number]

export const BACKGROUND_THEMES = [
  'none',
  'wood',
  'classroom',
  'notebook',
  'blackboard',
] as const
export type BackgroundTheme = (typeof BACKGROUND_THEMES)[number]

export type DrillSettings = {
  mode: GameMode
  timeLimitSeconds: number
  targetQuestionCount: TargetQuestionCount
  questionGoalTimeLimitSeconds: QuestionGoalTimeLimitSeconds
  language: Language
  difficulty: Difficulty
  operations: OperationType[]
  numberPadLayout: NumberPadLayout
  backgroundTheme: BackgroundTheme
  soundEffectsEnabled: boolean
  allowNegativeAnswers: boolean
}

export type DrillQuestion = {
  left: number
  right: number
  operation: OperationType
  answer: number
}

export type AnswerRecord = {
  question: DrillQuestion
  userAnswer: number | null
  isCorrect: boolean
  answeredAtMs: number
}

export type PlayResult = {
  settings: DrillSettings
  correctCount: number
  totalCount: number
  durationMs: number
  answers: AnswerRecord[]
  createdAtMs?: number
  isCleared?: boolean
  isTimeUp?: boolean
}

export type ScoreCategorySummary = {
  averageClearTimeMs: number | null
  averageCorrectCount: number
  averageAnswerMs: number | null
  bestClearTimeMs: number | null
  bestCorrectCount: number
  categoryKey: string
  latestResult: PlayResult | null
  mistakeCount: number
  playCount: number
  totalAnswerCount: number
  totalClearTimeMs: number
  totalCorrectCount: number
}

export type ScoreSummary = {
  bestCorrectCount: number
  byCategory: Record<string, ScoreCategorySummary>
  totalPlayCount: number
  latestResult: PlayResult | null
}
