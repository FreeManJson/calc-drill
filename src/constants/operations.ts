import type { OperationType } from '../types/drill'

export const FREE_OPERATION_TYPES: OperationType[] = [
  'addition',
  'subtraction',
]

export const LOCKED_OPERATION_TYPES: OperationType[] = [
  'multiplication',
  'division',
]

export function isOperationUnlocked(operation: OperationType) {
  return FREE_OPERATION_TYPES.includes(operation) || import.meta.env.DEV
}

export function isLockedOperation(operation: OperationType) {
  return LOCKED_OPERATION_TYPES.includes(operation)
}

export function getUnlockedOperations(operations: OperationType[]) {
  return operations.filter(isOperationUnlocked)
}
