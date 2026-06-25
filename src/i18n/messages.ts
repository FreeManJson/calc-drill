import type { OperationType } from '../types/drill'

export const LANGUAGES = ['ja', 'en'] as const
export type Language = (typeof LANGUAGES)[number]

export type AppMessages = {
  appTitle: string
  nav: {
    top: string
    settings: string
    play: string
    score: string
    result: string
  }
  common: {
    formatSeconds: (seconds: number) => string
    seconds: string
    selected: string
    off: string
    locked: string
    devUnlock: string
    noData: string
  }
  operationLabels: Record<OperationType, string>
  top: {
    title: string
    description: (seconds: number) => string
    timeLimit: string
    difficulty: string
    operations: string
  }
  settings: {
    title: string
    description: (seconds: number) => string
    timeLimitSeconds: string
    language: string
    languageJapanese: string
    languageEnglish: string
    numberPadLayout: string
    numberPadLayoutAuto: string
    numberPadLayoutBottom: string
    numberPadLayoutSide: string
    backgroundTheme: string
    backgroundThemeNone: string
    backgroundThemeWood: string
    backgroundThemeClassroom: string
    backgroundThemeNotebook: string
    backgroundThemeBlackboard: string
    soundEffects: string
    soundEffectsOn: string
    soundEffectsOff: string
    operations: string
    negativeAnswersOff: string
  }
  play: {
    title: string
    statusLabel: string
    time: string
    score: string
    start: (seconds: number) => string
    finish: string
    finished: string
    retry: string
    numberPadLabel: string
    answer: string
    noAnswerEntered: string
    answerValue: (value: string) => string
    currentQuestion: string
    nextQuestion: string
    questionPreview: string
    correctFeedback: string
    tryAgainFeedback: string
    enterInteger: string
    incorrectAnswer: (answer: number) => string
  }
  result: {
    title: string
    noResult: string
    score: string
    duration: string
    timeLimit: string
    answers: string
    noAnswers: string
    yourAnswer: (answer: number | null) => string
    correct: string
    incorrect: string
  }
  score: {
    title: string
    totalPlays: string
    best: string
    latestScore: string
  }
}

export const DEFAULT_LANGUAGE: Language = 'ja'

