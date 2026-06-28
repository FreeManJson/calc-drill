import { QUESTION_RANGE_CONFIGS } from '../config/questionRanges'
import { DEFAULT_SETTINGS } from '../constants/defaults'
import type {
  Difficulty,
  DrillQuestion,
  DrillSettings,
  OperationType,
} from '../types/drill'

const OPERATION_SYMBOLS: Record<OperationType, string> = {
  addition: '+',
  subtraction: '-',
  multiplication: '×',
  division: '÷',
}

type RandomSource = () => number

type MultiplicationPair = {
  left: number
  right: number
}

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

function getDifficultyConfig(difficulty: Difficulty) {
  return QUESTION_RANGE_CONFIGS[difficulty] ?? QUESTION_RANGE_CONFIGS.easy
}

function createAdditionQuestion(
  difficulty: Difficulty,
  randomSource: RandomSource,
): DrillQuestion {
  const { addition } = getDifficultyConfig(difficulty)

  for (let attempt = 0; attempt < 16; attempt += 1) {
    const left = getRandomInteger(
      addition.left.min,
      addition.left.max,
      randomSource,
    )
    const right = getRandomInteger(
      addition.right.min,
      addition.right.max,
      randomSource,
    )
    const answer = left + right

    if (addition.maxAnswer === undefined || answer <= addition.maxAnswer) {
      return {
        left,
        right,
        operation: 'addition',
        answer,
      }
    }
  }

  return {
    left: addition.left.min,
    right: addition.right.min,
    operation: 'addition',
    answer: addition.left.min + addition.right.min,
  }
}

function createSubtractionQuestion(
  difficulty: Difficulty,
  randomSource: RandomSource,
): DrillQuestion {
  const { subtraction } = getDifficultyConfig(difficulty)
  const left = getRandomInteger(
    subtraction.left.min,
    subtraction.left.max,
    randomSource,
  )
  const maxRight = Math.min(subtraction.right.max, left - subtraction.minAnswer)
  const right =
    maxRight < subtraction.right.min
      ? subtraction.right.min
      : getRandomInteger(subtraction.right.min, maxRight, randomSource)

  return {
    left,
    right,
    operation: 'subtraction',
    answer: left - right,
  }
}

function createMultiplicationPair(
  difficulty: Difficulty,
  randomSource: RandomSource,
): MultiplicationPair {
  const { multiplication } = getDifficultyConfig(difficulty)
  const [leftScale, rightScale] =
    multiplication.placeShiftScalePairs[
      getRandomInteger(
        0,
        multiplication.placeShiftScalePairs.length - 1,
        randomSource,
      )
    ]

  return {
    left:
      getRandomInteger(
        multiplication.base.min,
        multiplication.base.max,
        randomSource,
      ) * leftScale,
    right:
      getRandomInteger(
        multiplication.base.min,
        multiplication.base.max,
        randomSource,
      ) * rightScale,
  }
}

function createMultiplicationQuestion(
  difficulty: Difficulty,
  randomSource: RandomSource,
): DrillQuestion {
  const { left, right } = createMultiplicationPair(difficulty, randomSource)

  return {
    left,
    right,
    operation: 'multiplication',
    answer: left * right,
  }
}

function createDivisionQuestion(
  difficulty: Difficulty,
  randomSource: RandomSource,
): DrillQuestion {
  const pair = createMultiplicationPair(difficulty, randomSource)
  const product = pair.left * pair.right
  const shouldDivideByLeft = getRandomInteger(0, 1, randomSource) === 0
  const divisor = shouldDivideByLeft ? pair.left : pair.right
  const answer = shouldDivideByLeft ? pair.right : pair.left

  return {
    left: product,
    right: divisor,
    operation: 'division',
    answer,
  }
}

export function generateQuestion(
  settings: DrillSettings,
  randomSource: RandomSource = Math.random,
): DrillQuestion {
  const operation = getOperation(settings, randomSource)

  if (operation === 'addition') {
    return createAdditionQuestion(settings.difficulty, randomSource)
  }

  if (operation === 'subtraction') {
    return createSubtractionQuestion(settings.difficulty, randomSource)
  }

  if (operation === 'multiplication') {
    return createMultiplicationQuestion(settings.difficulty, randomSource)
  }

  return createDivisionQuestion(settings.difficulty, randomSource)
}

export function formatQuestion(question: DrillQuestion) {
  return `${question.left} ${OPERATION_SYMBOLS[question.operation]} ${question.right}`
}

