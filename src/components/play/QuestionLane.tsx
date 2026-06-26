import type { AppMessages } from '../../i18n/messages'
import { formatQuestion } from '../../services/questionGenerator'
import type { DrillQuestion } from '../../types/drill'

type QuestionLaneProps = {
  currentQuestion: DrillQuestion
  messages: AppMessages
  nextQuestion: DrillQuestion | null
}

export function QuestionLane({
  currentQuestion,
  messages: t,
  nextQuestion,
}: QuestionLaneProps) {
  return (
    <div className="question-lane" aria-label={t.play.questionPreview}>
      <section className="question-card question-card--current">
        <span className="question-card__label">{t.play.currentQuestion}</span>
        <span className="question-card__formula">
          {formatQuestion(currentQuestion)}
        </span>
      </section>

      {nextQuestion !== null && (
        <aside
          className="question-card question-card--next"
          aria-label={t.play.nextQuestion}
        >
          <span className="question-card__label">{t.play.nextQuestion}</span>
          <span className="question-card__formula">
            {formatQuestion(nextQuestion)}
          </span>
        </aside>
      )}
    </div>
  )
}
