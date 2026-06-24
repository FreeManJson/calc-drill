import { t } from '../i18n/messages'
import type { ScoreSummary } from '../types/drill'

type ScorePageProps = {
  scoreSummary: ScoreSummary
}

export function ScorePage({ scoreSummary }: ScorePageProps) {
  const latestResult = scoreSummary.latestResult

  return (
    <section className="page">
      <h1>{t.score.title}</h1>
      <div className="score-panel">
        <dl className="result-summary">
          <div>
            <dt>{t.score.totalPlays}</dt>
            <dd>{scoreSummary.totalPlayCount}</dd>
          </div>
          <div>
            <dt>{t.score.best}</dt>
            <dd>{scoreSummary.bestCorrectCount}</dd>
          </div>
          <div>
            <dt>{t.score.latestScore}</dt>
            <dd>
              {latestResult === null
                ? t.common.noData
                : `${latestResult.correctCount} / ${latestResult.totalCount}`}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
