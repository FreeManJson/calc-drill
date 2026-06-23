import { DEFAULT_SETTINGS } from '../constants/defaults'
import type {
  DrillQuestion,
  DrillSettings,
  OperationType,
} from '../types/drill'

const BEGINNER_MIN = 1
const BEGINNER_MAX = 9

const OPERATION_SYMBOLS: Record<OperationType, string> = {
  addition: '+',
  subtraction: '-',
}

type RandomSource = () => number

function getRandomInteger(
  min: number,
  max: number,
  randomSource: RandomSource,
) {
  const randomValue = Math.min(Math.max(randomSource(), 0), 0.999999999)
  return Math.floor(randomValue * (max - min + 1)) + min
}

function getOperation(
  settings: DrillSettings,
  randomSource: RandomSource,
): OperationType {
  const operations =
    settings.operations.length > 0
      ? settings.operations
      : DEFAULT_SETTINGS.operations
  const operationIndex = getRandomInteger(0, operations.length - 1, randomSource)

  return operations[operationIndex] ?? DEFAULT_SETTINGS.operations[0]
}

function getOperands(settings: DrillSettings, randomSource: RandomSource) {
  const left = getRandomInteger(BEGINNER_MIN, BEGINNER_MAX, randomSource)
  const right = getRandomInteger(BEGINNER_MIN, BEGINNER_MAX, randomSource)

  if (settings.allowNegativeAnswers || left >= right) {
    return { left, right }
  }

  return { left: right, right: left }
}

export function generateQuestion(
  settings: DrillSettings,
  randomSource: RandomSource = Math.random,
): DrillQuestion {
  const operation = getOperation(settings, randomSource)
  const { left, right } = getOperands(settings, randomSource)
  const answer = operation === 'addition' ? left + right : left - right

  return {
    left,
    right,
    operation,
    answer,
  }
}

export function formatQuestion(question: DrillQuestion) {
  return `${question.left} ${OPERATION_SYMBOLS[question.operation]} ${question.right}`
}
