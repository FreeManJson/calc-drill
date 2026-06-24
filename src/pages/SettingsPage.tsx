import { DEFAULT_TIME_LIMIT_SECONDS } from '../constants/defaults'
import {
  isLockedOperation,
  isOperationUnlocked,
  OPERATION_LABELS,
} from '../constants/operations'
import { OPERATION_TYPES } from '../types/drill'
import type { DrillSettings, OperationType } from '../types/drill'

type SettingsPageProps = {
  onSettingsChange: (settings: DrillSettings) => void
  settings: DrillSettings
}

export function SettingsPage({
  onSettingsChange,
  settings,
}: SettingsPageProps) {
  const updateSettings = (nextSettings: Partial<DrillSettings>) => {
    onSettingsChange({ ...settings, ...nextSettings })
  }

  const handleTimeLimitChange = (value: string) => {
    const timeLimitSeconds = Number(value)

    if (Number.isFinite(timeLimitSeconds) && timeLimitSeconds > 0) {
      updateSettings({ timeLimitSeconds: Math.trunc(timeLimitSeconds) })
    }
  }

  const handleOperationChange = (
    operation: OperationType,
    checked: boolean,
  ) => {
    if (!isOperationUnlocked(operation)) {
      return
    }

    const operations = checked
      ? [...settings.operations, operation]
      : settings.operations.filter((item) => item !== operation)

    if (operations.length > 0) {
      updateSettings({ operations })
    }
  }

  return (
    <section className="page">
      <h1>Settings</h1>
      <p className="page-description">
        The MVP default is a {DEFAULT_TIME_LIMIT_SECONDS}-second drill.
      </p>
      <div className="settings-form">
        <label className="field">
          <span>Time limit seconds</span>
          <input
            min="1"
            onChange={(event) =>
              handleTimeLimitChange(event.currentTarget.value)
            }
            type="number"
            value={settings.timeLimitSeconds}
          />
        </label>

        <fieldset className="field-group">
          <legend>Operations</legend>
          {OPERATION_TYPES.map((operation) => {
            const isUnlocked = isOperationUnlocked(operation)

            return (
              <label
                className={
                  isUnlocked ? 'check-field' : 'check-field check-field--locked'
                }
                key={operation}
              >
                <input
                  checked={settings.operations.includes(operation)}
                  disabled={!isUnlocked}
                  onChange={(event) =>
                    handleOperationChange(
                      operation,
                      event.currentTarget.checked,
                    )
                  }
                  type="checkbox"
                />
                <span>{OPERATION_LABELS[operation]}</span>
                {!isUnlocked && <span className="lock-badge">Locked</span>}
                {isUnlocked &&
                  import.meta.env.DEV &&
                  isLockedOperation(operation) && (
                    <span className="lock-badge">Dev unlock</span>
                  )}
              </label>
            )
          })}
        </fieldset>

        <p className="settings-note">Negative answers are off.</p>
      </div>
    </section>
  )
}
