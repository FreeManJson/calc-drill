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

function getRandomDigitNumber(
  minDigits: number,
  maxDigits: number,
  randomSource: RandomSource,
) {
  const digits = getRandomInteger(minDigits, maxDigits, randomSource)
  const min = digits === 1 ? 1 : 10 ** (digits - 1)
  const max = 10 ** digits - 1

  return getRandomInteger(min, max, randomSource)
}

function getEasyAddition(randomSource: RandomSource): DrillQuestion {
  const left = getRandomInteger(1, 9, randomSource)
  const right = getRandomInteger(1, 9, randomSource)

  return {
    left,
    right,
    operation: 'addition',
    answer: left + right,
  }
}

function getNormalAddition(randomSource: RandomSource): DrillQuestion {
  const left = getRandomInteger(10, 99, randomSource)
  const right =
    getRandomInteger(0, 1, randomSource) === 0
      ? getRandomInteger(1, 9, randomSource)
      : getRandomInteger(10, 99, randomSource)

  return {
    left,
    right,
    operation: 'addition',
    answer: left + right,
  }
}

function getHardAddition(randomSource: RandomSource): DrillQuestion {
  const left = getRandomDigitNumber(2, 4, randomSource)
  const right = getRandomDigitNumber(1, 3, randomSource)

  return {
    left,
    right,
    operation: 'addition',
    answer: left + right,
  }
}

function getExpertAddition(randomSource: RandomSource): DrillQuestion {
  const left = getRandomDigitNumber(3, 4, randomSource)
  const right = getRandomDigitNumber(2, 4, randomSource)

  return {
    left,
    right,
    operation: 'addition',
    answer: left + right,
  }
}

function getAdditionQuestion(
  difficulty: Difficulty,
  randomSource: RandomSource,
) {
  switch (difficulty) {
    case 'normal':
      return getNormalAddition(randomSource)
    case 'hard':
      return getHardAddition(randomSource)
    case 'expert':
      return getExpertAddition(randomSource)
    case 'easy':
    default:
      return getEasyAddition(randomSource)
  }
}

function getEasySubtraction(randomSource: RandomSource): DrillQuestion {
  const answer = getRandomInteger(0, 9, randomSource)
  const right = getRandomInteger(1, 9, randomSource)
  const left = answer + right

  return {
    left,
    right,
    operation: 'subtraction',
    answer,
  }
}

function getNormalSubtraction(randomSource: RandomSource): DrillQuestion {
  const left = getRandomInteger(10, 99, randomSource)
  const right =
    getRandomInteger(0, 1, randomSource) === 0
      ? getRandomInteger(1, Math.min(9, left), randomSource)
      : getRandomInteger(10, left, randomSource)

  return {
    left,
    right,
    operation: 'subtraction',
    answer: left - right,
  }
}

function getHardSubtraction(randomSource: RandomSource): DrillQuestion {
  const left = getRandomDigitNumber(2, 4, randomSource)
  const maxRightDigits = Math.min(3, String(left).length)
  let right = getRandomDigitNumber(1, maxRightDigits, randomSource)

  if (right > left) {
    right = getRandomInteger(1, left, randomSource)
  }

  return {
    left,
    right,
    operation: 'subtraction',
    answer: left - right,
  }
}

function getExpertSubtraction(randomSource: RandomSource): DrillQuestion {
  const left = getRandomDigitNumber(3, 4, randomSource)
  const right = getRandomInteger(1, left, randomSource)

  return {
    left,
    right,
    operation: 'subtraction',
    answer: left - right,
  }
}

function getSubtractionQuestion(
  difficulty: Difficulty,
  randomSource: RandomSource,
) {
  switch (difficulty) {
    case 'normal':
      return getNormalSubtraction(randomSource)
    case 'hard':
      return getHardSubtraction(randomSource)
    case 'expert':
      return getExpertSubtraction(randomSource)
    case 'easy':
    default:
      return getEasySubtraction(randomSource)
  }
}

function createMultiplicationQuestion(left: number, right: number) {
  return {
    left,
    right,
    operation: 'multiplication',
    answer: left * right,
  } satisfies DrillQuestion
}

function getEasyMultiplication(randomSource: RandomSource): DrillQuestion {
  return createMultiplicationQuestion(
    getRandomInteger(1, 5, randomSource),
    getRandomInteger(1, 5, randomSource),
  )
}

function getNormalMultiplication(randomSource: RandomSource): DrillQuestion {
  return createMultiplicationQuestion(
    getRandomInteger(1, 9, randomSource),
    getRandomInteger(1, 9, randomSource),
  )
}

function getHardMultiplication(randomSource: RandomSource): DrillQuestion {
  const shiftPatterns = [
    [1, 1],
    [10, 1],
    [100, 1],
    [10, 10],
    [10, 100],
    [100, 10],
  ] as const
  const [leftScale, rightScale] =
    shiftPatterns[getRandomInteger(0, shiftPatterns.length - 1, randomSource)]

  return createMultiplicationQuestion(
    getRandomInteger(1, 9, randomSource) * leftScale,
    getRandomInteger(1, 9, randomSource) * rightScale,
  )
}

