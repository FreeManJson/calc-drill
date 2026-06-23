type ToneOptions = {
  durationMs: number
  frequency: number
  volume: number
}

function playTone({ durationMs, frequency, volume }: ToneOptions) {
  if (window.AudioContext === undefined) {
    return
  }

  const audioContext = new AudioContext()
  const oscillator = audioContext.createOscillator()
  const gain = audioContext.createGain()
  const now = audioContext.currentTime
  const durationSeconds = durationMs / 1000

  oscillator.frequency.value = frequency
  oscillator.type = 'sine'
  gain.gain.setValueAtTime(volume, now)
  gain.gain.exponentialRampToValueAtTime(0.001, now + durationSeconds)

  oscillator.connect(gain)
  gain.connect(audioContext.destination)
  oscillator.addEventListener('ended', () => {
    void audioContext.close()
  })
  oscillator.start(now)
  oscillator.stop(now + durationSeconds)
}

export function playCorrectSound() {
  playTone({ durationMs: 90, frequency: 880, volume: 0.08 })
}

export function playIncorrectSound() {
  playTone({ durationMs: 140, frequency: 220, volume: 0.06 })
}
