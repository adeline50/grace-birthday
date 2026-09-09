import { useEffect, useRef } from 'react'

const COLORS = ['#ff6b9d', '#ffd166', '#9b5de5', '#06d6a0', '#4cc9f0', '#ffffff', '#ff8fab']

class Fireworks {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.dpr = Math.min(window.devicePixelRatio || 1, 2)
    this.particles = []
    this.rockets = []
    this.running = true
    this.timer = null
    this.w = window.innerWidth
    this.h = window.innerHeight

    this.resize = this.resize.bind(this)
    this.onBurst = this.onBurst.bind(this)
    window.addEventListener('resize', this.resize)
    window.addEventListener('fireworks:burst', this.onBurst)
    this.resize()
    this.frame = this.frame.bind(this)
    requestAnimationFrame(this.frame)
  }

  resize() {
    const w = window.innerWidth
    const h = window.innerHeight
    this.w = w
    this.h = h
    this.canvas.width = w * this.dpr
    this.canvas.height = h * this.dpr
    this.canvas.style.width = `${w}px`
    this.canvas.style.height = `${h}px`
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
  }

  auto(ms) {
    this.timer = setInterval(() => this.spawnRocket(), ms)
  }

  stopAuto() {
    clearInterval(this.timer)
    this.timer = null
  }

  spawnRocket() {
    const targetX = this.w * (0.18 + Math.random() * 0.64)
    const targetY = this.h * (0.12 + Math.random() * 0.42)
    this.rockets.push({
      x: targetX + (Math.random() - 0.5) * 90,
      y: this.h + 8,
      vx: (Math.random() - 0.5) * 1.4,
      vy: -(7.5 + Math.random() * 2.6),
      targetY,
    })
  }

  onBurst(e) {
    const d = e.detail || {}
    this.burst(d.x ?? this.w / 2, d.y ?? this.h / 2, d.count ?? 70, d.speed ?? 6)
  }

  burst(x, y, count = 60, speed = 6) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count
      const v = speed * (0.55 + Math.random() * 0.9)
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * v,
        vy: Math.sin(angle) * v,
        life: 1,
        decay: 0.012 + Math.random() * 0.02,
        color: COLORS[i % COLORS.length],
        size: 1.4 + Math.random() * 1.8,
      })
    }
  }

  frame() {
    if (!this.running) return
    this.ctx.clearRect(0, 0, this.w, this.h)
    this.drawRockets()
    this.drawParticles()
    requestAnimationFrame(this.frame)
  }

  drawRockets() {
    for (let i = this.rockets.length - 1; i >= 0; i--) {
      const r = this.rockets[i]
      r.vy += 0.12
      r.x += r.vx
      r.y += r.vy
      this.ctx.fillStyle = 'rgba(255,255,255,0.9)'
      this.ctx.beginPath()
      this.ctx.arc(r.x, r.y, 1.6, 0, Math.PI * 2)
      this.ctx.fill()
      if (r.vy >= -0.6 || r.y <= r.targetY) {
        this.burst(r.x, r.y, 74, 5.5)
        this.rockets.splice(i, 1)
      }
    }
  }

  drawParticles() {
    this.ctx.globalCompositeOperation = 'lighter'
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i]
      p.vy += 0.045
      p.vx *= 0.985
      p.x += p.vx
      p.y += p.vy
      p.life -= p.decay
      if (p.life <= 0) {
        this.particles.splice(i, 1)
        continue
      }
      this.ctx.globalAlpha = Math.max(p.life, 0)
      this.ctx.fillStyle = p.color
      this.ctx.beginPath()
      this.ctx.arc(p.x, p.y, p.size * Math.max(p.life, 0), 0, Math.PI * 2)
      this.ctx.fill()
    }
    this.ctx.globalAlpha = 1
    this.ctx.globalCompositeOperation = 'source-over'
  }

  destroy() {
    this.running = false
    window.removeEventListener('resize', this.resize)
    window.removeEventListener('fireworks:burst', this.onBurst)
    this.stopAuto()
  }
}

export default function FireworksOverlay({ auto = false }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const fw = new Fireworks(canvas)
    if (auto) fw.auto(2600)

    const onPointer = (e) => fw.burst(e.clientX, e.clientY, 26, 4.5)
    window.addEventListener('pointerdown', onPointer)

    return () => {
      window.removeEventListener('pointerdown', onPointer)
      fw.destroy()
    }
  }, [auto])

  return <canvas ref={ref} className="fw-canvas" aria-hidden="true" />
}