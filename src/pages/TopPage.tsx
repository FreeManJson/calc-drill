import type { DrillSettings } from '../types/drill'

type TopPageProps = {
  settings: DrillSettings
}

export function TopPage({ settings }: TopPageProps) {
  return (
    <section className="page">
      <h1>Top</h1>
      <dl className="settings-summary">
        <div>
          <dt>Time limit</dt>
          <dd>{settings.timeLimitSeconds} seconds</dd>
        </div>
        <div>
          <dt>Difficulty</dt>
          <dd>{settings.difficulty}</dd>
        </div>
        <div>
          <dt>Operations</dt>
          <dd>{settings.operations.join(', ')}</dd>
        </div>
      </dl>
    </section>
  )
}
