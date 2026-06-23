import { AnswerDisplay } from '../components/play/AnswerDisplay'
import { NumberPad } from '../components/play/NumberPad'
import { useTimedPlay } from '../hooks/useTimedPlay'
import { formatQuestion } from '../services/questionGenerator'
import type { DrillSettings, PlayResult } from '../types/drill'

type PlayPageProps = {
  onComplete: (result: PlayResult) => void
  settings: DrillSettings
}

export function PlayPage({ onComplete, settings }: PlayPageProps) {
  const play = useTimedPlay(settings, { onComplete })
  const handleNumberPadOk = () => {
    play.submitAnswer()
  }

  return (
    <section className="page">
      <h1>Play</h1>
      <div className="play-panel">
        <div className="play-stats" aria-label="Play status">
          <p>Time: {play.remainingSeconds}s</p>
          <p>
            Score: {play.correctCount} / {play.totalCount}
          </p>
        </div>

        {play.status === 'idle' && (
          <button className="primary-button" onClick={play.start} type="button">
            Start
          </button>
        )}

        {play.status === 'playing' && play.currentQuestion !== null && (
          <div className="answer-form">
            <p className="question-preview__formula">
              {formatQuestion(play.currentQuestion)}
            </p>
            <AnswerDisplay value={play.answerInput} />
            <NumberPad
              onClear={play.clearAnswerInput}
              onDigit={play.appendAnswerDigit}
              onOk={handleNumberPadOk}
            />
            {play.feedback !== null && (
              <p className="feedback" role="status">
                {play.feedback.message}
              </p>
            )}
            <div className="play-actions">
              <button onClick={play.finish} type="button">
                Finish
              </button>
            </div>
          </div>
        )}

        {play.status === 'finished' && (
          <div className="play-finished">
            <p>Finished</p>
            <p>
              Score: {play.correctCount} / {play.totalCount}
            </p>
            <button className="primary-button" onClick={play.start} type="button">
              Retry
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
