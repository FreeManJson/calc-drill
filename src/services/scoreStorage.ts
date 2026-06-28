import { DEFAULT_SCORE_SUMMARY } from '../constants/defaults'
import { STORAGE_KEYS } from '../constants/storageKeys'
import { OPERATION_TYPES } from '../types/drill'
import type {
  DrillSettings,
  OperationType,
  PlayResult,
  ScoreCategorySummary,
  ScoreSummary,
} from '../types/drill'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isPlayResult(value: unknown): value is PlayResult {
  if (!isRecord(value)) {
    return false
  }

  return (
    isRecord(value.settings) &&
    typeof value.correctCount === 'number' &&
    typeof value.totalCount === 'number' &&
    typeof value.durationMs === 'number' &&
    Array.isArray(value.answers)
  )
}

function getMistakeCount(result: PlayResult) {
  return result.answers.filter((answer) => !answer.isCorrect).length
}

function getOperationKey(operations: OperationType[]) {
  return OPERATION_TYPES.filter((operation) =>
    operations.includes(operation),
  ).join('+')
}

function isClearedQuestionGoal(result: PlayResult) {
  return (
    result.settings.mode === 'questionGoal' &&
    (result.isCleared ??
      result.correctCount >= result.settings.targetQuestionCount)
  )
}

export function createScoreCategoryKey(settings: DrillSettings): string {
  const questionGoalTimeLimitSeconds =
    settings.questionGoalTimeLimitSeconds ?? 0
  const modePart =
    settings.mode === 'timeLimit'
      ? `time:${settings.timeLimitSeconds}`
      : `goal:${settings.targetQuestionCount}:limit:${questionGoalTimeLimitSeconds}`

  return [
    settings.mode,
    modePart,
    settings.difficulty,
    getOperationKey(settings.operations),
  ].join('|')
}

function createEmptyCategorySummary(
  categoryKey: string,
): ScoreCategorySummary {
  return {
    averageClearTimeMs: null,
    averageCorrectCount: 0,
    averageAnswerMs: null,
    bestClearTimeMs: null,
    bestCorrectCount: 0,
    categoryKey,
    latestResult: null,
    mistakeCount: 0,
    playCount: 0,
    totalAnswerCount: 0,
    totalClearTimeMs: 0,
    totalCorrectCount: 0,
  }
}

function isScoreCategorySummary(
  value: unknown,
): value is ScoreCategorySummary {
  return (
    isRecord(value) &&
    typeof value.categoryKey === 'string' &&
    typeof value.playCount === 'number' &&
    typeof value.bestCorrectCount === 'number' &&
    typeof value.averageCorrectCount === 'number' &&
    typeof value.mistakeCount === 'number' &&
    typeof value.totalAnswerCount === 'number' &&
    typeof value.totalClearTimeMs === 'number' &&
    typeof value.totalCorrectCount === 'number'
  )
}

function parseScoreCategories(
  value: unknown,
): Record<string, ScoreCategorySummary> {
  if (!isRecord(value)) {
    return {}
  }

  return Object.fromEntries(
    Object.entries(value).filter((entry): entry is [string, ScoreCategorySummary] =>
      isScoreCategorySummary(entry[1]),
    ),
  )
}

function parseScoreSummary(value: unknown): ScoreSummary {
  if (!isRecord(value)) {
    return DEFAULT_SCORE_SUMMARY
  }

  const bestCorrectCount =
    typeof value.bestCorrectCount === 'number' &&
    Number.isFinite(value.bestCorrectCount)
      ? Math.max(Math.trunc(value.bestCorrectCount), 0)
      : DEFAULT_SCORE_SUMMARY.bestCorrectCount
  const totalPlayCount =
    typeof value.totalPlayCount === 'number' &&
    Number.isFinite(value.totalPlayCount)
      ? Math.max(Math.trunc(value.totalPlayCount), 0)
      : DEFAULT_SCORE_SUMMARY.totalPlayCount
  const latestResult = isPlayResult(value.latestResult)
    ? value.latestResult
    : DEFAULT_SCORE_SUMMARY.latestResult
  const byCategory = parseScoreCategories(value.byCategory)

  return {
    bestCorrectCount,
    byCategory,
    totalPlayCount,
    latestResult,
  }
}

export function loadScoreSummary(): ScoreSummary {
  const rawScoreSummary = localStorage.getItem(STORAGE_KEYS.scoreSummary)

  if (rawScoreSummary === null) {
    return DEFAULT_SCORE_SUMMARY
  }

  try {
    return parseScoreSummary(JSON.parse(rawScoreSummary))
  } catch {
    return DEFAULT_SCORE_SUMMARY
  }
}

export function saveScoreSummary(scoreSummary: ScoreSummary) {
  localStorage.setItem(
    STORAGE_KEYS.scoreSummary,
    JSON.stringify(scoreSummary),
  )
}

export function recordPlayResult(
  currentSummary: ScoreSummary,
  result: PlayResult,
): ScoreSummary {
  const resultWithCreatedAt = {
    ...result,
    createdAtMs: result.createdAtMs ?? Date.now(),
  }
  const categoryKey = createScoreCategoryKey(resultWithCreatedAt.settings)
  const currentCategory =
    currentSummary.byCategory[categoryKey] ??
    createEmptyCategorySummary(categoryKey)
  const playCount = currentCategory.playCount + 1
  const totalCorrectCount =
    currentCategory.totalCorrectCount + resultWithCreatedAt.correctCount
  const totalAnswerCount =
    currentCategory.totalAnswerCount + resultWithCreatedAt.totalCount
  const totalClearTimeMs =
    currentCategory.totalClearTimeMs + resultWithCreatedAt.durationMs
  const mistakeCount = currentCategory.mistakeCount + getMistakeCount(resultWithCreatedAt)
  const isQuestionGoalClear = isClearedQuestionGoal(resultWithCreatedAt)
  const bestClearTimeMs =
    isQuestionGoalClear
      ? currentCategory.bestClearTimeMs === null
        ? resultWithCreatedAt.durationMs
        : Math.min(currentCategory.bestClearTimeMs, resultWithCreatedAt.durationMs)
      : currentCategory.bestClearTimeMs
  const nextCategory: ScoreCategorySummary = {
    ...currentCategory,
    averageClearTimeMs:
      resultWithCreatedAt.settings.mode === 'questionGoal'
        ? totalClearTimeMs / playCount
        : currentCategory.averageClearTimeMs,
    averageCorrectCount: totalCorrectCount / playCount,
    averageAnswerMs:
      totalAnswerCount > 0 ? totalClearTimeMs / totalAnswerCount : null,
    bestClearTimeMs,
    bestCorrectCount: Math.max(
      currentCategory.bestCorrectCount,
      resultWithCreatedAt.correctCount,
    ),
    latestResult: resultWithCreatedAt,
    mistakeCount,
    playCount,
    totalAnswerCount,
    totalClearTimeMs,
    totalCorrectCount,
  }

  return {
    bestCorrectCount: Math.max(
      currentSummary.bestCorrectCount,
      resultWithCreatedAt.correctCount,
    ),
    byCategory: {
      ...currentSummary.byCategory,
      [categoryKey]: nextCategory,
    },
    totalPlayCount: currentSummary.totalPlayCount + 1,
    latestResult: resultWithCreatedAt,
  }
}

export function getScoreCategorySummary(
  scoreSummary: ScoreSummary,
  settings: DrillSettings,
) {
  return scoreSummary.byCategory[createScoreCategoryKey(settings)] ?? null
}
