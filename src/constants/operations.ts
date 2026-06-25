import type { OperationType } from '../types/drill'

export const FREE_OPERATION_TYPES: OperationType[] = [
  'addition',
  'subtraction',
]

export const LOCKED_OPERATION_TYPES: OperationType[] = [
  'multiplication',
  'division',
]

// TODO: Remove or replace this once real premium unlock handling starts.
export const TEMP_UNLOCK_PREMIUM_OPERATIONS_FOR_QA = true

export function isOperationUnlocked(operation: OperationType) {
  return (
    FREE_OPERATION_TYPES.includes(operation) ||
    TEMP_UNLOCK_PREMIUM_OPERATIONS_FOR_QA ||
    import.meta.env.DEV
  )
}

export function isLockedOperation(operation: OperationType) {
  return LOCKED_OPERATION_TYPES.includes(operation)
}

export function getUnlockedOperations(operations: OperationType[]) {
  return operations.filter(isOperationUnlocked)
}
