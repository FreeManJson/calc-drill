import type { AppMessages } from '../../i18n/messages'

const NUMBER_PAD_DIGITS = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0']

type NumberPadProps = {
  messages: AppMessages
  onClear: () => void
  onDigit: (digit: string) => void
  onOk: () => void
}

export function NumberPad({
  messages: t,
  onClear,
  onDigit,
  onOk,
}: NumberPadProps) {
  return (
    <div className="number-pad" aria-label={t.play.numberPadLabel}>
      {NUMBER_PAD_DIGITS.map((digit) => (
        <button
          className="number-pad__button"
          key={digit}
          onClick={() => onDigit(digit)}
          type="button"
        >
          {digit}
        </button>
      ))}
      <button className="number-pad__button" onClick={onClear} type="button">
        C
      </button>
      <button
        className="number-pad__button primary-button"
        onClick={onOk}
        type="button"
      >
        OK
      </button>
    </div>
  )
}
