import { useTimedPlay } from '../hooks/useTimedPlay'
import { formatQuestion } from '../services/questionGenerator'
import type { DrillSettings } from '../types/drill'

type PlayPageProps = {
  settings: DrillSettings
}

export function PlayPage({ settings }: PlayPageProps) {
  const play = useTimedPlay(settings)

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
          <form
            className="answer-form"
            onSubmit={(event) => {
              event.preventDefault()
              play.submitAnswer()
            }}
          >
            <p className="question-preview__formula">
              {formatQuestion(play.currentQuestion)}
            </p>
            <label className="field">
              <span>Answer</span>
              <input
                autoComplete="off"
                inputMode="numeric"
                onChange={(event) =>
                  play.setAnswerInput(event.currentTarget.value)
                }
                value={play.answerInput}
              />
            </label>
            {play.feedback !== null && (
              <p className="feedback" role="status">
                {play.feedback.message}
              </p>
            )}
            <div className="play-actions">
              <button className="primary-button" type="submit">
                Submit
              </button>
              <button onClick={play.finish} type="button">
                Finish
              </button>
            </div>
          </form>
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
