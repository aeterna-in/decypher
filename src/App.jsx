import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useGlitch } from 'react-powerglitch'
import './App.css'

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@%$*&!()+-'
// oxlint-disable react/refs -- useGlitch exposes a callback ref, not a ref object
function GlitchWordmark() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const glitch = useGlitch({
    playMode: reduced ? 'hover' : 'always',
    timing: { duration: 4800, iterations: Infinity },
    glitchTimeSpan: { start: 0.28, end: 0.42 },
    shake: { velocity: 20, amplitudeX: 0.2, amplitudeY: 0.1 },
    slice: {
      count: 6,
      velocity: 18,
      minHeight: 0.02,
      maxHeight: 0.11,
      hueRotate: false,
    },
    pulse: false,
  })
  const glitchRef = glitch.ref
  return (
    <div className="wordmark" role="img" aria-label="de:CYPHER">
      <img ref={glitchRef} src="/wordmark.png" alt="" draggable="false" />
    </div>
  )
}

function App() {
  const page = useRef(null)
  const eyebrow = useRef(null)

  useEffect(() => {
    let scrambleTimer
    const ctx = gsap.context(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const label = eyebrow.current.dataset.text
      let frame = 0
      scrambleTimer = setInterval(() => {
        frame += 1

        eyebrow.current.textContent = label
          .split('')
          .map((char, i) => {
            if (char === ' ') return char
            if (frame > i * 2 + 8) return char
            return SCRAMBLE_CHARS[
              Math.floor(Math.random() * SCRAMBLE_CHARS.length)
            ]
          })
          .join('')

        if (frame > label.length * 2 + 20) {
          clearInterval(scrambleTimer)
          eyebrow.current.textContent = label
        }
      }, 60)

      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from('.topbar', { y: -16, opacity: 0, duration: 0.8 })
        .from('.eyebrow', { opacity: 0, y: 10, duration: 0.7 }, 0.2)
        .from(
          '.wordmark',
          {
            clipPath: 'inset(0 0 100% 0)',
            y: 24,
            opacity: 0,
            duration: 1.3,
            ease: 'expo.out',
          },
          0.35,
        )
        .from('.footer', { opacity: 0, duration: 0.8 }, 1)

      gsap.to('.glow', {
        xPercent: 8,
        yPercent: -6,
        scale: 1.1,
        duration: 12,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })
    }, page)

    return () => {
      clearInterval(scrambleTimer)
      ctx.revert()
    }
  }, [])

  return (
    <div className="page" ref={page}>
      <div className="backdrop" aria-hidden="true">
        <div className="glow" />
        <div className="grain" />
      </div>

      <header className="topbar">
        <a href="/" aria-label="Decypher home">
          <img src="/wordmark.png" alt="Decypher" />
        </a>
        <span className="launching">Launching soon</span>
      </header>

      <main>
        <p className="eyebrow" ref={eyebrow} data-text="A real-world treasure hunt">
          A real-world treasure hunt
        </p>

        <GlitchWordmark />
      </main>

      <footer className="footer">
        <span>© Æterna Innovations</span>
        <span>By Padmanabh P V</span>
      </footer>
    </div>
  )
}

export default App
