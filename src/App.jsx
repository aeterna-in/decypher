import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGlitch } from 'react-powerglitch'
import Snowfall from 'react-snowfall'
import YouTube from 'react-youtube'
import './App.css'

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@%$*&!()+-'

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
  const playerRef = useRef(null)
  const [showSnow, setShowSnow] = useState(false)
  const videoId = 'kFaFzk8zoT4' 

  useEffect(() => {
    let scrambleTimer
    const ctx = gsap.context(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {setShowSnow(true);return}
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
          setShowSnow(true)
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

  const onPlayerReady = (event)=>{
    playerRef.current = event.target
    playerRef.current.unMute()
    playerRef.current.playVideo()
  }

  const playerOptions = {
    height: '0',
    width: '0',
    playerVars:{
      autoplay: 1,
      controls: 0,
      disablekb: 1,
      fs: 0,
      modestbranding: 1,
      rel: 0,
      loop: 1,
      playlist: videoId
    }
  }

  return (
    <div className="page" ref={page}>
      {showSnow &&(
        <Snowfall style={
          { 
            position: 'fixed', 
            width: '100vw', 
            height: '100vh', 
            zIndex: 999, 
            pointerEvents: 'none' 
          }
        }/>
      )}
      <div style={{ display: 'none', position: 'absolute', width: 0, height: 0 }}>
        <YouTube videoId={videoId} opts={playerOptions} onReady={onPlayerReady} />
      </div>
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
