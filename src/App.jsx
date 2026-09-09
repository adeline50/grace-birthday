import { useEffect, useRef, useState } from 'react'
import './App.css'
import photo1 from './assets/grace-4.jpg'
import photo2 from './assets/33cc4f365f8c8fce9740ed4f6d6d494b_0.jpeg'
import photo3 from './assets/IMG-20260505-WA0027.jpg'
import photo4 from './assets/IMG_20260605_110238 (1).jpg'
import photo5 from './assets/IMG_20260605_110222 (1).jpg'
import photo6 from './assets/IMG_20260714_142208.jpg'
import { Balloons, Confetti, Stars } from './Fx'
import FireworksOverlay from './Fireworks'
import Album from './Album'
import Letter from './Letter'
import Cake from './Cake'
import VoiceNote from './Voice'
import Wishes from './Wishes'
import { playMelody } from './melody'
import SongPlayer, { SONG_TITLE, SONG_URL, SONG_VIDEO_ID } from './SongPlayer'

const photos = [
  { src: photo1, caption: 'It all began with you' },
  { src: photo2, caption: 'So small, so full of light' },
  { src: photo3, caption: 'Curious heart, endless laughter' },
  { src: photo4, caption: 'Growing up, growing radiant' },
  { src: photo5, caption: 'Turning quiet days into memories' },
  { src: photo6, caption: 'And today — the most beautiful you' },
]

const CHAPTERS = [
  { id: 'chapter-hello', label: 'Hello' },
  { id: 'chapter-album', label: 'Album' },
  { id: 'chapter-letter', label: 'Letter' },
  { id: 'chapter-voice', label: 'Voice' },
  { id: 'chapter-cake', label: 'Cake' },
  { id: 'chapter-wishes', label: 'Wishes' },
  { id: 'chapter-finale', label: 'Finale' },
]

function useMelody() {
  const [playing, setPlaying] = useState(false)
  const stopRef = useRef(null)
  const startSong = () => {
    if (stopRef.current) return
    const stop = playMelody({
      onEnd: () => {
        stopRef.current = null
        setPlaying(false)
      },
    })
    if (stop) {
      stopRef.current = stop
      setPlaying(true)
    }
  }
  const toggleSong = () => {
    if (stopRef.current) {
      stopRef.current()
      stopRef.current = null
      setPlaying(false)
    } else {
      startSong()
    }
  }
  useEffect(() => () => {
    if (stopRef.current) stopRef.current()
  }, [])
  return { playing, toggleSong, startSong }
}

function useCountdown() {
  const compute = () => {
    const now = new Date()
    const M = 8
    const D = 10
    if (now.getMonth() === M && now.getDate() === D) return { isToday: true }
    let next = new Date(now.getFullYear(), M, D, 0, 0, 0)
    if (next.getTime() - now.getTime() < 0) {
      next = new Date(now.getFullYear() + 1, M, D, 0, 0, 0)
    }
    const diff = next.getTime() - now.getTime()
    return {
      isToday: false,
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    }
  }
  const [cd, setCd] = useState(compute)
  useEffect(() => {
    const id = setInterval(() => setCd(compute()), 1000)
    return () => clearInterval(id)
  }, [])
  return cd
}

function bigBurst(count = 110) {
  window.dispatchEvent(
    new CustomEvent('fireworks:burst', {
      detail: {
        x: window.innerWidth / 2,
        y: window.innerHeight * 0.4,
        count,
        speed: 7,
      },
    }),
  )
}

