import { useCallback, useEffect, useRef, useState } from 'react'
import {
  playCorrectSound,
  playIncorrectSound,
} from '../services/feedbackEffects'
import type { AppMessages } from '../i18n/messages'
import { generateQuestion } from '../services/questionGenerator'
import type {
  AnswerRecord,
  DrillQuestion,
  DrillSettings,
  PlayResult,
} from '../types/drill'

const INCORRECT_FEEDBACK_MS = 700
const ANSWER_EFFECT_MS = 220
const COUNTDOWN_STEP_MS = 400
const COUNTDOWN_VALUES = ['3', '2', '1', 'Go'] as const

export type PlayStatus = 'idle' | 'countdown' | 'playing' | 'finished'
export type AnswerEffect = 'correct' | 'incorrect' | null
export type CountdownValue = (typeof COUNTDOWN_VALUES)[number]

type Feedback = {
  isCorrect: boolean
  message: string
} | null

type UseTimedPlayOptions = {
  messages: AppMessages
  onComplete: (result: PlayResult) => void
}

export function useTimedPlay(
  settings: DrillSettings,
  { messages: t, onComplete }: UseTimedPlayOptions,
) {
  const [status, setStatus] = useState<PlayStatus>('idle')
  const [currentQuestion, setCurrentQuestion] = useState<DrillQuestion | null>(
    null,
  )
  const [nextQuestion, setNextQuestion] = useState<DrillQuestion | null>(null)
  const [answerInput, setAnswerInput] = useState('')
  const [answers, setAnswers] = useState<AnswerRecord[]>([])
  const [countdownValue, setCountdownValue] = useState<CountdownValue | null>(
    null,
  )
  const [remainingSecondsState, setRemainingSeconds] = useState(
    settings.timeLimitSeconds,
  )
  const [answerEffect, setAnswerEffect] = useState<AnswerEffect>(null)
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [startedAtMs, setStartedAtMs] = useState<number | null>(null)
  const answersRef = useRef<AnswerRecord[]>([])
  const completedRef = useRef(false)
  const onCompleteRef = useRef(onComplete)
  const pauseStartedAtMsRef = useRef<number | null>(null)
  const pausedDurationMsRef = useRef(0)
  const settingsRef = useRef(settings)
  const startedAtMsRef = useRef<number | null>(null)

  const correctCount = answers.filter((answer) => answer.isCorrect).length

  useEffect(() => {
    onCompleteRef.current = onComplete
    settingsRef.current = settings
  }, [onComplete, settings])

  const getPausedDurationMs = useCallback(() => {
    const activePauseMs =
      pauseStartedAtMsRef.current === null
        ? 0
        : Math.max(Date.now() - pauseStartedAtMsRef.current, 0)

    return pausedDurationMsRef.current + activePauseMs
  }, [])

  const completePlay = useCallback(() => {
    if (completedRef.current) {
      return
    }

    completedRef.current = true
    const startedAt = startedAtMsRef.current
    const rawDurationMs =
      startedAt === null
        ? 0
        : Math.max(Date.now() - startedAt - getPausedDurationMs(), 0)
    const maxDurationMs = settingsRef.current.timeLimitSeconds * 1000
    const durationMs = Math.min(rawDurationMs, maxDurationMs)
    const resultAnswers = answersRef.current

    onCompleteRef.current({
      settings: settingsRef.current,
      correctCount: resultAnswers.filter((answer) => answer.isCorrect).length,
      totalCount: resultAnswers.length,
      durationMs,
      answers: resultAnswers,
    })
  }, [getPausedDurationMs])

  useEffect(() => {
    if (status !== 'countdown') {
      return
    }

    let countdownIndex = 0

    const intervalId = window.setInterval(() => {
      countdownIndex += 1

      if (countdownIndex >= COUNTDOWN_VALUES.length) {
        window.clearInterval(intervalId)
        setCountdownValue(null)
        setStatus('playing')
        const now = Date.now()
        setStartedAtMs(now)
        startedAtMsRef.current = now
        return
      }

      setCountdownValue(COUNTDOWN_VALUES[countdownIndex])
    }, COUNTDOWN_STEP_MS)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [status])

  useEffect(() => {
    if (status !== 'playing' || feedback !== null) {
      return
    }

    const intervalId = window.setInterval(() => {
      setRemainingSeconds((currentSeconds) => {
        if (currentSeconds <= 1) {
          setStatus('finished')
          completePlay()
          return 0
        }

        return currentSeconds - 1
      })
    }, 1000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [completePlay, feedback, status])

  useEffect(() => {
    if (feedback === null) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      if (pauseStartedAtMsRef.current !== null) {
        pausedDurationMsRef.current += Math.max(
          Date.now() - pauseStartedAtMsRef.current,
          0,
        )
        pauseStartedAtMsRef.current = null
      }

      setFeedback(null)
    }, INCORRECT_FEEDBACK_MS)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [feedback])

  useEffect(() => {
    if (answerEffect === null) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setAnswerEffect(null)
    }, ANSWER_EFFECT_MS)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [answerEffect])

  const start = () => {
    const firstQuestion = generateQuestion(settings)
    const secondQuestion = generateQuestion(settings)

    setStatus('countdown')
    setCurrentQuestion(firstQuestion)
    setNextQuestion(secondQuestion)
    setAnswerInput('')
    setAnswers([])
    answersRef.current = []
    completedRef.current = false
    pauseStartedAtMsRef.current = null
    pausedDurationMsRef.current = 0
    setRemainingSeconds(settings.timeLimitSeconds)
    setAnswerEffect(null)
    setCountdownValue(COUNTDOWN_VALUES[0])
    setFeedback(null)
    setStartedAtMs(null)
    startedAtMsRef.current = null
  }

  const finish = () => {
    setStatus('finished')
    setFeedback(null)
    completePlay()
  }

  const appendAnswerDigit = (digit: string) => {
    setAnswerInput((currentInput) => `${currentInput}${digit}`)
  }

  const clearAnswerInput = () => {
    setAnswerInput('')
  }

  const submitAnswer = () => {
    if (status !== 'playing' || currentQuestion === null) {
      return
    }

    if (answerInput === '') {
      return
    }

    const userAnswer = Number(answerInput)

    if (!Number.isInteger(userAnswer)) {
      setAnswerEffect('incorrect')
      playIncorrectSound()
      pauseStartedAtMsRef.current = Date.now()
      setFeedback({ isCorrect: false, message: t.play.enterInteger })
      return
    }

    const isCorrect = userAnswer === currentQuestion.answer
    const answeredAtMs =
      startedAtMs === null ? 0 : Math.max(Date.now() - startedAtMs, 0)
    const answerRecord: AnswerRecord = {
      question: currentQuestion,
      userAnswer,
      isCorrect,
      answeredAtMs,
    }

    const nextAnswers = [...answersRef.current, answerRecord]
    answersRef.current = nextAnswers
    setAnswers(nextAnswers)
    setAnswerInput('')

    if (isCorrect) {
      setAnswerEffect('correct')
      playCorrectSound()
      setCurrentQuestion(nextQuestion ?? generateQuestion(settings))
      setNextQuestion(generateQuestion(settings))
      return
    }

    setAnswerEffect('incorrect')
    playIncorrectSound()
    pauseStartedAtMsRef.current = Date.now()
    setAnswerInput('')
    setFeedback({
      isCorrect: false,
      message: t.play.incorrectAnswer(currentQuestion.answer),
    })
  }

  return {
    answerInput,
    answerEffect,
    appendAnswerDigit,
    answers,
    clearAnswerInput,
    countdownValue,
    correctCount,
    currentQuestion,
    feedback,
    nextQuestion,
    remainingSeconds:
      status === 'idle' ? settings.timeLimitSeconds : remainingSecondsState,
    setAnswerInput,
    start,
    status,
    submitAnswer,
    totalCount: answers.length,
    finish,
  }
}
