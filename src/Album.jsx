import { useEffect, useState } from 'react'

export default function Album({ photos }) {
  const [index, setIndex] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const DURATION = 4000

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % photos.length), DURATION)
    return () => clearInterval(id)
  }, [photos.length])

  const prev = () => setIndex((i) => (i - 1 + photos.length) % photos.length)
  const next = () => setIndex((i) => (i + 1) % photos.length)

  return (
    <section id="chapter-album" className="album-section">
      <h2 className="section-title">How far you have come</h2>
      <p className="section-sub">Ten little chapters of you, youngest to today.</p>

      <div className="album">
        <div className="slideshow">
          <span className="chapter-flag">
            Memory {index + 1} / {photos.length}
          </span>
          <div className="progress-bar" key={index}>
            <span className="progress-fill" style={{ animationDuration: `${DURATION}ms` }} />
          </div>

          <button type="button" className="nav-arrow prev" onClick={prev} aria-label="Previous photo">
            &#10094;
          </button>
          <button type="button" className="nav-arrow next" onClick={next} aria-label="Next photo">
            &#10095;
          </button>

          <div className="lightbox-opener" onClick={() => setLightbox(true)}>
            {photos.map((p, i) => (
              <div key={i} className={`slide ${i === index ? 'active' : ''}`} aria-hidden={i !== index}>
                <img src={p.src} alt="" />
              </div>
            ))}
            <p className="slide-caption">{photos[index].caption}</p>
          </div>

          <div className="dots">
            {photos.map((p, i) => (
              <button
                key={i}
                type="button"
                className={`dot ${i === index ? 'current' : ''}`}
                onClick={() => setIndex(i)}
                aria-label={`Photo ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="thumbnails">
          {photos.map((p, i) => (
            <button
              key={i}
              type="button"
              className={`thumb ${i === index ? 'current' : ''}`}
              onClick={() => setIndex(i)}
              aria-label={`Photo ${i + 1}`}
            >
              <img src={p.src} alt="" />
            </button>
          ))}
        </div>
        <p className="tap-hint">Tap a memory for a closer look</p>
      </div>

      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(false)}>
          <div className="lightbox-card" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="lightbox-close" onClick={() => setLightbox(false)}>
              Close
            </button>
            <img src={photos[index].src} alt="" />
            <p className="lightbox-caption">{photos[index].caption}</p>
          </div>
        </div>
      )}
    </section>
  )
}