export default function App() {
  const { playing: melodyOn, toggleSong: toggleMelody } = useMelody()
  const cd = useCountdown()
  const songRef = useRef(null)
  const [opening, setOpening] = useState(false)
  const [opened, setOpened] = useState(false)
  const [egg, setEgg] = useState(0)
  const [secret, setSecret] = useState(false)
  const [eggHint, setEggHint] = useState('')
  const [youtubeReady, setYoutubeReady] = useState(false)
  const [youtubeError, setYoutubeError] = useState(false)
  const [youtubePlaying, setYoutubePlaying] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)

  const songBroken = youtubeError
  const sourcePlaying = songBroken ? melodyOn : youtubePlaying

  useEffect(() => {
    document.body.style.overflow = opened ? 'auto' : 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [opened])

  useEffect(() => {
    if (!opened) return
    if (youtubeError && !melodyOn) toggleMelody()
  }, [opened, youtubeError, melodyOn]) // eslint-disable-line react-hooks/exhaustive-deps

  const togglePrimary = () => {
    if (songBroken) {
      toggleMelody()
      return
    }
    if (!songRef.current) return
    if (youtubePlaying) {
      songRef.current.pause()
    } else {
      songRef.current.play()
    }
  }

  const open = () => {
    if (opening) return
    setOpening(true)
    bigBurst(120)
    setTimeout(() => {
      setOpened(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 1000)
  }

  const peck = () => {
    if (secret) return
    const n = egg + 1
    setEgg(n)
    if (n >= 5) {
      setSecret(true)
      bigBurst(140)
    } else if (n >= 3) {
      setEggHint('psst — the countdown seems to like attention...')
    }
  }

  const fireMore = () => {
    bigBurst(80)
    setTimeout(() => bigBurst(80), 350)
  }

  const jump = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="app">
      <Stars />
      <Confetti />
      <Balloons />
      <FireworksOverlay auto={opened} />

      <div className={`start-screen ${opening ? 'opening' : ''}`}>
        <div className="envelope" onClick={open} role="button" aria-label="Open the gift">
          <div className="env-letter">
            <p className="env-line1">Happy Birthday</p>
            <p className="env-line2">to the best sister</p>
          </div>
          <div className="env-front" />
          <div className="env-flap" />
          <div className="wax-seal">
            <span>G</span>
          </div>
        </div>
        <h1 className="start-title">Grace Ishimwe</h1>
        <p className="start-sub">A little gift, sealed with love — best with sound on.</p>
        <button type="button" className="open-btn" onClick={open}>
          Open it, Grace
        </button>
      </div>

      {opened && (
        <main className="content reveal">
          <div className="song-corner">
            <aside className={`song-panel ${panelOpen ? 'open' : ''} ${youtubeError ? 'hidden' : ''}`}>
              <div className="song-panel-head" onClick={() => setPanelOpen((v) => !v)}>
                <span className="mini-note" aria-hidden="true" />
                <span className="song-panel-title">{SONG_TITLE}</span>
                <a
                  href={SONG_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="song-panel-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  Watch on YouTube
                </a>
              </div>
              <div className="song-body">
                <SongPlayer
                  ref={songRef}
                  videoId={SONG_VIDEO_ID}
                  autoStart={opened}
                  onReady={() => setYoutubeReady(true)}
                  onError={() => setYoutubeError(true)}
                  onPlay={() => {
                    setYoutubePlaying(true)
                    setPanelOpen(true)
                  }}
                  onPause={() => setYoutubePlaying(false)}
                />
                <p className="song-tip">
                  {youtubeReady
                    ? 'If it does not start on its own, just tap play.'
                    : 'Loading the song...'}
                </p>
              </div>
            </aside>

            <div className="music-float">
              <button type="button" className="music-btn" onClick={togglePrimary}>
                <span className="music-note">{songBroken ? 'Backup melody' : 'Happy Birthday song'}</span>
                <span className="music-state">{sourcePlaying ? 'Pause' : 'Play'}</span>
              </button>
            </div>
          </div>

          <nav className="chapter-nav" aria-label="Chapters">
            {CHAPTERS.map((c, i) => (
              <button
                key={c.id}
                type="button"
                className="chapter-dot"
                onClick={() => jump(c.id)}
                title={`${i + 1}. ${c.label}`}
              >
                <span>{c.label}</span>
              </button>
            ))}
          </nav>

          <section id="chapter-hello" className="hero">
            <p className="hero-kicker">Born September 10</p>
            <h1 className="hero-title">
              Happy Birthday,
              <br />
              Grace.
            </h1>

            <div className="countdown" onClick={peck} role="button">
              {cd.isToday ? (
                <p className="today-line">It is your day — and the whole world is celebrating you!</p>
              ) : (
                <div className="cd-boxes">
                  <div className="cd-box">
                    <span className="cd-num">{cd.days}</span>
                    <span className="cd-label">days</span>
                  </div>
                  <div className="cd-box">
                    <span className="cd-num">{cd.hours}</span>
                    <span className="cd-label">hours</span>
                  </div>
                  <div className="cd-box">
                    <span className="cd-num">{cd.minutes}</span>
                    <span className="cd-label">minutes</span>
                  </div>
                  <div className="cd-box">
                    <span className="cd-num">{cd.seconds}</span>
                    <span className="cd-label">seconds</span>
                  </div>
                </div>
              )}
              <p className="cd-caption">
                {cd.isToday
                  ? 'of candles waiting to be blown out'
                  : 'until the day the most wonderful sister was born'}
              </p>
              {eggHint && <p className="egg-hint">{eggHint}</p>}
            </div>

            {secret && (
              <div className="secret-card">
                <p className="secret-ps">P.S. — you found it</p>
                <p>
                  You are not just my sister — you are my favorite sequel, my loudest laughter,
                  and the first person I will ever call. If you found this, today is already
                  going your way.
                </p>
              </div>
            )}

            <p className="hero-caption">Scroll softly — this little page goes down memory lane, chapter by chapter.</p>
          </section>

          <Album photos={photos} />

          <div className="divider" />

          <Letter active={opened} photo={photo6} photoCaption="Where all those years were leading" />

          <div className="divider" />

          <VoiceNote />

          <div className="divider" />

          <Cake />

          <div className="divider" />

          <Wishes />

          <div className="divider" />

          <section id="chapter-finale" className="finale-section">
            <h2 className="finale-title">Happy Birthday, Grace Ishimwe!</h2>
            <p className="finale-sub">
              Born September 10 — proof that the world knows how to make good things.
            </p>
            <button type="button" className="open-btn finale-btn" onClick={togglePrimary}>
              {sourcePlaying ? 'Pause the birthday song' : 'Play the birthday song'}
            </button>
            <button type="button" className="ghost-btn" onClick={fireMore}>
              More fireworks
            </button>
            <p className="finale-signature">With all the love a sister can hold</p>
          </section>

          <footer className="footer">
            Made with love, for the sister who means the world.
          </footer>
        </main>
      )}
    </div>
  )
}