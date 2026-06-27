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

function getAnswerElapsedMs(
  answers: PlayResult['answers'],
  index: number,
) {
  const currentAnsweredAtMs = answers[index]?.answeredAtMs ?? 0
  const previousAnsweredAtMs =
    index === 0 ? 0 : answers[index - 1]?.answeredAtMs ?? 0

  return Math.max(currentAnsweredAtMs - previousAnsweredAtMs, 0)
}

function formatNullableAnswer(answer: number | null, t: AppMessages) {
  return answer === null ? t.common.noData : String(answer)
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
            <h2>{t.result.answerHistory}</h2>
            {result.answers.length === 0 ? (
              <p className="empty-message">{t.result.noAnswers}</p>
            ) : (
              <ol className="answer-history__list">
                {result.answers.map((answer, index) => (
                  <li
                    className={[
                      'answer-history__item',
                      answer.isCorrect
                        ? 'answer-history__item--correct'
                        : 'answer-history__item--incorrect',
                    ].join(' ')}
                    key={`${answer.answeredAtMs}-${index}`}
                  >
                    <div className="answer-history__header">
                      <span className="answer-history__number">
                        {t.result.historyNumber} {index + 1}
                      </span>
                      <span
                        className={[
                          'answer-history__badge',
                          answer.isCorrect
                            ? 'answer-history__badge--correct'
                            : 'answer-history__badge--incorrect',
                        ].join(' ')}
                      >
                        {answer.isCorrect ? t.result.resultOk : t.result.resultNg}
                      </span>
                    </div>
                    <dl className="answer-history__details">
                      <div>
                        <dt>{t.result.historyQuestion}</dt>
                        <dd>{formatQuestion(answer.question)}</dd>
                      </div>
                      <div>
                        <dt>{t.result.historyYourAnswer}</dt>
                        <dd>{formatNullableAnswer(answer.userAnswer, t)}</dd>
                      </div>
                      <div>
                        <dt>{t.result.historyCorrectAnswer}</dt>
                        <dd>{answer.question.answer}</dd>
                      </div>
                      <div>
                        <dt>{t.result.historyResult}</dt>
                        <dd>
                          {answer.isCorrect
                            ? t.result.correct
                            : t.result.incorrect}
                        </dd>
                      </div>
                      <div>
                        <dt>{t.result.historyTime}</dt>
                        <dd>
                          {t.result.formatAnswerTime(
                            getAnswerElapsedMs(result.answers, index),
                          )}
                        </dd>
                      </div>
                    </dl>
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
