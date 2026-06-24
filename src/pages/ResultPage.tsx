import type { AppMessages } from '../i18n/messages'
import { formatQuestion } from '../services/questionGenerator'
import type { PlayResult } from '../types/drill'

type ResultPageProps = {
  messages: AppMessages
  result: PlayResult | null
}

function formatDuration(durationMs: number, t: AppMessages) {
  return t.common.formatSeconds(Math.round(durationMs / 1000))
}

export function ResultPage({ messages: t, result }: ResultPageProps) {
  return (
    <section className="page">
      <h1>{t.result.title}</h1>
      {result === null ? (
        <p className="empty-message">{t.result.noResult}</p>
      ) : (
        <div className="result-panel">
          <dl className="result-summary">
            <div>
              <dt>{t.result.score}</dt>
              <dd>
                {result.correctCount} / {result.totalCount}
              </dd>
            </div>
            <div>
              <dt>{t.result.duration}</dt>
              <dd>{formatDuration(result.durationMs, t)}</dd>
            </div>
            <div>
              <dt>{t.result.timeLimit}</dt>
              <dd>
                {t.common.formatSeconds(result.settings.timeLimitSeconds)}
              </dd>
            </div>
          </dl>

          <div className="answer-history">
            <h2>{t.result.answers}</h2>
            {result.answers.length === 0 ? (
              <p className="empty-message">{t.result.noAnswers}</p>
            ) : (
              <ol>
                {result.answers.map((answer, index) => (
                  <li key={`${answer.answeredAtMs}-${index}`}>
                    <span>{formatQuestion(answer.question)}</span>
                    <span>{t.result.yourAnswer(answer.userAnswer)}</span>
                    <span>
                      {answer.isCorrect ? t.result.correct : t.result.incorrect}
                    </span>
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
