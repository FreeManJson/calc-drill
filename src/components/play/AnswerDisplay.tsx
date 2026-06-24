import { t } from '../../i18n/messages'

type AnswerDisplayProps = {
  value: string
}

export function AnswerDisplay({ value }: AnswerDisplayProps) {
  return (
    <div
      className="answer-display"
      aria-label={value === '' ? t.play.noAnswerEntered : t.play.answerValue(value)}
      aria-live="polite"
    >
      <span className="answer-display__label">{t.play.answer}</span>
      <span className="answer-display__value">{value}</span>
    </div>
  )
}
