import { useCallback, useEffect, useRef, useState } from 'react'
import {
  playCorrectSound,
  playIncorrectSound,
} from '../services/feedbackEffects'
import type { AppMessages } from '../i18n/messages'
import { generateQuestion } from '../services/questionGenerator'
import {
  getSurvivalBonusMs,
  getSurvivalBonusSeconds,
  getSurvivalLevel,
  SURVIVAL_BASE_BONUS_SECONDS,
  SURVIVAL_BONUS_DECAY_SECONDS,
  SURVIVAL_INITIAL_TIME_SECONDS,
  SURVIVAL_LEVEL_UP_EVERY_CORRECT_COUNT,
  SURVIVAL_MAX_LEVEL,
  SURVIVAL_MAX_TIME_SECONDS,
  SURVIVAL_MIN_BONUS_SECONDS,
  SURVIVAL_RULE_VERSION,
  SURVIVAL_WRONG_PENALTY_SECONDS,
} from '../services/survivalRules'
import type {
  AnswerRecord,
  DrillQuestion,
  DrillSettings,
  PlayResult,
} from '../types/drill'

const INCORRECT_FEEDBACK_MS = 700
const ANSWER_EFFECT_MS = 240
const COUNTDOWN_STEP_MS = 400
const COUNTDOWN_VALUES = ['3', '2', '1', 'Go'] as const
const SURVIVAL_INITIAL_TIME_MS = SURVIVAL_INITIAL_TIME_SECONDS * 1000
const SURVIVAL_MAX_TIME_MS = SURVIVAL_MAX_TIME_SECONDS * 1000

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

type CompletionReason = 'cleared' | 'timeUp' | 'manual'

function getActiveTimeLimitMs(settings: DrillSettings) {
  if (settings.mode === 'timeLimit') {
    return settings.timeLimitSeconds * 1000
  }

  if (
    settings.mode === 'questionGoal' &&
    settings.questionGoalTimeLimitSeconds > 0
  ) {
    return settings.questionGoalTimeLimitSeconds * 1000
  }

  return null
}

