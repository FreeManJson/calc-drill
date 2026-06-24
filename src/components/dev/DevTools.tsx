type DevToolsProps = {
  onResetScore: () => void
  onResetSettings: () => void
}

export function DevTools({ onResetScore, onResetSettings }: DevToolsProps) {
  return (
    <aside className="dev-tools" aria-label="Development tools">
      <p className="dev-tools__title">Dev tools</p>
      <div className="dev-tools__actions">
        <button onClick={onResetSettings} type="button">
          Reset settings
        </button>
        <button onClick={onResetScore} type="button">
          Reset score
        </button>
      </div>
    </aside>
  )
}