export const messages = {
  ja: {
    appTitle: 'けいさんドリル',
    nav: {
      top: 'トップへ',
      settings: 'くわしい設定',
      play: 'プレイ',
      score: 'せいせき',
      result: 'けっか',
    },
    common: {
      formatSeconds: (seconds) => `${seconds}秒`,
      seconds: '秒',
      selected: 'えらんでいる',
      off: 'お休み',
      locked: 'ロック中',
      devUnlock: '開発用',
      noData: '-',
    },
    operationLabels: {
      addition: 'たし算',
      subtraction: 'ひき算',
      multiplication: 'かけ算',
      division: 'わり算',
    },
    top: {
      title: 'トップへ',
      description: (seconds) => `${seconds}秒で、けいさんにチャレンジしよう。`,
      timeLimit: 'じかん',
      difficulty: 'むずかしさ',
      operations: 'もんだい',
    },
    settings: {
      title: 'くわしい設定',
      description: (seconds) => `いまは ${seconds}秒ドリルがきほんです。`,
      timeLimitSeconds: 'じかん（秒）',
      language: 'ことば',
      languageJapanese: '日本語',
      languageEnglish: 'English',
      numberPadLayout: '数字タイルの配置',
      numberPadLayoutAuto: '自動',
      numberPadLayoutBottom: '下に表示',
      numberPadLayoutSide: '右に表示',
      backgroundTheme: '背景テーマ',
      backgroundThemeNone: '背景なし',
      backgroundThemeWood: '木目風',
      backgroundThemeClassroom: '教室風',
      backgroundThemeNotebook: 'ノート風',
      backgroundThemeBlackboard: '黒板風',
      soundEffects: '効果音',
      soundEffectsOn: 'ON',
      soundEffectsOff: 'OFF',
      operations: 'もんだい',
      negativeAnswersOff: 'マイナスの答えは出ません。',
    },
    play: {
      title: 'プレイ',
      statusLabel: 'プレイのようす',
      time: 'のこり',
      score: 'せいかい',
      start: (seconds) => `${seconds}秒ドリルをスタート`,
      finish: 'おわる',
      finished: 'おしまい',
      retry: 'もういちど',
      numberPadLabel: 'すうじボタン',
      answer: 'こたえ',
      noAnswerEntered: 'まだ入力していません',
      answerValue: (value) => `こたえ ${value}`,
      currentQuestion: 'いまのもんだい',
      nextQuestion: 'つぎのもんだい',
      questionPreview: 'もんだい',
      correctFeedback: 'せいかい！',
      tryAgainFeedback: 'もういちど',
      enterInteger: '数字で答えてね。',
      incorrectAnswer: (answer) => `もういちど。答え: ${answer}`,
    },
    result: {
      title: 'けっか',
      noResult: 'まだプレイのけっかがありません。',
      score: 'せいかい',
      duration: '時間',
      timeLimit: 'じかん',
      answers: '答えたもんだい',
      noAnswers: 'まだ答えたもんだいがありません。',
      yourAnswer: (answer) => `あなたの答え: ${answer}`,
      correct: 'せいかい',
      incorrect: 'もういちど',
    },
    score: {
      title: 'せいせき',
      totalPlays: 'プレイ回数',
      best: 'ベスト',
      latestScore: 'さいしんのせいせき',
    },
  },
  en: {
    appTitle: 'Calc Drill',
    nav: {
      top: 'Top',
      settings: 'Settings',
      play: 'Play',
      score: 'Score',
      result: 'Result',
    },
    common: {
      formatSeconds: (seconds) => `${seconds} seconds`,
      seconds: 'seconds',
      selected: 'Selected',
      off: 'Off',
      locked: 'Locked',
      devUnlock: 'Dev unlock',
      noData: '-',
    },
    operationLabels: {
      addition: 'Addition',
      subtraction: 'Subtraction',
      multiplication: 'Multiplication',
      division: 'Division',
    },
    top: {
      title: 'Top',
      description: (seconds) =>
        `Practice quick arithmetic in a ${seconds}-second drill.`,
      timeLimit: 'Time limit',
      difficulty: 'Difficulty',
      operations: 'Operations',
    },
    settings: {
      title: 'Settings',
      description: (seconds) =>
        `The MVP default is a ${seconds}-second drill.`,
      timeLimitSeconds: 'Time limit seconds',
      language: 'Language',
      languageJapanese: '日本語',
      languageEnglish: 'English',
      numberPadLayout: 'Number pad layout',
      numberPadLayoutAuto: 'Auto',
      numberPadLayoutBottom: 'Bottom',
      numberPadLayoutSide: 'Right side',
      backgroundTheme: 'Background theme',
      backgroundThemeNone: 'None',
      backgroundThemeWood: 'Wood',
      backgroundThemeClassroom: 'Classroom',
      backgroundThemeNotebook: 'Notebook',
      backgroundThemeBlackboard: 'Blackboard',
      soundEffects: 'Sound effects',
      soundEffectsOn: 'ON',
      soundEffectsOff: 'OFF',
      operations: 'Operations',
      negativeAnswersOff: 'Negative answers are off.',
    },
    play: {
      title: 'Play',
      statusLabel: 'Play status',
      time: 'Time',
      score: 'Score',
      start: (seconds) => `Start ${seconds}-second drill`,
      finish: 'Finish',
      finished: 'Finished',
      retry: 'Retry',
      numberPadLabel: 'Number pad',
      answer: 'Answer',
      noAnswerEntered: 'No answer entered',
      answerValue: (value) => `Answer ${value}`,
      currentQuestion: 'Current Question',
      nextQuestion: 'Next Question',
      questionPreview: 'Question preview',
      correctFeedback: 'Correct!',
      tryAgainFeedback: 'Try again',
      enterInteger: 'Enter an integer.',
      incorrectAnswer: (answer) => `Incorrect. Answer: ${answer}`,
    },
    result: {
      title: 'Result',
      noResult: 'No play result yet.',
      score: 'Score',
      duration: 'Duration',
      timeLimit: 'Time limit',
      answers: 'Answers',
      noAnswers: 'No answers submitted.',
      yourAnswer: (answer) => `Your answer: ${answer}`,
      correct: 'Correct',
      incorrect: 'Incorrect',
    },
    score: {
      title: 'Score',
      totalPlays: 'Total plays',
      best: 'Best correct count',
      latestScore: 'Latest score',
    },
  },
} satisfies Record<Language, AppMessages>

export function getMessages(language: Language) {
  return messages[language]
}
