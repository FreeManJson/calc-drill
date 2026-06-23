import { useEffect, useState } from 'react'
import { generateQuestion } from '../services/questionGenerator'
import type {
  AnswerRecord,
  DrillQuestion,
  DrillSettings,
} from '../types/drill'

const INCORRECT_FEEDBACK_MS = 700

export type PlayStatus = 'idle' | 'playing' | 'finished'

type Feedback = {
  isCorrect: boolean
  message: string
} | null

export function useTimedPlay(settings: DrillSettings) {
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

  const correctCount = answers.filter((answer) => answer.isCorrect).length

  useEffect(() => {
    if (status !== 'playing' || feedback !== null) {
      return
    }

    const intervalId = window.setInterval(() => {
      setRemainingSeconds((currentSeconds) => {
        if (currentSeconds <= 1) {
          setStatus('finished')
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
    setRemainingSeconds(settings.timeLimitSeconds)
    setFeedback(null)
    setStartedAtMs(Date.now())
  }

  const finish = () => {
    setStatus('finished')
    setFeedback(null)
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

    setAnswers((currentAnswers) => [...currentAnswers, answerRecord])
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
