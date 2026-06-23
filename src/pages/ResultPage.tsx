import { formatQuestion } from '../services/questionGenerator'
import type { PlayResult } from '../types/drill'

type ResultPageProps = {
  result: PlayResult | null
}

function formatDuration(durationMs: number) {
  return `${Math.round(durationMs / 1000)} seconds`
}

export function ResultPage({ result }: ResultPageProps) {
  return (
    <section className="page">
      <h1>Result</h1>
      {result === null ? (
        <p className="empty-message">No play result yet.</p>
      ) : (
        <div className="result-panel">
          <dl className="result-summary">
            <div>
              <dt>Score</dt>
              <dd>
                {result.correctCount} / {result.totalCount}
              </dd>
            </div>
            <div>
              <dt>Duration</dt>
              <dd>{formatDuration(result.durationMs)}</dd>
            </div>
            <div>
              <dt>Time limit</dt>
              <dd>{result.settings.timeLimitSeconds} seconds</dd>
            </div>
          </dl>

          <div className="answer-history">
            <h2>Answers</h2>
            {result.answers.length === 0 ? (
              <p className="empty-message">No answers submitted.</p>
            ) : (
              <ol>
                {result.answers.map((answer, index) => (
                  <li key={`${answer.answeredAtMs}-${index}`}>
                    <span>{formatQuestion(answer.question)}</span>
                    <span>Your answer: {answer.userAnswer}</span>
                    <span>{answer.isCorrect ? 'Correct' : 'Incorrect'}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
