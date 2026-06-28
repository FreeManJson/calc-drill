import {
  isLockedOperation,
  isOperationUnlocked,
} from '../constants/operations'
import type { AppMessages } from '../i18n/messages'
import { getScoreCategorySummary } from '../services/scoreStorage'
import {
  DIFFICULTIES,
  GAME_MODES,
  OPERATION_TYPES,
  QUESTION_GOAL_TIME_LIMIT_SECONDS,
  TARGET_QUESTION_COUNTS,
} from '../types/drill'
import type {
  Difficulty,
  DrillSettings,
  GameMode,
  QuestionGoalTimeLimitSeconds,
  ScoreSummary,
  TargetQuestionCount,
} from '../types/drill'

type TopPageProps = {
  messages: AppMessages
  onSettingsChange: (settings: DrillSettings) => void
  onStartPlay: () => void
  scoreSummary: ScoreSummary
  settings: DrillSettings
}

const TIME_LIMIT_COURSE_SECONDS = [10, 30] as const

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

function formatQuestionGoalTimeLimit(
  questionGoalTimeLimitSeconds: QuestionGoalTimeLimitSeconds,
  t: AppMessages,
) {
  switch (questionGoalTimeLimitSeconds) {
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

function getTimeLimitOptions(settings: DrillSettings) {
  const options = [...TIME_LIMIT_COURSE_SECONDS]

  if (!options.includes(settings.timeLimitSeconds as 10 | 30)) {
    return [...options, settings.timeLimitSeconds].sort((left, right) => left - right)
  }

  return options
}

export function TopPage({
  messages: t,
  onSettingsChange,
  onStartPlay,
  scoreSummary,
  settings,
}: TopPageProps) {
  const updateSettings = (nextSettings: Partial<DrillSettings>) => {
    onSettingsChange({ ...settings, ...nextSettings })
  }

  const handleModeChange = (mode: GameMode) => {
    updateSettings({ mode })
  }

  const handleDifficultyChange = (difficulty: Difficulty) => {
    updateSettings({ difficulty })
  }

  const handleTimeLimitChange = (timeLimitSeconds: number) => {
    updateSettings({ timeLimitSeconds })
  }

  const handleTargetQuestionCountChange = (
    targetQuestionCount: TargetQuestionCount,
  ) => {
    updateSettings({ targetQuestionCount })
  }

  const handleQuestionGoalTimeLimitChange = (
    questionGoalTimeLimitSeconds: QuestionGoalTimeLimitSeconds,
  ) => {
    updateSettings({ questionGoalTimeLimitSeconds })
  }

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
              : formatQuestionGoalTimeLimit(
                  settings.questionGoalTimeLimitSeconds ?? 0,
                  t,
                )}
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

      <section className="play-start-panel" aria-labelledby="play-start-title">
        <h2 id="play-start-title">{t.top.playSettings}</h2>

        <fieldset className="field-group">
          <legend>{t.top.mode}</legend>
          <div className="choice-grid">
            {GAME_MODES.map((mode) => (
              <label className="check-field choice-card" key={mode}>
                <input
                  checked={settings.mode === mode}
                  name="topMode"
                  onChange={() => handleModeChange(mode)}
                  type="radio"
                  value={mode}
                />
                <span>{t.gameModeLabels[mode]}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="field-group">
          <legend>{t.top.difficulty}</legend>
          <div className="choice-grid">
            {DIFFICULTIES.map((difficulty) => (
              <label className="check-field choice-card" key={difficulty}>
                <input
                  checked={settings.difficulty === difficulty}
                  name="topDifficulty"
                  onChange={() => handleDifficultyChange(difficulty)}
                  type="radio"
                  value={difficulty}
                />
                <span>{t.difficultyLabels[difficulty]}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {settings.mode === 'timeLimit' ? (
          <fieldset className="field-group">
            <legend>{t.top.timeLimit}</legend>
            <div className="choice-grid">
              {getTimeLimitOptions(settings).map((timeLimitSeconds) => (
                <label className="check-field choice-card" key={timeLimitSeconds}>
                  <input
                    checked={settings.timeLimitSeconds === timeLimitSeconds}
                    name="topTimeLimitSeconds"
                    onChange={() => handleTimeLimitChange(timeLimitSeconds)}
                    type="radio"
                    value={timeLimitSeconds}
                  />
                  <span>{t.common.formatSeconds(timeLimitSeconds)}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ) : (
          <>
            <fieldset className="field-group">
              <legend>{t.top.targetQuestionCount}</legend>
              <div className="choice-grid">
                {TARGET_QUESTION_COUNTS.map((targetQuestionCount) => (
                  <label
                    className="check-field choice-card"
                    key={targetQuestionCount}
                  >
                    <input
                      checked={
                        settings.targetQuestionCount === targetQuestionCount
                      }
                      name="topTargetQuestionCount"
                      onChange={() =>
                        handleTargetQuestionCountChange(targetQuestionCount)
                      }
                      type="radio"
                      value={targetQuestionCount}
                    />
                    <span>
                      {t.settings.fixedTargetQuestionCount(targetQuestionCount)}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="field-group">
              <legend>{t.settings.questionGoalTimeLimit}</legend>
              <div className="choice-grid">
                {QUESTION_GOAL_TIME_LIMIT_SECONDS.map(
                  (questionGoalTimeLimitSeconds) => (
                    <label
                      className="check-field choice-card"
                      key={questionGoalTimeLimitSeconds}
                    >
                      <input
                        checked={
                          (settings.questionGoalTimeLimitSeconds ?? 0) ===
                          questionGoalTimeLimitSeconds
                        }
                        name="topQuestionGoalTimeLimitSeconds"
                        onChange={() =>
                          handleQuestionGoalTimeLimitChange(
                            questionGoalTimeLimitSeconds,
                          )
                        }
                        type="radio"
                        value={questionGoalTimeLimitSeconds}
                      />
                      <span>
                        {formatQuestionGoalTimeLimit(
                          questionGoalTimeLimitSeconds,
                          t,
                        )}
                      </span>
                    </label>
                  ),
                )}
              </div>
            </fieldset>
          </>
        )}

        <button className="primary-button" onClick={onStartPlay} type="button">
          {t.top.start}
        </button>
      </section>
    </section>
  )
}
