export const SURVIVAL_RULE_VERSION = 2
export const SURVIVAL_INITIAL_TIME_SECONDS = 10
export const SURVIVAL_MAX_TIME_SECONDS = 30
export const SURVIVAL_BASE_BONUS_SECONDS = 3
export const SURVIVAL_BONUS_DECAY_SECONDS = 0.1
export const SURVIVAL_LEVEL_UP_EVERY_CORRECT_COUNT = 3
export const SURVIVAL_MIN_BONUS_SECONDS = 0.5
export const SURVIVAL_MAX_LEVEL = 26
export const SURVIVAL_WRONG_PENALTY_SECONDS = 0

export function getSurvivalLevel(correctCount: number) {
  const normalizedCorrectCount = Math.max(Math.trunc(correctCount), 0)

  return Math.min(
    SURVIVAL_MAX_LEVEL,
    Math.floor(normalizedCorrectCount / SURVIVAL_LEVEL_UP_EVERY_CORRECT_COUNT) + 1,
  )
}

export function getSurvivalBonusSeconds(correctCount: number) {
  const level = getSurvivalLevel(correctCount)
  const bonus =
    SURVIVAL_BASE_BONUS_SECONDS -
    (level - 1) * SURVIVAL_BONUS_DECAY_SECONDS

  return Math.max(SURVIVAL_MIN_BONUS_SECONDS, Math.round(bonus * 10) / 10)
}

export function getSurvivalBonusMs(correctCount: number) {
  return Math.round(getSurvivalBonusSeconds(correctCount) * 1000)
}
