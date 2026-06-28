import {
  isLockedOperation,
  isOperationUnlocked,
} from '../constants/operations'
import { LANGUAGES } from '../i18n/messages'
import type { AppMessages, Language } from '../i18n/messages'
import {
  BACKGROUND_THEMES,
  NUMBER_PAD_LAYOUTS,
  OPERATION_TYPES,
} from '../types/drill'
import type {
  BackgroundTheme,
  DrillSettings,
  NumberPadLayout,
  OperationType,
} from '../types/drill'

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

  const handleNumberPadLayoutChange = (numberPadLayout: NumberPadLayout) => {
    updateSettings({ numberPadLayout })
  }

  const handleBackgroundThemeChange = (backgroundTheme: BackgroundTheme) => {
    updateSettings({ backgroundTheme })
  }

  const handleSoundEffectsChange = (soundEffectsEnabled: boolean) => {
    updateSettings({ soundEffectsEnabled })
  }

  const getNumberPadLayoutLabel = (numberPadLayout: NumberPadLayout) => {
    switch (numberPadLayout) {
      case 'auto':
        return t.settings.numberPadLayoutAuto
      case 'bottom':
        return t.settings.numberPadLayoutBottom
      case 'side':
        return t.settings.numberPadLayoutSide
    }
  }

  const getBackgroundThemeLabel = (backgroundTheme: BackgroundTheme) => {
    switch (backgroundTheme) {
      case 'none':
        return t.settings.backgroundThemeNone
      case 'wood':
        return t.settings.backgroundThemeWood
      case 'classroom':
        return t.settings.backgroundThemeClassroom
      case 'notebook':
        return t.settings.backgroundThemeNotebook
      case 'blackboard':
        return t.settings.backgroundThemeBlackboard
    }
  }

  return (
    <section className="page">
      <h1>{t.settings.title}</h1>
      <p className="page-description">{t.settings.description}</p>
      <div className="settings-form">
        <section className="settings-section">
          <h2>{t.settings.displayAndSound}</h2>

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
            <legend>{t.settings.soundEffects}</legend>
            <label className="check-field">
              <input
                checked={settings.soundEffectsEnabled}
                name="soundEffectsEnabled"
                onChange={() => handleSoundEffectsChange(true)}
                type="radio"
                value="on"
              />
              <span>{t.settings.soundEffectsOn}</span>
            </label>
            <label className="check-field">
              <input
                checked={!settings.soundEffectsEnabled}
                name="soundEffectsEnabled"
                onChange={() => handleSoundEffectsChange(false)}
                type="radio"
                value="off"
              />
              <span>{t.settings.soundEffectsOff}</span>
            </label>
          </fieldset>

          <fieldset className="field-group">
            <legend>{t.settings.backgroundTheme}</legend>
            {BACKGROUND_THEMES.map((backgroundTheme) => (
              <label className="check-field" key={backgroundTheme}>
                <input
                  checked={settings.backgroundTheme === backgroundTheme}
                  name="backgroundTheme"
                  onChange={() => handleBackgroundThemeChange(backgroundTheme)}
                  type="radio"
                  value={backgroundTheme}
                />
                <span>{getBackgroundThemeLabel(backgroundTheme)}</span>
              </label>
            ))}
          </fieldset>

          <fieldset className="field-group">
            <legend>{t.settings.numberPadLayout}</legend>
            {NUMBER_PAD_LAYOUTS.map((numberPadLayout) => (
              <label className="check-field" key={numberPadLayout}>
                <input
                  checked={settings.numberPadLayout === numberPadLayout}
                  name="numberPadLayout"
                  onChange={() =>
                    handleNumberPadLayoutChange(numberPadLayout)
                  }
                  type="radio"
                  value={numberPadLayout}
                />
                <span>{getNumberPadLayoutLabel(numberPadLayout)}</span>
              </label>
            ))}
          </fieldset>
        </section>

        <section className="settings-section">
          <h2>{t.settings.temporaryPlaySettings}</h2>
          <p className="settings-note">{t.settings.playStartScreenNote}</p>

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
        </section>

        <p className="settings-note">{t.settings.negativeAnswersOff}</p>
      </div>
    </section>
  )
}
