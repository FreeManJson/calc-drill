type StartCountdownProps = {
  value: string
}

export function StartCountdown({ value }: StartCountdownProps) {
  return (
    <div className="start-countdown" aria-live="assertive">
      {value}
    </div>
  )
}
