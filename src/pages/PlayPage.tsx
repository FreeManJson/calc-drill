import { AnswerDisplay } from '../components/play/AnswerDisplay'
import { NumberPad } from '../components/play/NumberPad'
import { QuestionLane } from '../components/play/QuestionLane'
import { StartCountdown } from '../components/play/StartCountdown'
import { useTimedPlay } from '../hooks/useTimedPlay'
import type { AppMessages } from '../i18n/messages'
import type { DrillSettings, PlayResult } from '../types/drill'

type PlayPageProps = {
  messages: AppMessages
  onComplete: (result: PlayResult) => void
  settings: DrillSettings
}

export function PlayPage({ messages: t, onComplete, settings }: PlayPageProps) {
  const play = useTimedPlay(settings, { messages: t, onComplete })
  const answerFormClassName = [
    'answer-form',
    `answer-form--layout-${settings.numberPadLayout}`,
    play.answerEffect === null ? null : `answer-form--${play.answerEffect}`,
  ]
    .filter(Boolean)
    .join(' ')

  const handleNumberPadOk = () => {
    play.submitAnswer()
  }

  return (
    <section className="page">
      <h1>{t.play.title}</h1>
      <div className="play-panel">
        <div className="play-stats" aria-label={t.play.statusLabel}>
          <p>
            {t.play.time}: {t.common.formatSeconds(play.remainingSeconds)}
          </p>
          <p>
            {t.play.score}: {play.correctCount} / {play.totalCount}
          </p>
        </div>

        {play.status === 'idle' && (
          <button className="primary-button" onClick={play.start} type="button">
            {t.play.start(settings.timeLimitSeconds)}
          </button>
        )}

        {play.status === 'countdown' &&
          play.countdownValue !== null &&
          play.currentQuestion !== null && (
            <div className="countdown-panel">
              <StartCountdown value={play.countdownValue} />
              <QuestionLane
                currentQuestion={play.currentQuestion}
                messages={t}
                nextQuestion={play.nextQuestion}
              />
            </div>
        )}

        {play.status === 'playing' && play.currentQuestion !== null && (
          <div className={answerFormClassName}>
            {play.answerEffect !== null && (
              <p
                className={`answer-effect-badge answer-effect-badge--${play.answerEffect}`}
                role="status"
              >
                <span className="answer-effect-badge__mark">
                  {play.answerEffect === 'correct' ? '○' : '×'}
                </span>
                <span>
                  {play.answerEffect === 'correct'
                    ? t.play.correctFeedback
                    : t.play.tryAgainFeedback}
                </span>
              </p>
            )}
            <div className="play-question-area">
              <QuestionLane
                currentQuestion={play.currentQuestion}
                messages={t}
                nextQuestion={play.nextQuestion}
              />
              <AnswerDisplay messages={t} value={play.answerInput} />
            </div>
            <div className="play-input-area">
              <NumberPad
                messages={t}
                onClear={play.clearAnswerInput}
                onDigit={play.appendAnswerDigit}
                onOk={handleNumberPadOk}
              />
            </div>
            {play.feedback !== null && (
              <p className="feedback" role="status">
                {play.feedback.message}
              </p>
            )}
            <div className="play-actions">
              <button onClick={play.finish} type="button">
                {t.play.finish}
              </button>
            </div>
          </div>
        )}

        {play.status === 'finished' && (
          <div className="play-finished">
            <p>{t.play.finished}</p>
            <p>
              {t.play.score}: {play.correctCount} / {play.totalCount}
            </p>
            <button className="primary-button" onClick={play.start} type="button">
              {t.play.retry}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
