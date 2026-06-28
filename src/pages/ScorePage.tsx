import { useState } from 'react'
import type { AppMessages } from '../i18n/messages'
import { getScoreCategorySummary } from '../services/scoreStorage'
import { OPERATION_TYPES } from '../types/drill'
import type {
  DrillSettings,
  GameMode,
  PlayResult,
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

function getMistakeCount(result: PlayResult) {
  return result.answers.filter((answer) => !answer.isCorrect).length
}

function getResultDurationMs(result: PlayResult) {
  return result.settings.mode === 'survival'
    ? (result.survivalTimeMs ?? result.durationMs)
    : result.durationMs
}

function getAverageAnswerMs(result: PlayResult) {
  return result.totalCount > 0 ? getResultDurationMs(result) / result.totalCount : null
}

function formatResultAccuracy(result: PlayResult, t: AppMessages) {
  return result.totalCount === 0
    ? t.common.noData
    : `${Math.round((result.correctCount / result.totalCount) * 100)}%`
}

function formatCreatedAt(result: PlayResult, t: AppMessages) {
  if (
    typeof result.createdAtMs !== 'number' ||
    !Number.isFinite(result.createdAtMs)
  ) {
    return t.common.noData
  }

  return new Date(result.createdAtMs).toLocaleString()
}

function formatAccuracy(category: ScoreCategorySummary, t: AppMessages) {
  return category.totalAnswerCount === 0
    ? t.common.noData
    : `${Math.round((category.totalCorrectCount / category.totalAnswerCount) * 100)}%`
}

function formatOperations(settings: DrillSettings, t: AppMessages) {
  if (!Array.isArray(settings.operations)) {
    return t.common.noData
  }

  return OPERATION_TYPES.filter((operation) =>
    settings.operations.includes(operation),
  )
    .map((operation) => t.operationLabels[operation])
    .join(' / ') || t.common.noData
}

function formatDifficulty(settings: DrillSettings, t: AppMessages) {
  return t.difficultyLabels[settings.difficulty] ?? t.common.noData
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
  if (category.categoryKey === 'survival-total') {
    return t.score.survivalScores
  }

  const settings = category.latestResult?.settings

  if (settings === undefined) {
    return category.categoryKey
  }

  return [
    formatModeSetting(settings, t),
    formatDifficulty(settings, t),
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
        {isSurvival && (
          <div>
            <dt>{t.score.averageCorrectCount}</dt>
            <dd>{formatDecimal(category.averageCorrectCount)}</dd>
          </div>
        )}
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

function getSurvivalResults(scoreSummary: ScoreSummary) {
  const resultsByKey = new Map<string, PlayResult>()
  const addResult = (result: PlayResult | null | undefined) => {
    if (result?.settings.mode !== 'survival') {
      return
    }

    resultsByKey.set(createSurvivalResultKey(result), result)
  }

  ;(scoreSummary.recentResults ?? []).forEach(addResult)
  Object.values(scoreSummary.byCategory).forEach((category) => {
    addResult(category.latestResult)
  })

  return Array.from(resultsByKey.values()).sort(
    (left, right) => (right.createdAtMs ?? 0) - (left.createdAtMs ?? 0),
  )
}

function createSurvivalResultKey(result: PlayResult) {
  return [
    result.createdAtMs ?? 'unknown',
    result.correctCount,
    result.totalCount,
    result.durationMs,
    getResultDurationMs(result),
    result.settings.difficulty,
    Array.isArray(result.settings.operations)
      ? result.settings.operations.join('+')
      : 'unknown',
  ].join('|')
}

function compareSurvivalBest(left: PlayResult, right: PlayResult) {
  if (left.correctCount !== right.correctCount) {
    return right.correctCount - left.correctCount
  }

  const leftDurationMs = getResultDurationMs(left)
  const rightDurationMs = getResultDurationMs(right)

  if (leftDurationMs !== rightDurationMs) {
    return rightDurationMs - leftDurationMs
  }

  const leftMistakes = getMistakeCount(left)
  const rightMistakes = getMistakeCount(right)

  if (leftMistakes !== rightMistakes) {
    return leftMistakes - rightMistakes
  }

  return (getAverageAnswerMs(left) ?? Number.POSITIVE_INFINITY) -
    (getAverageAnswerMs(right) ?? Number.POSITIVE_INFINITY)
}

function getSurvivalRankMap(results: PlayResult[]) {
  return new Map(
    [...results]
      .sort(compareSurvivalBest)
      .map((result, index) => [createSurvivalResultKey(result), index + 1]),
  )
}

type SurvivalRecordRow = {
  rank: number | null
  result: PlayResult
  typeLabel: string
}

function SurvivalRecordTable({
  messages: t,
  rows,
}: {
  messages: AppMessages
  rows: SurvivalRecordRow[]
}) {
  return (
    <div className="score-history__table-scroll">
      <table className="score-history__table">
        <thead>
          <tr>
            <th scope="col">{t.score.recordType}</th>
            <th scope="col">{t.score.rank}</th>
            <th scope="col">{t.score.dateTime}</th>
            <th scope="col">{t.top.difficulty}</th>
            <th scope="col">{t.top.operations}</th>
            <th scope="col">{t.result.score}</th>
            <th scope="col">{t.result.survivalTime}</th>
            <th scope="col">{t.score.mistakes}</th>
            <th scope="col">{t.score.accuracy}</th>
            <th scope="col">{t.score.averageAnswerTime}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ rank, result, typeLabel }, index) => (
            <tr key={`${typeLabel}-${createSurvivalResultKey(result)}-${index}`}>
              <td>{typeLabel}</td>
              <td>{rank ?? t.common.noData}</td>
              <td>{formatCreatedAt(result, t)}</td>
              <td>{formatDifficulty(result.settings, t)}</td>
              <td>{formatOperations(result.settings, t)}</td>
              <td>{result.correctCount}</td>
              <td>{formatDurationMs(getResultDurationMs(result), t)}</td>
              <td>{getMistakeCount(result)}</td>
              <td>{formatResultAccuracy(result, t)}</td>
              <td>{formatDurationMs(getAverageAnswerMs(result), t)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function SurvivalScorePanel({
  categories,
  messages: t,
  scoreSummary,
}: {
  categories: ScoreCategorySummary[]
  messages: AppMessages
  scoreSummary: ScoreSummary
}) {
  const survivalResults = getSurvivalResults(scoreSummary)
  const rankedSurvivalResults = [...survivalResults].sort(compareSurvivalBest)
  const rankMap = getSurvivalRankMap(survivalResults)
  const bestRecord = rankedSurvivalResults[0] ?? null
  const recentRows: SurvivalRecordRow[] = survivalResults
    .slice(0, 10)
    .map((result, index) => ({
      rank: rankMap.get(createSurvivalResultKey(result)) ?? null,
      result,
      typeLabel:
        index === 0
          ? t.score.recordLatest
          : index === 1
            ? t.score.recordPrevious
            : String(index + 1),
    }))
  const tableRows: SurvivalRecordRow[] =
    bestRecord === null
      ? recentRows
      : [
          {
            rank: rankMap.get(createSurvivalResultKey(bestRecord)) ?? null,
            result: bestRecord,
            typeLabel: t.score.recordBest,
          },
          ...recentRows,
        ]

  if (categories.length === 0) {
    return <p className="empty-message">{t.score.noModeScore}</p>
  }

  return (
    <div className="survival-score">
      <section className="score-section">
        <h4>{t.score.survivalScores}</h4>
        {tableRows.length === 0 ? (
          <p className="empty-message">{t.score.noModeScore}</p>
        ) : (
          <SurvivalRecordTable messages={t} rows={tableRows} />
        )}
      </section>
    </div>
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
              <dd>{formatDifficulty(settings, t)}</dd>
            </div>
            <div>
              <dt>{t.top.operations}</dt>
              <dd>{formatOperations(settings, t)}</dd>
            </div>
          </dl>
        </section>

        {settings.mode !== 'survival' && (
          <section className="score-section">
            <h2>{t.score.currentSettingScore}</h2>
            {activeCurrentCategory === null ? (
              <p className="empty-message">{t.score.noCurrentScore}</p>
            ) : (
              <ScoreCategoryCard category={activeCurrentCategory} messages={t} />
            )}
          </section>
        )}

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
            ) : activeMode === 'survival' ? (
              <SurvivalScorePanel
                categories={activeModeCategories}
                messages={t}
                scoreSummary={scoreSummary}
              />
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
