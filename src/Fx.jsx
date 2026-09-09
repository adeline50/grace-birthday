import { useState } from 'react'

export function Confetti() {
  const [pieces] = useState(() =>
    Array.from({ length: 55 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 6,
      duration: 5 + Math.random() * 5,
      size: 6 + Math.random() * 8,
      color: ['#ff6b9d', '#ffd166', '#9b5de5', '#06d6a0', '#4cc9f0', '#ffffff'][i % 6],
      rotate: Math.random() * 360,
    })),
  )
  return (
    <div className="confetti-layer" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.6,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  )
}

export function Balloons() {
  const [balloons] = useState(() =>
    Array.from({ length: 11 }, (_, i) => ({
      id: i,
      left: (i * 9.1 + Math.random() * 4) % 100,
      delay: Math.random() * 10,
      duration: 11 + Math.random() * 8,
      size: 52 + Math.random() * 30,
      hue: [330, 45, 270, 170, 195, 25][i % 6],
      sway: 4 + Math.random() * 6,
    })),
  )
  return (
    <div className="balloon-layer" aria-hidden="true">
      {balloons.map((b) => {
        const style = {
          left: `${b.left}%`,
          ['--sway']: `${b.sway}px`,
        }
        return (
          <div key={b.id} className="balloon-wrap" style={style}>
            <div
              className="balloon"
              style={{
                width: b.size,
                height: b.size * 1.2,
                background: `hsl(${b.hue} 85% 75%)`,
                animationDelay: `${b.delay}s`,
                animationDuration: `${b.duration}s`,
              }}
            />
          </div>
        )
      })}
    </div>
  )
}

export function Stars() {
  const [dots] = useState(() =>
    Array.from({ length: 70 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 4,
      size: 2 + Math.random() * 3,
    })),
  )
  return (
    <div className="stars" aria-hidden="true">
      {dots.map((d) => (
        <span
          key={d.id}
          className="star"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size,
            height: d.size,
            animationDelay: `${d.delay}s`,
          }}
        />
      ))}
    </div>
  )
}