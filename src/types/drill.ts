import type { Language } from '../i18n/messages'

export const GAME_MODES = ['timeLimit', 'questionGoal'] as const
export type GameMode = (typeof GAME_MODES)[number]

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
  targetQuestionCount: number
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
}

export type ScoreSummary = {
  bestCorrectCount: number
  totalPlayCount: number
  latestResult: PlayResult | null
}
