type AnswerDisplayProps = {
  value: string
}

export function AnswerDisplay({ value }: AnswerDisplayProps) {
  return (
    <div
      className="answer-display"
      aria-label={value === '' ? 'No answer entered' : `Answer ${value}`}
      aria-live="polite"
    >
      <span className="answer-display__label">Answer</span>
      <span className="answer-display__value">{value}</span>
    </div>
  )
}
