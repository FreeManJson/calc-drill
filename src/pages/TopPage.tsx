import {
  isLockedOperation,
  isOperationUnlocked,
  OPERATION_LABELS,
} from '../constants/operations'
import { OPERATION_TYPES } from '../types/drill'
import type { DrillSettings } from '../types/drill'

type TopPageProps = {
  settings: DrillSettings
}

export function TopPage({ settings }: TopPageProps) {
  return (
    <section className="page">
      <h1>Top</h1>
      <p className="page-description">
        Practice quick arithmetic in a {settings.timeLimitSeconds}-second drill.
      </p>
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
          <dd>
            <ul className="operation-summary">
              {OPERATION_TYPES.map((operation) => {
                const isSelected = settings.operations.includes(operation)
                const isUnlocked = isOperationUnlocked(operation)
                const isDevUnlocked =
                  import.meta.env.DEV && isLockedOperation(operation)

                return (
                  <li key={operation}>
                    <span>{OPERATION_LABELS[operation]}</span>
                    <span className="operation-summary__status">
                      {isSelected
                        ? 'Selected'
                        : isDevUnlocked
                          ? 'Dev unlock'
                          : isUnlocked
                            ? 'Off'
                            : 'Locked'}
                    </span>
                  </li>
                )
              })}
            </ul>
          </dd>
        </div>
      </dl>
    </section>
  )
}
