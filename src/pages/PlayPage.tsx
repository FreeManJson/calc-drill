import { useMemo } from 'react'
import {
  formatQuestion,
  generateQuestion,
} from '../services/questionGenerator'
import type { DrillSettings } from '../types/drill'

type PlayPageProps = {
  settings: DrillSettings
}

export function PlayPage({ settings }: PlayPageProps) {
  const previewQuestion = useMemo(() => generateQuestion(settings), [settings])

  return (
    <section className="page">
      <h1>Play</h1>
      <div className="question-preview">
        <p className="question-preview__label">Question preview</p>
        <p className="question-preview__formula">
          {formatQuestion(previewQuestion)}
        </p>
      </div>
    </section>
  )
}