function getExpertMultiplication(randomSource: RandomSource): DrillQuestion {
  const shouldUseShift = getRandomInteger(0, 3, randomSource) === 0

  if (!shouldUseShift) {
    return createMultiplicationQuestion(
      getRandomInteger(1, 12, randomSource),
      getRandomInteger(1, 12, randomSource),
    )
  }

  const shiftPatterns = [
    [10, 1],
    [1, 10],
    [100, 1],
    [1, 100],
    [10, 10],
  ] as const
  const [leftScale, rightScale] =
    shiftPatterns[getRandomInteger(0, shiftPatterns.length - 1, randomSource)]

  return createMultiplicationQuestion(
    getRandomInteger(1, leftScale === 1 ? 12 : 9, randomSource) * leftScale,
    getRandomInteger(1, rightScale === 1 ? 12 : 9, randomSource) * rightScale,
  )
}

function getMultiplicationQuestion(
  difficulty: Difficulty,
  randomSource: RandomSource,
): DrillQuestion {
  switch (difficulty) {
    case 'normal':
      return getNormalMultiplication(randomSource)
    case 'hard':
      return getHardMultiplication(randomSource)
    case 'expert':
      return getExpertMultiplication(randomSource)
    case 'easy':
    default:
      return getEasyMultiplication(randomSource)
  }
}

function createDivisionQuestion(answer: number, right: number) {
  return {
    left: answer * right,
    right,
    operation: 'division',
    answer,
  } satisfies DrillQuestion
}

function getEasyDivision(randomSource: RandomSource): DrillQuestion {
  return createDivisionQuestion(
    getRandomInteger(1, 5, randomSource),
    getRandomInteger(1, 5, randomSource),
  )
}

function getNormalDivision(randomSource: RandomSource): DrillQuestion {
  return createDivisionQuestion(
    getRandomInteger(1, 9, randomSource),
    getRandomInteger(1, 9, randomSource),
  )
}

function getHardDivision(randomSource: RandomSource): DrillQuestion {
  const shouldUseMultipleOfTen = getRandomInteger(0, 2, randomSource) === 0

  if (shouldUseMultipleOfTen) {
    for (let attempt = 0; attempt < 8; attempt += 1) {
      const answer =
        getRandomInteger(1, 9, randomSource) *
        (getRandomInteger(0, 1, randomSource) === 0 ? 1 : 10)
      const right =
        getRandomInteger(2, 9, randomSource) *
        (getRandomInteger(0, 1, randomSource) === 0 ? 1 : 10)

      if (answer * right <= 999) {
        return createDivisionQuestion(answer, right)
      }
    }

    return createDivisionQuestion(30, 30)
  }

  const right = getRandomInteger(2, 9, randomSource)
  const maxAnswer = Math.max(Math.floor(999 / right), 10)
  const answer = getRandomInteger(10, maxAnswer, randomSource)

  return createDivisionQuestion(answer, right)
}

function getExpertDivision(randomSource: RandomSource): DrillQuestion {
  const shouldUseTwoDigitDivisor = getRandomInteger(0, 1, randomSource) === 0
  const right = shouldUseTwoDigitDivisor
    ? getRandomInteger(10, 99, randomSource)
    : getRandomInteger(2, 12, randomSource)
  const minAnswer = Math.max(Math.ceil(100 / right), 2)
  const maxAnswer = Math.max(Math.floor(9999 / right), minAnswer)
  const answer = getRandomInteger(
    minAnswer,
    Math.min(maxAnswer, 999),
    randomSource,
  )

  return createDivisionQuestion(answer, right)
}

function getDivisionQuestion(
  difficulty: Difficulty,
  randomSource: RandomSource,
): DrillQuestion {
  switch (difficulty) {
    case 'normal':
      return getNormalDivision(randomSource)
    case 'hard':
      return getHardDivision(randomSource)
    case 'expert':
      return getExpertDivision(randomSource)
    case 'easy':
    default:
      return getEasyDivision(randomSource)
  }
}

export function generateQuestion(
  settings: DrillSettings,
  randomSource: RandomSource = Math.random,
): DrillQuestion {
  const operation = getOperation(settings, randomSource)

  if (operation === 'multiplication') {
    return getMultiplicationQuestion(settings.difficulty, randomSource)
  }

  if (operation === 'division') {
    return getDivisionQuestion(settings.difficulty, randomSource)
  }

  return operation === 'addition'
    ? getAdditionQuestion(settings.difficulty, randomSource)
    : getSubtractionQuestion(settings.difficulty, randomSource)
}

export function formatQuestion(question: DrillQuestion) {
  return `${question.left} ${OPERATION_SYMBOLS[question.operation]} ${question.right}`
}
