import { DEFAULT_TIME_LIMIT_SECONDS } from '../constants/defaults'
import {
  isLockedOperation,
  isOperationUnlocked,
} from '../constants/operations'
import { LANGUAGES } from '../i18n/messages'
import type { AppMessages, Language } from '../i18n/messages'
import { OPERATION_TYPES } from '../types/drill'
import type { DrillSettings, OperationType } from '../types/drill'

type SettingsPageProps = {
  messages: AppMessages
  onSettingsChange: (settings: DrillSettings) => void
  settings: DrillSettings
}

export function SettingsPage({
  messages: t,
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

  const handleLanguageChange = (language: Language) => {
    updateSettings({ language })
  }

  return (
    <section className="page">
      <h1>{t.settings.title}</h1>
      <p className="page-description">
        {t.settings.description(DEFAULT_TIME_LIMIT_SECONDS)}
      </p>
      <div className="settings-form">
        <label className="field">
          <span>{t.settings.timeLimitSeconds}</span>
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
          <legend>{t.settings.language}</legend>
          {LANGUAGES.map((language) => (
            <label className="check-field" key={language}>
              <input
                checked={settings.language === language}
                name="language"
                onChange={() => handleLanguageChange(language)}
                type="radio"
                value={language}
              />
              <span>
                {language === 'ja'
                  ? t.settings.languageJapanese
                  : t.settings.languageEnglish}
              </span>
            </label>
          ))}
        </fieldset>

        <fieldset className="field-group">
          <legend>{t.settings.operations}</legend>
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
                <span>{t.operationLabels[operation]}</span>
                {!isUnlocked && (
                  <span className="lock-badge">{t.common.locked}</span>
                )}
                {isUnlocked &&
                  import.meta.env.DEV &&
                  isLockedOperation(operation) && (
                    <span className="lock-badge">{t.common.devUnlock}</span>
                  )}
              </label>
            )
          })}
        </fieldset>

        <p className="settings-note">{t.settings.negativeAnswersOff}</p>
      </div>
    </section>
  )
}
