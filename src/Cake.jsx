import { useRef, useState } from 'react'

const CANDLES = 5

export default function Cake() {
  const [lit, setLit] = useState(true)
  const [wished, setWished] = useState(false)
  const stageRef = useRef(null)

  const blowOut = () => {
    if (!lit) return
    setLit(false)
    setWished(true)
    const box = stageRef.current && stageRef.current.getBoundingClientRect()
    window.dispatchEvent(
      new CustomEvent('fireworks:burst', {
        detail: box
          ? { x: box.left + box.width / 2, y: box.top + 40, count: 90, speed: 7 }
          : { count: 90, speed: 7 },
      }),
    )
  }

  return (
    <section id="chapter-cake" className="cake-section">
      <h2 className="section-title">An extra slice of sweet, just for today</h2>
      <p className="section-sub">Close your eyes, make a wish... then blow.</p>

      <div className="cake-stage" ref={stageRef}>
        <div className={`cake ${lit ? '' : 'out'}`}>
          <div className="candles">
            {Array.from({ length: CANDLES }).map((_, i) => (
              <div key={i} className="candle">
                <div className="candle-flame" />
                <div className="candle-smoke" />
              </div>
            ))}
          </div>
          <div className="cake-top" />
          <div className="cake-body tier-top" />
          <div className="cake-body tier-bottom" />
          <div className="cake-plate" />
          <div className="cake-deco left" />
          <div className="cake-deco right" />
        </div>

        <p className="cake-hint">
          {lit
            ? 'Go on, Grace — picture everything you want this year.'
            : 'Your wish left with the smoke. It always comes back true.'}
        </p>

        <button
          type="button"
          className={`wish-btn ${lit ? '' : 'done'}`}
          onClick={blowOut}
          disabled={!lit}
        >
          {lit ? 'Blow out the candles' : 'Wish sent, love attached'}
        </button>

        {wished && (
          <div className="wish-card">
            <p>
              The candles heard you. Whatever you wished for, Grace, I am already
              cheering it on with my whole heart.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}