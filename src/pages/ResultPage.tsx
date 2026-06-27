import type { AppMessages } from '../i18n/messages'
import { formatQuestion } from '../services/questionGenerator'
import type { AnswerRecord, DrillQuestion, PlayResult } from '../types/drill'

type ResultPageProps = {
  messages: AppMessages
  result: PlayResult | null
}

function formatDuration(durationMs: number, t: AppMessages) {
  return t.common.formatSeconds(Math.round(durationMs / 1000))
}

function formatNullableAnswer(answer: number | null, t: AppMessages) {
  return answer === null ? t.common.noData : String(answer)
}

type QuestionResultRow = {
  answers: string[]
  correctAnswer: string
  elapsedMs: number
  mistakeCount: number
  question: DrillQuestion
}

function isSameQuestion(left: DrillQuestion, right: DrillQuestion) {
  return (
    left.left === right.left &&
    left.right === right.right &&
    left.operation === right.operation &&
    left.answer === right.answer
  )
}

function createQuestionResultRow(
  records: AnswerRecord[],
  previousAnsweredAtMs: number,
  t: AppMessages,
): QuestionResultRow {
  const lastRecord = records[records.length - 1]

  return {
    answers: records.map((record) => formatNullableAnswer(record.userAnswer, t)),
    correctAnswer: String(lastRecord.question.answer),
    elapsedMs: Math.max(lastRecord.answeredAtMs - previousAnsweredAtMs, 0),
    mistakeCount: records.filter((record) => !record.isCorrect).length,
    question: lastRecord.question,
  }
}

function createQuestionResultRows(
  answers: PlayResult['answers'],
  t: AppMessages,
) {
  const rows: QuestionResultRow[] = []
  let currentRecords: AnswerRecord[] = []
  let previousAnsweredAtMs = 0

  answers.forEach((answer) => {
    const currentQuestion = currentRecords[0]?.question

    if (
      currentQuestion !== undefined &&
      !isSameQuestion(currentQuestion, answer.question)
    ) {
      rows.push(createQuestionResultRow(currentRecords, previousAnsweredAtMs, t))
      previousAnsweredAtMs =
        currentRecords[currentRecords.length - 1]?.answeredAtMs ?? previousAnsweredAtMs
      currentRecords = []
    }

    currentRecords.push(answer)

    if (answer.isCorrect) {
      rows.push(createQuestionResultRow(currentRecords, previousAnsweredAtMs, t))
      previousAnsweredAtMs = answer.answeredAtMs
      currentRecords = []
    }
  })

  if (currentRecords.length > 0) {
    rows.push(createQuestionResultRow(currentRecords, previousAnsweredAtMs, t))
  }

  return rows
}

export function ResultPage({ messages: t, result }: ResultPageProps) {
  const questionResultRows =
    result === null ? [] : createQuestionResultRows(result.answers, t)
  const mistakeCount =
    result === null
      ? 0
      : result.answers.filter((answer) => !answer.isCorrect).length
  const accuracy =
    result === null || result.totalCount === 0
      ? t.common.noData
      : `${Math.round((result.correctCount / result.totalCount) * 100)}%`
  const averageAnswerTime =
    result === null || result.totalCount === 0
      ? t.common.noData
      : t.result.formatAnswerTime(result.durationMs / result.totalCount)

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
              <dt>{t.result.totalAnswers}</dt>
              <dd>{result.totalCount}</dd>
            </div>
            <div>
              <dt>{t.result.mistakes}</dt>
              <dd>{mistakeCount}</dd>
            </div>
            <div>
              <dt>{t.result.accuracy}</dt>
              <dd>{accuracy}</dd>
            </div>
            <div>
              <dt>{t.result.duration}</dt>
              <dd>{formatDuration(result.durationMs, t)}</dd>
            </div>
            <div>
              <dt>{t.result.averageAnswerTime}</dt>
              <dd>{averageAnswerTime}</dd>
            </div>
          </dl>

          <div className="answer-history">
            <h2>{t.result.answerHistory}</h2>
            {questionResultRows.length === 0 ? (
              <p className="empty-message">{t.result.noAnswers}</p>
            ) : (
              <div className="answer-history__table-scroll">
                <table className="answer-history__table">
                  <thead>
                    <tr>
                      <th scope="col">{t.result.historyNumber}</th>
                      <th scope="col">{t.result.historyQuestion}</th>
                      <th scope="col">{t.result.historyYourAnswer}</th>
                      <th scope="col">{t.result.historyCorrectAnswer}</th>
                      <th scope="col">{t.result.mistakes}</th>
                      <th scope="col">{t.result.historyTime}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questionResultRows.map((row, index) => (
                      <tr
                        className={
                          row.mistakeCount > 0
                            ? 'answer-history__row--missed'
                            : 'answer-history__row--clear'
                        }
                        key={`${formatQuestion(row.question)}-${index}`}
                      >
                        <td>{index + 1}</td>
                        <td>{formatQuestion(row.question)}</td>
                        <td>
                          <span className="answer-history__answer-flow">
                            {row.answers.map((answer, answerIndex) => (
                              <span key={`${answer}-${answerIndex}`}>
                                {answerIndex === 0 ? answer : `→ ${answer}`}
                              </span>
                            ))}
                          </span>
                        </td>
                        <td>{row.correctAnswer}</td>
                        <td>{row.mistakeCount}</td>
                        <td>{t.result.formatAnswerTime(row.elapsedMs)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
