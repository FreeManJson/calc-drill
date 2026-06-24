import { formatQuestion } from '../../services/questionGenerator'
import type { DrillQuestion } from '../../types/drill'

type QuestionLaneProps = {
  currentQuestion: DrillQuestion
  nextQuestion: DrillQuestion | null
}

export function QuestionLane({
  currentQuestion,
  nextQuestion,
}: QuestionLaneProps) {
  return (
    <div className="question-lane" aria-label="Question preview">
      <section className="question-card question-card--current">
        <span className="question-card__label">Current</span>
        <span className="question-card__formula">
          {formatQuestion(currentQuestion)}
        </span>
      </section>

      {nextQuestion !== null && (
        <section className="question-card question-card--next">
          <span className="question-card__label">Next</span>
          <span className="question-card__formula">
            {formatQuestion(nextQuestion)}
          </span>
        </section>
      )}
    </div>
  )
}
