import { useEffect, useRef, useState } from 'react'
import { generateQuestion } from '../services/questionGenerator'
import type {
  AnswerRecord,
  DrillQuestion,
  DrillSettings,
  PlayResult,
} from '../types/drill'

const INCORRECT_FEEDBACK_MS = 700

export type PlayStatus = 'idle' | 'playing' | 'finished'

type Feedback = {
  isCorrect: boolean
  message: string
} | null

type UseTimedPlayOptions = {
  onComplete: (result: PlayResult) => void
}

export function useTimedPlay(
  settings: DrillSettings,
  { onComplete }: UseTimedPlayOptions,
) {
  const [status, setStatus] = useState<PlayStatus>('idle')
  const [currentQuestion, setCurrentQuestion] = useState<DrillQuestion | null>(
    null,
  )
  const [answerInput, setAnswerInput] = useState('')
  const [answers, setAnswers] = useState<AnswerRecord[]>([])
  const [remainingSecondsState, setRemainingSeconds] = useState(
    settings.timeLimitSeconds,
  )
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [startedAtMs, setStartedAtMs] = useState<number | null>(null)
  const answersRef = useRef<AnswerRecord[]>([])
  const onCompleteRef = useRef(onComplete)
  const settingsRef = useRef(settings)
  const startedAtMsRef = useRef<number | null>(null)

  const correctCount = answers.filter((answer) => answer.isCorrect).length

  useEffect(() => {
    onCompleteRef.current = onComplete
    settingsRef.current = settings
  }, [onComplete, settings])

  const completePlay = () => {
    const startedAt = startedAtMsRef.current
    const durationMs = startedAt === null ? 0 : Math.max(Date.now() - startedAt, 0)
    const resultAnswers = answersRef.current

    onCompleteRef.current({
      settings: settingsRef.current,
      correctCount: resultAnswers.filter((answer) => answer.isCorrect).length,
      totalCount: resultAnswers.length,
      durationMs,
      answers: resultAnswers,
    })
  }

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
  }, [feedback, status])

  useEffect(() => {
    if (feedback === null) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setFeedback(null)
    }, INCORRECT_FEEDBACK_MS)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [feedback])

  const start = () => {
    setStatus('playing')
    setCurrentQuestion(generateQuestion(settings))
    setAnswerInput('')
    setAnswers([])
    answersRef.current = []
    setRemainingSeconds(settings.timeLimitSeconds)
    setFeedback(null)
    const now = Date.now()
    setStartedAtMs(now)
    startedAtMsRef.current = now
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
      setFeedback({ isCorrect: false, message: 'Enter an integer.' })
      return
    }

    const userAnswer = Number(answerInput)

    if (!Number.isInteger(userAnswer)) {
      setFeedback({ isCorrect: false, message: 'Enter an integer.' })
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
      setCurrentQuestion(generateQuestion(settings))
      return
    }

    setFeedback({
      isCorrect: false,
      message: `Incorrect. Answer: ${currentQuestion.answer}`,
    })
  }

  return {
    answerInput,
    appendAnswerDigit,
    answers,
    clearAnswerInput,
    correctCount,
    currentQuestion,
    feedback,
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
