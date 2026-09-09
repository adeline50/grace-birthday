import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

export const SONG_VIDEO_ID = 'l9O_SFcH4Kk'
export const SONG_TITLE = 'Harmonize - Happy Birthday'
export const SONG_URL = `https://www.youtube.com/watch?v=${SONG_VIDEO_ID}`

let apiPromise = null

function loadYouTubeApi() {
  if (!apiPromise) {
    apiPromise = new Promise((resolve, reject) => {
      if (window.YT && window.YT.Player) {
        resolve()
        return
      }
      if (window.__giftYtApiLoading) {
        const wait = setInterval(() => {
          if (window.YT && window.YT.Player) {
            clearInterval(wait)
            resolve()
          }
        }, 100)
        return
      }
      window.__giftYtApiLoading = true
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      tag.async = true
      tag.onerror = () => reject(new Error('YouTube API failed to load'))
      document.head.appendChild(tag)
      window.onYouTubeIframeAPIReady = () => resolve()
    })
  }
  return apiPromise
}

const SongPlayer = forwardRef(function SongPlayer(
  { videoId, autoStart = false, onReady, onError, onPlay, onPause },
  ref,
) {
  const targetRef = useRef(null)
  const playerRef = useRef(null)
  const startedRef = useRef(false)
  const cbRef = useRef({ onReady, onError, onPlay, onPause })
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    cbRef.current = { onReady, onError, onPlay, onPause }
  })

  useEffect(() => {
    let cancelled = false
    loadYouTubeApi()
      .then(() => {
        if (cancelled || playerRef.current) return
        playerRef.current = new window.YT.Player(targetRef.current, {
          videoId,
          playerVars: {
            playsinline: 1,
            rel: 0,
            controls: 1,
            origin: window.location.origin,
          },
          events: {
            onReady: () => {
              if (cancelled) return
              setReady(true)
              setFailed(false)
              if (cbRef.current.onReady) cbRef.current.onReady()
            },
            onError: () => {
              if (cancelled) return
              setFailed(true)
              if (cbRef.current.onError) cbRef.current.onError()
            },
            onStateChange: (e) => {
              if (!window.YT || !window.YT.PlayerState) return
              if (e.data === window.YT.PlayerState.PLAYING) {
                if (cbRef.current.onPlay) cbRef.current.onPlay()
              } else if (
                e.data === window.YT.PlayerState.PAUSED ||
                e.data === window.YT.PlayerState.ENDED
              ) {
                if (cbRef.current.onPause) cbRef.current.onPause()
              }
            },
          },
        })
      })
      .catch(() => {
        if (!cancelled) {
          setFailed(true)
          if (cbRef.current.onError) cbRef.current.onError()
        }
      })
    return () => {
      cancelled = true
    }
  }, [videoId])

  useEffect(() => {
    if (ready && autoStart && !startedRef.current) {
      startedRef.current = true
      const p = playerRef.current
      if (p) {
        p.mute()
        p.playVideo()
        window.setTimeout(() => {
          if (playerRef.current) playerRef.current.unMute()
        }, 450)
      }
    }
  }, [ready, autoStart])

  useEffect(
    () => () => {
      if (playerRef.current && playerRef.current.destroy) {
        try {
          playerRef.current.destroy()
        } catch {
          /* noop */
        }
        playerRef.current = null
      }
    },
    [],
  )

  useImperativeHandle(ref, () => ({
    play: () => {
      if (playerRef.current) playerRef.current.playVideo()
    },
    pause: () => {
      if (playerRef.current) playerRef.current.pauseVideo()
    },
    toggle: () => {
      if (!playerRef.current || !window.YT) return
      const state = playerRef.current.getPlayerState()
      if (state === window.YT.PlayerState.PLAYING) {
        playerRef.current.pauseVideo()
      } else {
        playerRef.current.playVideo()
      }
    },
  }))

  return (
    <div className={`song-embed ${ready ? 'ready' : ''} ${failed ? 'failed' : ''}`}>
      <div ref={targetRef} className="song-embed-target" />
      {!ready && !failed && <p className="song-status">Tuning the song...</p>}
    </div>
  )
})

export default SongPlayer