function getInitialRemainingMs(settings: DrillSettings) {
  return settings.mode === 'survival'
    ? SURVIVAL_INITIAL_TIME_MS
    : (getActiveTimeLimitMs(settings) ?? 0)
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
    Math.ceil((getActiveTimeLimitMs(settings) ?? 0) / 1000),
  )
  const [survivalRemainingMs, setSurvivalRemainingMs] = useState(
    getInitialRemainingMs(settings),
  )
  const [elapsedMs, setElapsedMs] = useState(0)
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
  const survivalRemainingMsRef = useRef(getInitialRemainingMs(settings))
  const survivalLastTickMsRef = useRef<number | null>(null)

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

  const completePlay = useCallback((reason: CompletionReason = 'manual') => {
    if (completedRef.current) {
      return
    }

    completedRef.current = true
    const startedAt = startedAtMsRef.current
    const rawDurationMs =
      startedAt === null
        ? 0
        : Math.max(Date.now() - startedAt - getPausedDurationMs(), 0)
    const maxDurationMs = getActiveTimeLimitMs(settingsRef.current)
    const durationMs =
      maxDurationMs === null
        ? rawDurationMs
        : Math.min(rawDurationMs, maxDurationMs)
    const resultAnswers = answersRef.current
    const resultCorrectCount = resultAnswers.filter(
      (answer) => answer.isCorrect,
    ).length
    const isQuestionGoal = settingsRef.current.mode === 'questionGoal'
    const isSurvival = settingsRef.current.mode === 'survival'
    const isCleared =
      isQuestionGoal &&
      resultCorrectCount >= settingsRef.current.targetQuestionCount &&
      reason !== 'timeUp'
    const isTimeUp = reason === 'timeUp'

    onCompleteRef.current({
      settings: settingsRef.current,
      correctCount: resultCorrectCount,
      totalCount: resultAnswers.length,
      durationMs,
      answers: resultAnswers,
      createdAtMs: Date.now(),
      isCleared,
      isTimeUp,
      survivalTimeMs: isSurvival ? durationMs : undefined,
      survivalRuleVersion: isSurvival ? SURVIVAL_RULE_VERSION : undefined,
      survivalLevel: isSurvival
        ? getSurvivalLevel(resultCorrectCount)
        : undefined,
      initialTimeSeconds: isSurvival ? SURVIVAL_INITIAL_TIME_SECONDS : undefined,
      remainingTimeSeconds: isSurvival
        ? Math.max(survivalRemainingMsRef.current / 1000, 0)
        : undefined,
      maxTimeSeconds: isSurvival ? SURVIVAL_MAX_TIME_SECONDS : undefined,
      correctBonusSeconds: isSurvival
        ? getSurvivalBonusSeconds(resultCorrectCount)
        : undefined,
      baseBonusSeconds: isSurvival ? SURVIVAL_BASE_BONUS_SECONDS : undefined,
      bonusDecaySeconds: isSurvival ? SURVIVAL_BONUS_DECAY_SECONDS : undefined,
      levelUpEveryCorrectCount: isSurvival
        ? SURVIVAL_LEVEL_UP_EVERY_CORRECT_COUNT
        : undefined,
      minBonusSeconds: isSurvival ? SURVIVAL_MIN_BONUS_SECONDS : undefined,
      maxSurvivalLevel: isSurvival ? SURVIVAL_MAX_LEVEL : undefined,
      wrongPenaltySeconds: isSurvival ? SURVIVAL_WRONG_PENALTY_SECONDS : undefined,
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
        survivalLastTickMsRef.current = now
        return
      }

      setCountdownValue(COUNTDOWN_VALUES[countdownIndex])
    }, COUNTDOWN_STEP_MS)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [status])

  useEffect(() => {
    if (
      status !== 'playing' ||
      (feedback !== null && settingsRef.current.mode !== 'survival')
    ) {
      return
    }

    const intervalId = window.setInterval(() => {
      const startedAt = startedAtMsRef.current
      const activeDurationMs =
        startedAt === null
          ? 0
          : Math.max(Date.now() - startedAt - getPausedDurationMs(), 0)

      setElapsedMs(activeDurationMs)

      if (settingsRef.current.mode === 'survival') {
        const previousTickMs = survivalLastTickMsRef.current ?? Date.now()
        const now = Date.now()
        const tickDurationMs = Math.max(now - previousTickMs, 0)
        survivalLastTickMsRef.current = now
        const nextRemainingMs = Math.max(
          survivalRemainingMsRef.current - tickDurationMs,
          0,
        )
        survivalRemainingMsRef.current = nextRemainingMs
        setSurvivalRemainingMs(nextRemainingMs)
        setRemainingSeconds(Math.ceil(nextRemainingMs / 1000))

        if (nextRemainingMs <= 0) {
          setStatus('finished')
          completePlay('timeUp')
        }

        return
      }

      const maxDurationMs = getActiveTimeLimitMs(settingsRef.current)

      if (maxDurationMs === null) {
        return
      }

      const nextRemainingSeconds = Math.max(
        Math.ceil((maxDurationMs - activeDurationMs) / 1000),
        0,
      )
      setRemainingSeconds(nextRemainingSeconds)

      if (activeDurationMs >= maxDurationMs) {
        setStatus('finished')
        completePlay('timeUp')
      }
    }, 100)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [completePlay, feedback, getPausedDurationMs, status])

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
    const initialRemainingMs = getInitialRemainingMs(settings)
    setRemainingSeconds(Math.ceil(initialRemainingMs / 1000))
    setSurvivalRemainingMs(initialRemainingMs)
    survivalRemainingMsRef.current = initialRemainingMs
    survivalLastTickMsRef.current = null
    setElapsedMs(0)
    setAnswerEffect(null)
    setCountdownValue(COUNTDOWN_VALUES[0])
    setFeedback(null)
    setStartedAtMs(null)
    startedAtMsRef.current = null
  }

  const finish = () => {
    setStatus('finished')
    setFeedback(null)
    completePlay('manual')
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
      if (settings.soundEffectsEnabled) {
        playIncorrectSound()
      }
      if (settings.mode !== 'survival') {
        pauseStartedAtMsRef.current = Date.now()
      }
      setFeedback({ isCorrect: false, message: t.play.enterInteger })
      return
    }

    const isCorrect = userAnswer === currentQuestion.answer
    const answeredAtMs =
      startedAtMs === null
        ? 0
        : Math.max(Date.now() - startedAtMs - getPausedDurationMs(), 0)
    const answerRecord: AnswerRecord = {
      question: currentQuestion,
      userAnswer,
      isCorrect,
      answeredAtMs,
    }

    const previousCorrectCount = answersRef.current.filter(
      (answer) => answer.isCorrect,
    ).length
    const nextAnswers = [...answersRef.current, answerRecord]
    answersRef.current = nextAnswers
    setAnswers(nextAnswers)
    setAnswerInput('')

    if (isCorrect) {
      setAnswerEffect('correct')
      if (settings.soundEffectsEnabled) {
        playCorrectSound()
      }
      if (settings.mode === 'survival') {
        const nextRemainingMs = Math.min(
          survivalRemainingMsRef.current +
            getSurvivalBonusMs(previousCorrectCount),
          SURVIVAL_MAX_TIME_MS,
        )
        survivalRemainingMsRef.current = nextRemainingMs
        setSurvivalRemainingMs(nextRemainingMs)
        setRemainingSeconds(Math.ceil(nextRemainingMs / 1000))
      }
      if (
        settings.mode === 'questionGoal' &&
        nextAnswers.filter((answer) => answer.isCorrect).length >=
        settings.targetQuestionCount
      ) {
        setStatus('finished')
        completePlay('cleared')
        return
      }

      setCurrentQuestion(nextQuestion ?? generateQuestion(settings))
      setNextQuestion(generateQuestion(settings))
      return
    }

    setAnswerEffect('incorrect')
    if (settings.soundEffectsEnabled) {
      playIncorrectSound()
    }
    if (settings.mode !== 'survival') {
      pauseStartedAtMsRef.current = Date.now()
    }
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
      status === 'idle'
        ? Math.ceil(getInitialRemainingMs(settings) / 1000)
        : remainingSecondsState,
    survivalBonusSeconds: getSurvivalBonusSeconds(correctCount),
    survivalLevel: getSurvivalLevel(correctCount),
    survivalRemainingSeconds:
      status === 'idle'
        ? SURVIVAL_INITIAL_TIME_SECONDS
        : survivalRemainingMs / 1000,
    elapsedMs,
    setAnswerInput,
    start,
    status,
    submitAnswer,
    totalCount: answers.length,
    finish,
  }
}
