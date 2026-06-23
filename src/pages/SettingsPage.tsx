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
          {OPERATION_TYPES.map((operation) => (
            <label className="check-field" key={operation}>
              <input
                checked={settings.operations.includes(operation)}
                onChange={(event) =>
                  handleOperationChange(operation, event.currentTarget.checked)
                }
                type="checkbox"
              />
              <span>{operation}</span>
            </label>
          ))}
        </fieldset>

        <p className="settings-note">Negative answers are off.</p>
      </div>
    </section>
  )
}
