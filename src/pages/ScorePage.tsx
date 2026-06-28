import { useState } from 'react'
import type { AppMessages } from '../i18n/messages'
import { getScoreCategorySummary } from '../services/scoreStorage'
import { OPERATION_TYPES } from '../types/drill'
import type {
  DrillSettings,
  GameMode,
  ScoreCategorySummary,
  ScoreSummary,
} from '../types/drill'

type ScorePageProps = {
  messages: AppMessages
  scoreSummary: ScoreSummary
  settings: DrillSettings
}

const SCORE_MODE_TABS = ['timeLimit', 'questionGoal', 'survival'] as const

function formatDurationMs(durationMs: number | null, t: AppMessages) {
  return durationMs === null
    ? t.common.noData
    : t.result.formatAnswerTime(durationMs)
}

function formatDecimal(value: number) {
  return value.toFixed(1)
}

function formatAccuracy(category: ScoreCategorySummary, t: AppMessages) {
  return category.totalAnswerCount === 0
    ? t.common.noData
    : `${Math.round((category.totalCorrectCount / category.totalAnswerCount) * 100)}%`
}

function formatOperations(settings: DrillSettings, t: AppMessages) {
  return OPERATION_TYPES.filter((operation) =>
    settings.operations.includes(operation),
  )
    .map((operation) => t.operationLabels[operation])
    .join(' / ')
}

function formatModeSetting(settings: DrillSettings, t: AppMessages) {
  if (settings.mode === 'timeLimit') {
    return t.common.formatSeconds(settings.timeLimitSeconds)
  }

  if (settings.mode === 'survival') {
    return t.gameModeLabels.survival
  }

  const questionCount = t.settings.fixedTargetQuestionCount(
    settings.targetQuestionCount,
  )

  switch (settings.questionGoalTimeLimitSeconds ?? 0) {
    case 0:
      return `${questionCount} / ${t.settings.questionGoalNoTimeLimit}`
    case 60:
      return `${questionCount} / ${t.settings.questionGoalTimeLimit1Minute}`
    case 180:
      return `${questionCount} / ${t.settings.questionGoalTimeLimit3Minutes}`
    case 600:
      return `${questionCount} / ${t.settings.questionGoalTimeLimit10Minutes}`
  }
}

function formatBest(category: ScoreCategorySummary, t: AppMessages) {
  return category.latestResult?.settings.mode === 'questionGoal'
    ? formatDurationMs(category.bestClearTimeMs, t)
    : String(category.bestCorrectCount)
}

function formatQuestionGoalStatus(category: ScoreCategorySummary, t: AppMessages) {
  const latestResult = category.latestResult

  if (latestResult?.settings.mode !== 'questionGoal') {
    return t.common.noData
  }

  const isCleared =
    latestResult.isCleared ??
    latestResult.correctCount >= latestResult.settings.targetQuestionCount

  if (isCleared) {
    return t.result.clear
  }

  return latestResult.isTimeUp === true ? t.result.timeUp : t.result.notCleared
}

function getCategoryTitle(category: ScoreCategorySummary, t: AppMessages) {
  const settings = category.latestResult?.settings

  if (settings === undefined) {
    return category.categoryKey
  }

  return [
    formatModeSetting(settings, t),
    t.difficultyLabels[settings.difficulty],
    formatOperations(settings, t),
  ].join(' / ')
}

function ScoreCategoryCard({
  category,
  messages: t,
}: {
  category: ScoreCategorySummary
  messages: AppMessages
}) {
  const isQuestionGoal = category.latestResult?.settings.mode === 'questionGoal'
  const isSurvival = category.latestResult?.settings.mode === 'survival'

  return (
    <article className="score-card">
      <h3>{getCategoryTitle(category, t)}</h3>
      <dl className="result-summary">
        <div>
          <dt>{isQuestionGoal ? t.score.bestClearTime : t.score.bestCorrectCount}</dt>
          <dd>{formatBest(category, t)}</dd>
        </div>
        <div>
          <dt>
            {isSurvival
              ? t.score.longestSurvivalTime
              : isQuestionGoal
                ? t.score.averageClearTime
                : t.score.averageCorrectCount}
          </dt>
          <dd>
            {isSurvival
              ? formatDurationMs(category.bestClearTimeMs, t)
              : isQuestionGoal
              ? formatDurationMs(category.averageClearTimeMs, t)
              : formatDecimal(category.averageCorrectCount)}
          </dd>
        </div>
        {isSurvival && (
          <div>
            <dt>{t.score.averageSurvivalTime}</dt>
            <dd>{formatDurationMs(category.averageClearTimeMs, t)}</dd>
          </div>
        )}
        <div>
          <dt>{t.score.plays}</dt>
          <dd>{category.playCount}</dd>
        </div>
        <div>
          <dt>{t.score.mistakes}</dt>
          <dd>{category.mistakeCount}</dd>
        </div>
        <div>
          <dt>{t.score.accuracy}</dt>
          <dd>{formatAccuracy(category, t)}</dd>
        </div>
        <div>
          <dt>{t.score.averageAnswerTime}</dt>
          <dd>{formatDurationMs(category.averageAnswerMs, t)}</dd>
        </div>
        {isQuestionGoal && (
          <div>
            <dt>{t.result.status}</dt>
            <dd>{formatQuestionGoalStatus(category, t)}</dd>
          </div>
        )}
      </dl>
    </article>
  )
}

