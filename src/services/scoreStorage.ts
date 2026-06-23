import { DEFAULT_SCORE_SUMMARY } from '../constants/defaults'
import { STORAGE_KEYS } from '../constants/storageKeys'
import type { PlayResult, ScoreSummary } from '../types/drill'

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

  return {
    bestCorrectCount,
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
  return {
    bestCorrectCount: Math.max(
      currentSummary.bestCorrectCount,
      result.correctCount,
    ),
    totalPlayCount: currentSummary.totalPlayCount + 1,
    latestResult: result,
  }
}
