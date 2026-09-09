import { useRef, useState } from 'react'

export default function VoiceNote() {
  const supported =
    typeof window !== 'undefined' &&
    !!window.MediaRecorder &&
    !!navigator.mediaDevices &&
    !!navigator.mediaDevices.getUserMedia

  const [recording, setRecording] = useState(false)
  const [audioUrl, setAudioUrl] = useState(null)
  const [error, setError] = useState('')
  const recorderRef = useRef(null)
  const chunksRef = useRef([])

  const stop = () => {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop()
    }
    setRecording(false)
  }

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      chunksRef.current = []
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' })
        if (audioUrl) URL.revokeObjectURL(audioUrl)
        setAudioUrl(URL.createObjectURL(blob))
        stream.getTracks().forEach((t) => t.stop())
      }
      recorderRef.current = recorder
      recorder.start()
      setRecording(true)
      setError('')
    } catch {
      setError('The microphone said no — the letter says it all anyway.')
      setRecording(false)
    }
  }

  const toggle = () => {
    if (recording) stop()
    else start()
  }

  return (
    <section id="chapter-voice" className="voice-section">
      <h2 className="section-title">A voice note, straight from your heart</h2>
      <p className="section-sub">
        Press record and say the words that live in your chest. She will press play and hear every one of them again.
      </p>

      {!supported ? (
        <p className="voice-error">
          This browser cannot record voice notes. The letter above says it all anyway.
        </p>
      ) : (
        <div className="voice-controls">
          <button
            type="button"
            className={`mic-btn ${recording ? 'recording' : ''}`}
            onClick={toggle}
          >
            <span className="mic-dot" />
            {recording ? 'Stop recording' : 'Start recording'}
          </button>
          {audioUrl && !recording && (
            <audio controls src={audioUrl} className="voice-player" />
          )}
        </div>
      )}

      {error && <p className="voice-error">{error}</p>}
      <p className="voice-hint">Tip: keep it under a minute — short and sweet lands longest.</p>
    </section>
  )
}