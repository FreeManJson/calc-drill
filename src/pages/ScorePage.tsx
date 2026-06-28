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

  return (
    <article className="score-card">
      <h3>{getCategoryTitle(category, t)}</h3>
      <dl className="result-summary">
        <div>
          <dt>{isQuestionGoal ? t.score.bestClearTime : t.score.bestCorrectCount}</dt>
          <dd>{formatBest(category, t)}</dd>
        </div>
        <div>
          <dt>{isQuestionGoal ? t.score.averageClearTime : t.score.averageCorrectCount}</dt>
          <dd>
            {isQuestionGoal
              ? formatDurationMs(category.averageClearTimeMs, t)
              : formatDecimal(category.averageCorrectCount)}
          </dd>
        </div>
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
      </dl>
    </article>
  )
}

function getCategoriesByMode(scoreSummary: ScoreSummary, mode: GameMode) {
  return Object.values(scoreSummary.byCategory).filter(
    (category) => category.latestResult?.settings.mode === mode,
  )
}

export function ScorePage({
  messages: t,
  scoreSummary,
  settings,
}: ScorePageProps) {
  const currentCategory = getScoreCategorySummary(scoreSummary, settings)
  const timeLimitCategories = getCategoriesByMode(scoreSummary, 'timeLimit')
  const questionGoalCategories = getCategoriesByMode(scoreSummary, 'questionGoal')

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
                  : t.top.targetQuestionCount}
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
          {currentCategory === null ? (
            <p className="empty-message">{t.score.noCurrentScore}</p>
          ) : (
            <ScoreCategoryCard category={currentCategory} messages={t} />
          )}
        </section>

        <section className="score-section">
          <h2>{t.score.scoresByMode}</h2>
          <div className="score-mode-group">
            <h3>{t.score.timeLimitMode}</h3>
            {timeLimitCategories.length === 0 ? (
              <p className="empty-message">{t.common.noData}</p>
            ) : (
              <div className="score-card-list">
                {timeLimitCategories.map((category) => (
                  <ScoreCategoryCard
                    category={category}
                    key={category.categoryKey}
                    messages={t}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="score-mode-group">
            <h3>{t.score.questionGoalMode}</h3>
            {questionGoalCategories.length === 0 ? (
              <p className="empty-message">{t.common.noData}</p>
            ) : (
              <div className="score-card-list">
                {questionGoalCategories.map((category) => (
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
