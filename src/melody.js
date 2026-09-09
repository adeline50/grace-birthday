const NOTES = {
  G4: 392.0,
  A4: 440.0,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
}

const MELODY = [
  ['G4', 0.75],
  ['G4', 0.25],
  ['A4', 1],
  ['G4', 1],
  ['C5', 1],
  ['B4', 2],
  ['G4', 0.75],
  ['G4', 0.25],
  ['A4', 1],
  ['G4', 1],
  ['D5', 1],
  ['C5', 2],
  ['G4', 0.75],
  ['G4', 0.25],
  ['G5', 1],
  ['E5', 1],
  ['C5', 1],
  ['B4', 1],
  ['A4', 2],
  ['F5', 0.75],
  ['F5', 0.25],
  ['E5', 1],
  ['C5', 1],
  ['D5', 1],
  ['C5', 2.5],
]

const BEAT = 0.42

export function playMelody({ onEnd = null } = {}) {
  const Ctx = window.AudioContext || window.webkitAudioContext
  if (!Ctx) return null

  const ac = new Ctx()
  ac.resume()

  const totalBeats = MELODY.reduce((sum, [, beats]) => sum + beats, 0)
  let t = ac.currentTime + 0.12
  const master = ac.createGain()
  master.gain.value = 0.55
  master.connect(ac.destination)

  for (const [name, beats] of MELODY) {
    playTone(ac, master, NOTES[name], t, beats * BEAT * 0.92, 0.5, 'triangle')
    playTone(ac, master, NOTES[name] / 2, t, beats * BEAT * 0.92, 0.16, 'sine')
    t += beats * BEAT
  }

  const timer = setTimeout(() => {
    ac.close().catch(() => {})
    if (onEnd) onEnd()
  }, (totalBeats + 1) * BEAT * 1000)

  return () => {
    clearTimeout(timer)
    ac.close().catch(() => {})
  }
}

function playTone(ac, dest, freq, start, duration, volume, type) {
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = type
  osc.frequency.value = freq
  const g = gain.gain
  g.setValueAtTime(0.0001, start)
  g.exponentialRampToValueAtTime(volume, start + 0.03)
  g.exponentialRampToValueAtTime(0.0001, start + duration)
  osc.connect(gain)
  gain.connect(dest)
  osc.start(start)
  osc.stop(start + duration + 0.06)
}