function getCategoriesByMode(scoreSummary: ScoreSummary, mode: GameMode) {
  return Object.values(scoreSummary.byCategory)
    .filter((category) => category.latestResult?.settings.mode === mode)
    .sort(
      (left, right) =>
        (right.latestResult?.createdAtMs ?? 0) -
        (left.latestResult?.createdAtMs ?? 0),
    )
}

function getInitialScoreMode(
  scoreSummary: ScoreSummary,
  settings: DrillSettings,
): GameMode {
  const latestMode = scoreSummary.latestResult?.settings.mode

  if (
    latestMode === 'timeLimit' ||
    latestMode === 'questionGoal' ||
    latestMode === 'survival'
  ) {
    return latestMode
  }

  if (
    settings.mode === 'timeLimit' ||
    settings.mode === 'questionGoal' ||
    settings.mode === 'survival'
  ) {
    return settings.mode
  }

  return 'timeLimit'
}

function getModeTitle(mode: GameMode, t: AppMessages) {
  switch (mode) {
    case 'timeLimit':
      return t.score.timeLimitMode
    case 'questionGoal':
      return t.score.questionGoalMode
    case 'survival':
      return t.score.survivalMode
  }
}

export function ScorePage({
  messages: t,
  scoreSummary,
  settings,
}: ScorePageProps) {
  const [activeMode, setActiveMode] = useState<GameMode>(() =>
    getInitialScoreMode(scoreSummary, settings),
  )
  const currentCategory = getScoreCategorySummary(scoreSummary, settings)
  const activeModeCategories = getCategoriesByMode(scoreSummary, activeMode)
  const activeCurrentCategory =
    settings.mode === activeMode ? currentCategory : null

  return (
    <section className="page">
      <h1>{t.score.title}</h1>
      <div className="score-panel">
        <section className="score-section">
          <h2>{t.score.currentSettings}</h2>
          <dl className="settings-summary">
            <div>
              <dt>{t.top.mode}</dt>
              <dd>{t.gameModeLabels[settings.mode]}</dd>
            </div>
            <div>
              <dt>
                {settings.mode === 'timeLimit'
                  ? t.top.timeLimit
                  : settings.mode === 'questionGoal'
                    ? t.top.targetQuestionCount
                    : t.top.mode}
              </dt>
              <dd>{formatModeSetting(settings, t)}</dd>
            </div>
            <div>
              <dt>{t.top.difficulty}</dt>
              <dd>{t.difficultyLabels[settings.difficulty]}</dd>
            </div>
            <div>
              <dt>{t.top.operations}</dt>
              <dd>{formatOperations(settings, t)}</dd>
            </div>
          </dl>
        </section>

        <section className="score-section">
          <h2>{t.score.currentSettingScore}</h2>
          {activeCurrentCategory === null ? (
            <p className="empty-message">{t.score.noCurrentScore}</p>
          ) : (
            <ScoreCategoryCard category={activeCurrentCategory} messages={t} />
          )}
        </section>

        <section className="score-section">
          <h2>{t.score.scoresByMode}</h2>
          <div className="score-tabs" role="tablist" aria-label={t.score.scoresByMode}>
            {SCORE_MODE_TABS.map((mode) => (
              <button
                aria-selected={activeMode === mode}
                className="score-tab"
                key={mode}
                onClick={() => setActiveMode(mode)}
                role="tab"
                type="button"
              >
                {t.gameModeLabels[mode]}
              </button>
            ))}
          </div>

          <div className="score-mode-group" role="tabpanel">
            <h3>{getModeTitle(activeMode, t)}</h3>
            {activeModeCategories.length === 0 ? (
              <p className="empty-message">{t.score.noModeScore}</p>
            ) : (
              <div className="score-card-list">
                {activeModeCategories.map((category) => (
                  <ScoreCategoryCard
                    category={category}
                    key={category.categoryKey}
                    messages={t}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </section>
  )
}
