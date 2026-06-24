import {
  isLockedOperation,
  isOperationUnlocked,
} from '../constants/operations'
import { t } from '../i18n/messages'
import { OPERATION_TYPES } from '../types/drill'
import type { DrillSettings } from '../types/drill'

type TopPageProps = {
  settings: DrillSettings
}

export function TopPage({ settings }: TopPageProps) {
  return (
    <section className="page">
      <h1>{t.top.title}</h1>
      <p className="page-description">
        {t.top.description(settings.timeLimitSeconds)}
      </p>
      <dl className="settings-summary">
        <div>
          <dt>{t.top.timeLimit}</dt>
          <dd>
            {settings.timeLimitSeconds}
            {t.common.seconds}
          </dd>
        </div>
        <div>
          <dt>{t.top.difficulty}</dt>
          <dd>{settings.difficulty}</dd>
        </div>
        <div>
          <dt>{t.top.operations}</dt>
          <dd>
            <ul className="operation-summary">
              {OPERATION_TYPES.map((operation) => {
                const isSelected = settings.operations.includes(operation)
                const isUnlocked = isOperationUnlocked(operation)
                const isDevUnlocked =
                  import.meta.env.DEV && isLockedOperation(operation)

                return (
                  <li key={operation}>
                    <span>{t.operationLabels[operation]}</span>
                    <span className="operation-summary__status">
                      {isSelected
                        ? t.common.selected
                        : isDevUnlocked
                          ? t.common.devUnlock
                          : isUnlocked
                            ? t.common.off
                            : t.common.locked}
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
