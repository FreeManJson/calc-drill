import type { ScoreSummary } from '../types/drill'

type ScorePageProps = {
  scoreSummary: ScoreSummary
}

export function ScorePage({ scoreSummary }: ScorePageProps) {
  const latestResult = scoreSummary.latestResult

  return (
    <section className="page">
      <h1>Score</h1>
      <div className="score-panel">
        <dl className="result-summary">
          <div>
            <dt>Total plays</dt>
            <dd>{scoreSummary.totalPlayCount}</dd>
          </div>
          <div>
            <dt>Best correct count</dt>
            <dd>{scoreSummary.bestCorrectCount}</dd>
          </div>
          <div>
            <dt>Latest score</dt>
            <dd>
              {latestResult === null
                ? '-'
                : `${latestResult.correctCount} / ${latestResult.totalCount}`}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
