import type { AppMessages } from '../../i18n/messages'
import { formatQuestion } from '../../services/questionGenerator'
import type { DrillQuestion } from '../../types/drill'

type QuestionLaneProps = {
  currentDisplay?: string
  currentQuestion: DrillQuestion | null
  messages: AppMessages
  nextDisplay?: string
  nextQuestion: DrillQuestion | null
}

export function QuestionLane({
  currentDisplay,
  currentQuestion,
  messages: t,
  nextDisplay,
  nextQuestion,
}: QuestionLaneProps) {
  const currentFormula =
    currentDisplay ??
    (currentQuestion === null ? '---' : formatQuestion(currentQuestion))
  const shouldShowNext = nextDisplay !== undefined || nextQuestion !== null
  const nextFormula =
    nextDisplay ?? (nextQuestion === null ? '---' : formatQuestion(nextQuestion))

  return (
    <div className="question-lane" aria-label={t.play.questionPreview}>
      <section className="question-card question-card--current">
        <span className="question-card__label">{t.play.currentQuestion}</span>
        <span className="question-card__formula">{currentFormula}</span>
      </section>

      {shouldShowNext && (
        <aside
          className="question-card question-card--next"
          aria-label={t.play.nextQuestion}
        >
          <span className="question-card__label">{t.play.nextQuestion}</span>
          <span className="question-card__formula">{nextFormula}</span>
        </aside>
      )}
    </div>
  )
}
