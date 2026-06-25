import { DEFAULT_SETTINGS } from '../constants/defaults'
import { getUnlockedOperations } from '../constants/operations'
import { STORAGE_KEYS } from '../constants/storageKeys'
import { DEFAULT_LANGUAGE, LANGUAGES } from '../i18n/messages'
import type { Language } from '../i18n/messages'
import {
  DIFFICULTIES,
  GAME_MODES,
  NUMBER_PAD_LAYOUTS,
  OPERATION_TYPES,
} from '../types/drill'
import type {
  Difficulty,
  DrillSettings,
  GameMode,
  NumberPadLayout,
  OperationType,
} from '../types/drill'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isGameMode(value: unknown): value is GameMode {
  return GAME_MODES.includes(value as GameMode)
}

function isDifficulty(value: unknown): value is Difficulty {
  return DIFFICULTIES.includes(value as Difficulty)
}

function isLanguage(value: unknown): value is Language {
  return LANGUAGES.includes(value as Language)
}

function isOperationType(value: unknown): value is OperationType {
  return OPERATION_TYPES.includes(value as OperationType)
}

function isNumberPadLayout(value: unknown): value is NumberPadLayout {
  return NUMBER_PAD_LAYOUTS.includes(value as NumberPadLayout)
}

function parseOperations(value: unknown): OperationType[] {
  if (!Array.isArray(value)) {
    return DEFAULT_SETTINGS.operations
  }

  const operations = getUnlockedOperations(value.filter(isOperationType))
  return operations.length > 0 ? operations : DEFAULT_SETTINGS.operations
}

function parseSettings(value: unknown): DrillSettings {
  if (!isRecord(value)) {
    return DEFAULT_SETTINGS
  }

  return {
    mode: isGameMode(value.mode) ? value.mode : DEFAULT_SETTINGS.mode,
    timeLimitSeconds:
      typeof value.timeLimitSeconds === 'number' &&
      Number.isFinite(value.timeLimitSeconds) &&
      value.timeLimitSeconds > 0
        ? Math.trunc(value.timeLimitSeconds)
        : DEFAULT_SETTINGS.timeLimitSeconds,
    language: isLanguage(value.language) ? value.language : DEFAULT_LANGUAGE,
    difficulty: isDifficulty(value.difficulty)
      ? value.difficulty
      : DEFAULT_SETTINGS.difficulty,
    operations: parseOperations(value.operations),
    numberPadLayout: isNumberPadLayout(value.numberPadLayout)
      ? value.numberPadLayout
      : DEFAULT_SETTINGS.numberPadLayout,
    allowNegativeAnswers:
      typeof value.allowNegativeAnswers === 'boolean'
        ? value.allowNegativeAnswers
        : DEFAULT_SETTINGS.allowNegativeAnswers,
  }
}

export function loadSettings(): DrillSettings {
  const rawSettings = localStorage.getItem(STORAGE_KEYS.settings)

  if (rawSettings === null) {
    return DEFAULT_SETTINGS
  }

  try {
    return parseSettings(JSON.parse(rawSettings))
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function saveSettings(settings: DrillSettings) {
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings))
}
