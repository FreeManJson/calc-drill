export const GAME_MODES = ['timeLimit'] as const
export type GameMode = (typeof GAME_MODES)[number]

export const DIFFICULTIES = ['beginner'] as const
export type Difficulty = (typeof DIFFICULTIES)[number]

export const OPERATION_TYPES = ['addition', 'subtraction'] as const
export type OperationType = (typeof OPERATION_TYPES)[number]

export type DrillSettings = {
  mode: GameMode
  timeLimitSeconds: number
  difficulty: Difficulty
  operations: OperationType[]
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
