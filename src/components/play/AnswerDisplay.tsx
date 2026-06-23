type AnswerDisplayProps = {
  value: string
}

export function AnswerDisplay({ value }: AnswerDisplayProps) {
  return (
    <div className="answer-display" aria-live="polite">
      <span className="answer-display__label">Answer</span>
      <span className="answer-display__value">{value || '0'}</span>
    </div>
  )
}
