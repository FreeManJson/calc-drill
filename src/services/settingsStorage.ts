import { DEFAULT_SETTINGS } from '../constants/defaults'
import { getUnlockedOperations } from '../constants/operations'
import { STORAGE_KEYS } from '../constants/storageKeys'
import { DEFAULT_LANGUAGE, LANGUAGES } from '../i18n/messages'
import type { Language } from '../i18n/messages'
import {
  BACKGROUND_THEMES,
  DIFFICULTIES,
  GAME_MODES,
  NUMBER_PAD_LAYOUTS,
  OPERATION_TYPES,
} from '../types/drill'
import type {
  BackgroundTheme,
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

function parseDifficulty(value: unknown): Difficulty {
  if (isDifficulty(value)) {
    return value
  }

  switch (value) {
    case 'beginner':
    case 'basic':
    case '初級':
      return 'easy'
    case 'intermediate':
    case 'middle':
    case '中級':
      return 'normal'
    case 'advanced':
    case '上級':
      return 'hard'
    default:
      return DEFAULT_SETTINGS.difficulty
  }
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

function isBackgroundTheme(value: unknown): value is BackgroundTheme {
  return BACKGROUND_THEMES.includes(value as BackgroundTheme)
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
    targetQuestionCount:
      typeof value.targetQuestionCount === 'number' &&
      Number.isFinite(value.targetQuestionCount) &&
      value.targetQuestionCount > 0
        ? Math.trunc(value.targetQuestionCount)
        : DEFAULT_SETTINGS.targetQuestionCount,
    language: isLanguage(value.language) ? value.language : DEFAULT_LANGUAGE,
    difficulty: parseDifficulty(value.difficulty),
    operations: parseOperations(value.operations),
    numberPadLayout: isNumberPadLayout(value.numberPadLayout)
      ? value.numberPadLayout
      : DEFAULT_SETTINGS.numberPadLayout,
    backgroundTheme: isBackgroundTheme(value.backgroundTheme)
      ? value.backgroundTheme
      : DEFAULT_SETTINGS.backgroundTheme,
    soundEffectsEnabled:
      typeof value.soundEffectsEnabled === 'boolean'
        ? value.soundEffectsEnabled
        : DEFAULT_SETTINGS.soundEffectsEnabled,
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
