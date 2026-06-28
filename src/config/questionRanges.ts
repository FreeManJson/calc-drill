import type { Difficulty } from '../types/drill'

export type NumberRange = {
  max: number
  min: number
}

export type MultiplicationRangeConfig = {
  base: NumberRange
  placeShiftScalePairs: readonly (readonly [number, number])[]
}

export type QuestionRangeConfig = {
  addition: {
    left: NumberRange
    maxAnswer?: number
    right: NumberRange
  }
  division: {
    useMultiplicationRange: true
  }
  multiplication: MultiplicationRangeConfig
  subtraction: {
    left: NumberRange
    minAnswer: number
    right: NumberRange
  }
}

export const QUESTION_RANGE_CONFIGS: Record<Difficulty, QuestionRangeConfig> = {
  easy: {
    addition: {
      left: { min: 1, max: 9 },
      right: { min: 0, max: 9 },
      maxAnswer: 10,
    },
    subtraction: {
      left: { min: 1, max: 9 },
      right: { min: 0, max: 9 },
      minAnswer: 0,
    },
    multiplication: {
      base: { min: 1, max: 5 },
      placeShiftScalePairs: [[1, 1]],
    },
    division: {
      useMultiplicationRange: true,
    },
  },
  normal: {
    addition: {
      left: { min: 0, max: 9 },
      right: { min: 0, max: 9 },
    },
    subtraction: {
      left: { min: 0, max: 19 },
      right: { min: 0, max: 9 },
      minAnswer: 0,
    },
    multiplication: {
      base: { min: 1, max: 9 },
      placeShiftScalePairs: [[1, 1]],
    },
    division: {
      useMultiplicationRange: true,
    },
  },
  hard: {
    addition: {
      left: { min: 0, max: 99 },
      right: { min: 0, max: 99 },
    },
    subtraction: {
      left: { min: 0, max: 99 },
      right: { min: 0, max: 99 },
      minAnswer: 0,
    },
    multiplication: {
      base: { min: 1, max: 9 },
      placeShiftScalePairs: [
//        [1, 1],
//        [10, 1],
//        [100, 1],
//        [10, 10],
//        [10, 100],
//        [100, 10],
        [1, 1],
        [1, 1],
        [1, 1],
        [1, 1],
        [10, 1],
        [10, 1],
        [10, 10],
        [1, 10],
        [1, 10],
      ],
    },
    division: {
      useMultiplicationRange: true,
    },
  },
  expert: {
    addition: {
      left: { min: 0, max: 999 },
      right: { min: 0, max: 999 },
    },
    subtraction: {
      left: { min: 0, max: 999 },
      right: { min: 0, max: 999 },
      minAnswer: 0,
    },
    multiplication: {
      base: { min: 1, max: 12 },
      placeShiftScalePairs: [
//        [1, 1],
//        [10, 1],
//        [1, 10],
//        [100, 1],
//        [1, 100],
//        [10, 10],
        [1, 1],
        [1, 1],
        [1, 1],
        [1, 1],
        [10, 1],
        [10, 1],
        [10, 10],
        [1, 10],
        [1, 10],
      ],
    },
    division: {
      useMultiplicationRange: true,
    },
  },
}

