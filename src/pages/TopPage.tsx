import {
  isLockedOperation,
  isOperationUnlocked,
} from '../constants/operations'
import type { AppMessages } from '../i18n/messages'
import { getScoreCategorySummary } from '../services/scoreStorage'
import { OPERATION_TYPES } from '../types/drill'
import type { DrillSettings, ScoreSummary } from '../types/drill'

type TopPageProps = {
  messages: AppMessages
  scoreSummary: ScoreSummary
  settings: DrillSettings
}

function formatCurrentBest(settings: DrillSettings, scoreSummary: ScoreSummary, t: AppMessages) {
  const currentCategory = getScoreCategorySummary(scoreSummary, settings)

  if (currentCategory === null) {
    return t.common.noData
  }

  return settings.mode === 'questionGoal'
    ? currentCategory.bestClearTimeMs === null
      ? t.common.noData
      : t.result.formatAnswerTime(currentCategory.bestClearTimeMs)
    : String(currentCategory.bestCorrectCount)
}

function formatQuestionGoalTimeLimit(settings: DrillSettings, t: AppMessages) {
  switch (settings.questionGoalTimeLimitSeconds ?? 0) {
    case 0:
      return t.settings.questionGoalNoTimeLimit
    case 60:
      return t.settings.questionGoalTimeLimit1Minute
    case 180:
      return t.settings.questionGoalTimeLimit3Minutes
    case 600:
      return t.settings.questionGoalTimeLimit10Minutes
  }
}

export function TopPage({ messages: t, scoreSummary, settings }: TopPageProps) {
  return (
    <section className="page">
      <h1>{t.top.title}</h1>
      <p className="page-description">
        {settings.mode === 'questionGoal'
          ? t.top.questionGoalDescription(settings.targetQuestionCount)
          : t.top.description(settings.timeLimitSeconds)}
      </p>
      <dl className="settings-summary">
        <div>
          <dt>{t.top.mode}</dt>
          <dd>{t.gameModeLabels[settings.mode]}</dd>
        </div>
        <div>
          <dt>{t.top.timeLimit}</dt>
          <dd>
            {settings.mode === 'timeLimit'
              ? t.common.formatSeconds(settings.timeLimitSeconds)
              : formatQuestionGoalTimeLimit(settings, t)}
          </dd>
        </div>
        {settings.mode === 'questionGoal' && (
          <div>
            <dt>{t.top.targetQuestionCount}</dt>
            <dd>{t.settings.fixedTargetQuestionCount(settings.targetQuestionCount)}</dd>
          </div>
        )}
        <div>
          <dt>{t.top.difficulty}</dt>
          <dd>{t.difficultyLabels[settings.difficulty]}</dd>
        </div>
        <div>
          <dt>{t.top.currentBest}</dt>
          <dd>{formatCurrentBest(settings, scoreSummary, t)}</dd>
        </div>
        <div>
          <dt>{t.top.operations}</dt>
          <dd>
            <ul className="operation-summary">
              {OPERATION_TYPES.map((operation) => {
                const isSelected = settings.operations.includes(operation)
                const isUnlocked = isOperationUnlocked(operation)
                const isDevUnlocked =
                  import.meta.env.DEV && isLockedOperation(operation)

                return (
                  <li key={operation}>
                    <span>{t.operationLabels[operation]}</span>
                    <span className="operation-summary__status">
                      {isSelected
                        ? t.common.selected
                        : isDevUnlocked
                          ? t.common.devUnlock
                          : isUnlocked
                            ? t.common.off
                            : t.common.locked}
                    </span>
                  </li>
                )
              })}
            </ul>
          </dd>
        </div>
      </dl>
    </section>
  )
}
