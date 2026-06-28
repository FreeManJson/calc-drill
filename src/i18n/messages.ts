import type { Difficulty, GameMode, OperationType } from '../types/drill'

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
  difficultyLabels: Record<Difficulty, string>
  gameModeLabels: Record<GameMode, string>
  operationLabels: Record<OperationType, string>
  top: {
    title: string
    description: (seconds: number) => string
    questionGoalDescription: (count: number) => string
    survivalDescription: string
    playSettings: string
    start: string
    mode: string
    timeLimit: string
    targetQuestionCount: string
    difficulty: string
    operations: string
    currentBest: string
  }
  settings: {
    title: string
    description: string
    displayAndSound: string
    temporaryPlaySettings: string
    playStartScreenNote: string
    mode: string
    timeLimitSeconds: string
    targetQuestionCount: string
    fixedTargetQuestionCount: (count: number) => string
    questionGoalTimeLimit: string
    questionGoalNoTimeLimit: string
    questionGoalTimeLimit1Minute: string
    questionGoalTimeLimit3Minutes: string
    questionGoalTimeLimit10Minutes: string
    difficulty: string
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
    timeLeft: string
    elapsedTime: string
    score: string
    start: (seconds: number) => string
    startQuestionGoal: (count: number) => string
    startSurvival: string
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
    startingSoon: string
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
    clearTime: string
    clearQuestionCount: string
    survivalResult: string
    survivalTime: string
    timeLimit: string
    status: string
    clear: string
    timeUp: string
    notCleared: string
    totalAnswers: string
    mistakes: string
    accuracy: string
    averageAnswerTime: string
    answers: string
    noAnswers: string
    yourAnswer: (answer: number | null) => string
    answerHistory: string
    historyNumber: string
    historyQuestion: string
    historyYourAnswer: string
    historyCorrectAnswer: string
    historyResult: string
    historyTime: string
    formatAnswerTime: (durationMs: number) => string
    resultOk: string
    resultNg: string
    correct: string
    incorrect: string
  }
  score: {
    title: string
    totalPlays: string
    best: string
    latestScore: string
    currentSettings: string
    currentSettingScore: string
    scoresByMode: string
    noCurrentScore: string
    noModeScore: string
    timeLimitMode: string
    questionGoalMode: string
    survivalMode: string
    bestCorrectCount: string
    longestSurvivalTime: string
    bestClearTime: string
    averageCorrectCount: string
    averageSurvivalTime: string
    averageClearTime: string
    plays: string
    mistakes: string
    accuracy: string
    averageAnswerTime: string
    recent: string
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
    difficultyLabels: {
      easy: 'かんたん',
      normal: 'ふつう',
      hard: 'むずかしい',
      expert: 'たつじん',
    },
    gameModeLabels: {
      timeLimit: '時間制限',
      questionGoal: '問題数達成',
      survival: 'サバイバル',
    },
    top: {
      title: 'トップへ',
      description: (seconds) => `${seconds}秒で、けいさんにチャレンジしよう。`,
      questionGoalDescription: (count) =>
        `${count}問クリアをめざして、けいさんにチャレンジしよう。`,
      survivalDescription:
        '持ち時間がなくなるまで、せいかいをつないでいこう。',
      playSettings: 'プレイ設定',
      start: '開始',
      mode: 'モード',
      timeLimit: 'じかん',
      targetQuestionCount: '問題数',
      difficulty: 'むずかしさ',
      operations: 'もんだい',
      currentBest: 'いまの設定のベスト',
    },
    settings: {
      title: 'アプリ設定',
      description: 'ことば、見た目、音、操作の好みを変えられます。',
      displayAndSound: '表示と音',
      temporaryPlaySettings: 'プレイ設定（暫定）',
      playStartScreenNote: 'モード、むずかしさ、時間、問題数はトップのプレイ設定で選べます。',
      mode: 'モード',
      timeLimitSeconds: 'じかん（秒）',
      targetQuestionCount: '問題数',
      fixedTargetQuestionCount: (count) => `${count}問`,
      questionGoalTimeLimit: '制限時間',
      questionGoalNoTimeLimit: '制限なし',
      questionGoalTimeLimit1Minute: '1分',
      questionGoalTimeLimit3Minutes: '3分',
      questionGoalTimeLimit10Minutes: '10分',
      difficulty: 'むずかしさ',
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
      timeLeft: '残り時間',
      elapsedTime: '経過時間',
      score: 'せいかい',
      start: (seconds) => `${seconds}秒ドリルをスタート`,
      startQuestionGoal: (count) => `${count}問チャレンジをスタート`,
      startSurvival: 'サバイバルをスタート',
      finish: 'おわる',
      finished: 'おしまい',
      retry: 'もういちど',
      numberPadLabel: 'すうじボタン',
      answer: 'こたえ',
      noAnswerEntered: 'まだ入力していません',
      answerValue: (value) => `こたえ ${value}`,
      currentQuestion: 'いまのもんだい',
      nextQuestion: 'つぎ',
      questionPreview: 'もんだい',
      startingSoon: 'まもなく',
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
      clearTime: 'クリア時間',
      clearQuestionCount: 'クリア問題数',
      survivalResult: 'サバイバル結果',
      survivalTime: '生存時間',
      timeLimit: 'じかん',
      status: '状態',
      clear: 'クリア',
      timeUp: '時間切れ',
      notCleared: '未クリア',
      totalAnswers: '回答数',
      mistakes: 'ミス数',
      accuracy: '正答率',
      averageAnswerTime: '平均解答時間',
      answers: '答えたもんだい',
      noAnswers: 'まだ答えたもんだいがありません。',
      yourAnswer: (answer) => `あなたの答え: ${answer}`,
      answerHistory: '解答履歴',
      historyNumber: 'No.',
      historyQuestion: '問題',
      historyYourAnswer: 'あなたの答え',
      historyCorrectAnswer: '正解',
      historyResult: '判定',
      historyTime: '解答時間',
      formatAnswerTime: (durationMs) =>
        `${(durationMs / 1000).toFixed(1)}秒`,
      resultOk: '〇',
      resultNg: '×',
      correct: 'せいかい',
      incorrect: 'もういちど',
    },
    score: {
      title: 'せいせき',
      totalPlays: 'プレイ回数',
      best: 'ベスト',
      latestScore: 'さいしんのせいせき',
      currentSettings: '現在の設定',
      currentSettingScore: '現在設定の成績',
      scoresByMode: 'モード別成績',
      noCurrentScore: 'この設定の成績はまだありません。',
      noModeScore: 'このモードの成績はまだありません。',
      timeLimitMode: '時間制限モード',
      questionGoalMode: '問題数達成モード',
      survivalMode: 'サバイバルモード',
      bestCorrectCount: 'ベスト正解数',
      longestSurvivalTime: '最長生存時間',
      bestClearTime: 'ベストクリア時間',
      averageCorrectCount: '平均正解数',
      averageSurvivalTime: '平均生存時間',
      averageClearTime: '平均クリア時間',
      plays: 'プレイ回数',
      mistakes: 'ミス数',
      accuracy: '正答率',
      averageAnswerTime: '平均解答時間',
      recent: '直近',
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
    difficultyLabels: {
      easy: 'Easy',
      normal: 'Normal',
      hard: 'Hard',
      expert: 'Expert',
    },
    gameModeLabels: {
      timeLimit: 'Time Limit',
      questionGoal: 'Question Goal',
      survival: 'Survival',
    },
    top: {
      title: 'Top',
      description: (seconds) =>
        `Practice quick arithmetic in a ${seconds}-second drill.`,
      questionGoalDescription: (count) =>
        `Practice quick arithmetic until you clear ${count} questions.`,
      survivalDescription:
        'Keep solving until your survival time runs out.',
      playSettings: 'Play Settings',
      start: 'Start',
      mode: 'Mode',
      timeLimit: 'Time limit',
      targetQuestionCount: 'Questions',
      difficulty: 'Difficulty',
      operations: 'Operations',
      currentBest: 'Current setting best',
    },
    settings: {
      title: 'App Settings',
      description: 'Change app-wide preferences for language, display, sound, and controls.',
      displayAndSound: 'Display and Sound',
      temporaryPlaySettings: 'Play Settings (Temporary)',
      playStartScreenNote:
        'Mode, difficulty, time, and question count can be set on the play start screen.',
      mode: 'Mode',
      timeLimitSeconds: 'Time limit seconds',
      targetQuestionCount: 'Questions',
      fixedTargetQuestionCount: (count) => `${count} Questions`,
      questionGoalTimeLimit: 'Time limit',
      questionGoalNoTimeLimit: 'No limit',
      questionGoalTimeLimit1Minute: '1 min',
      questionGoalTimeLimit3Minutes: '3 min',
      questionGoalTimeLimit10Minutes: '10 min',
      difficulty: 'Difficulty',
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
      timeLeft: 'Time Left',
      elapsedTime: 'Elapsed Time',
      score: 'Score',
      start: (seconds) => `Start ${seconds}-second drill`,
      startQuestionGoal: (count) => `Start ${count}-question challenge`,
      startSurvival: 'Start survival',
      finish: 'Finish',
      finished: 'Finished',
      retry: 'Retry',
      numberPadLabel: 'Number pad',
      answer: 'Answer',
      noAnswerEntered: 'No answer entered',
      answerValue: (value) => `Answer ${value}`,
      currentQuestion: 'Current Question',
      nextQuestion: 'Next',
      questionPreview: 'Question preview',
      startingSoon: 'Soon',
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
      clearTime: 'Clear Time',
      clearQuestionCount: 'Goal',
      survivalResult: 'Survival Result',
      survivalTime: 'Survival Time',
      timeLimit: 'Time limit',
      status: 'Status',
      clear: 'Clear',
      timeUp: 'Time Up',
      notCleared: 'Not Cleared',
      totalAnswers: 'Answers',
      mistakes: 'Mistakes',
      accuracy: 'Accuracy',
      averageAnswerTime: 'Average Time',
      answers: 'Answers',
      noAnswers: 'No answers submitted.',
      yourAnswer: (answer) => `Your answer: ${answer}`,
      answerHistory: 'Answer History',
      historyNumber: 'No.',
      historyQuestion: 'Question',
      historyYourAnswer: 'Your Answer',
      historyCorrectAnswer: 'Correct Answer',
      historyResult: 'Result',
      historyTime: 'Time',
      formatAnswerTime: (durationMs) =>
        `${(durationMs / 1000).toFixed(1)} sec`,
      resultOk: 'OK',
      resultNg: 'NG',
      correct: 'Correct',
      incorrect: 'Incorrect',
    },
    score: {
      title: 'Score',
      totalPlays: 'Total plays',
      best: 'Best correct count',
      latestScore: 'Latest score',
      currentSettings: 'Current Settings',
      currentSettingScore: 'Current Setting Score',
      scoresByMode: 'Scores by Mode',
      noCurrentScore: 'No score for this setting yet.',
      noModeScore: 'No records for this mode yet.',
      timeLimitMode: 'Time Limit Mode',
      questionGoalMode: 'Question Goal Mode',
      survivalMode: 'Survival Mode',
      bestCorrectCount: 'Best Correct Count',
      longestSurvivalTime: 'Longest Survival Time',
      bestClearTime: 'Best Clear Time',
      averageCorrectCount: 'Average Correct Count',
      averageSurvivalTime: 'Average Survival Time',
      averageClearTime: 'Average Clear Time',
      plays: 'Plays',
      mistakes: 'Mistakes',
      accuracy: 'Accuracy',
      averageAnswerTime: 'Average Answer Time',
      recent: 'Recent',
    },
  },
} satisfies Record<Language, AppMessages>

export function getMessages(language: Language) {
  return messages[language]
}
