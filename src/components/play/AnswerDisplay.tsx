import type { AppMessages } from '../../i18n/messages'

type AnswerDisplayProps = {
  messages: AppMessages
  value: string
}

export function AnswerDisplay({ messages: t, value }: AnswerDisplayProps) {
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
