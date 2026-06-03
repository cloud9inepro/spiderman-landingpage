import { useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Scene from './Scene'

gsap.registerPlugin(ScrollTrigger)

const F = 'Bebas Neue, sans-serif'

const App = () => {
  const scrollRef  = useRef<HTMLDivElement>(null)
  const bgRef      = useRef<HTMLDivElement>(null)
  const trailerRef = useRef<HTMLDivElement>(null)
  const dotRef     = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Background parallax
      gsap.to(bgRef.current, {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: scrollRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      })

      // Play trailer fades out early into scroll
      gsap.to(trailerRef.current, {
        opacity: 0,
        y: 16,
        scrollTrigger: {
          trigger: scrollRef.current,
          start: '8% top',
          end: '20% top',
          scrub: 1,
        },
      })

      // Scroll indicator dot travels top → bottom
      gsap.to(dotRef.current, {
        top: '92%',
        ease: 'none',
        scrollTrigger: {
          trigger: scrollRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      })

    })
    return () => ctx.revert()
  }, [])

  return (
    <div ref={scrollRef} className="relative h-[300vh]">

      {/* ── Sticky viewport ──────────────────────────────────────── */}
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* Background */}
        <div
          ref={bgRef}
          className="absolute inset-0 bg-[url('/bg-img.webp')] bg-cover bg-center blur-lg scale-110 -z-10"
        />

        {/* Canvas */}
        <Canvas
          frameloop="always"
          className="absolute inset-0"
          style={{ width: '100%', height: '100%' }}
          camera={{ position: [0, 9, 5], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <Environment files="/envmap.hdr" />
          <Scene scrollRef={scrollRef} />
        </Canvas>

        {/* ── Navbar ─────────────────────────────────────────────── */}
        <header className="absolute top-0 left-0 right-0 z-10
                           flex items-center justify-between
                           px-5 py-4 md:px-8 md:py-5">

          <div className="flex items-center gap-3 md:gap-4 cursor-pointer">
            {/* Spider icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white" className="md:w-[22px] md:h-[22px]">
              <circle cx="12" cy="8" r="3.5"/>
              <path d="M12 11.5 Q6 14 4 20 H20 Q18 14 12 11.5Z"/>
              <line x1="12" y1="8" x2="3"  y2="4"  stroke="white" strokeWidth="1.2"/>
              <line x1="12" y1="8" x2="21" y2="4"  stroke="white" strokeWidth="1.2"/>
              <line x1="5"  y1="16" x2="0" y2="13" stroke="white" strokeWidth="1.2"/>
              <line x1="19" y1="16" x2="24" y2="13" stroke="white" strokeWidth="1.2"/>
            </svg>
            {/* Hamburger */}
            <svg width="18" height="12" viewBox="0 0 20 13" fill="white" className="md:w-[20px] md:h-[13px]">
              <rect width="20" height="1.8" rx="1"/>
              <rect y="5.6"  width="20" height="1.8" rx="1"/>
              <rect y="11.2" width="20" height="1.8" rx="1"/>
            </svg>
          </div>

          <span style={{
            fontFamily: F,
            fontSize: 'clamp(17px, 3vw, 26px)',
            letterSpacing: 6,
            color: '#e03030',
            textShadow: '0 0 28px rgba(220,40,40,0.55)',
          }}>
            SPIDER-MAN
          </span>

          {/* Desktop button */}
          <button className="hidden sm:block rounded-full font-bold cursor-pointer bg-white text-black border-none"
            style={{
              padding: 'clamp(8px, 1vw, 10px) clamp(14px, 2vw, 24px)',
              fontSize: 'clamp(9px, 1vw, 11px)',
              letterSpacing: 1.5,
            }}>
            BUY TICKETS
          </button>

          {/* Mobile button — condensed */}
          <button className="sm:hidden text-white rounded-full border border-white/60 font-bold"
            style={{ fontSize: 9, letterSpacing: 1.5, padding: '6px 12px' }}>
            TICKETS
          </button>
        </header>

        {/* ── Play Trailer ───────────────────────────────────────── */}
        <div
          ref={trailerRef}
          className="absolute z-10 flex items-center gap-3"
          style={{ bottom: '14%', left: '6%' }}
        >
          <button
            className="rounded-full border border-white/65 bg-transparent
                       flex items-center justify-center cursor-pointer
                       w-[38px] h-[38px] md:w-[50px] md:h-[50px]"
          >
            <svg width="11" height="13" viewBox="0 0 13 15" fill="white">
              <path d="M0 0 L13 7.5 L0 15Z"/>
            </svg>
          </button>
          <span style={{
            color: '#fff',
            fontSize: 'clamp(9px, 1.2vw, 12px)',
            fontWeight: 700,
            letterSpacing: 2,
          }}>
            PLAY TRAILER
          </span>
        </div>

        {/* ── SCROLL button — center bottom, desktop only ─────────── */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 z-10
                        flex-col items-center gap-1.5 cursor-pointer"
          style={{ bottom: '10%' }}>
          <svg width="10" height="7" viewBox="0 0 10 7" fill="rgba(255,255,255,0.45)">
            <path d="M5 0 L10 7 H0Z"/>
          </svg>
          <div className="rounded-full border border-white/40 flex items-center justify-center"
            style={{ width: 58, height: 58 }}>
            <span style={{ color: '#fff', fontSize: 9, letterSpacing: 2, fontWeight: 600 }}>
              SCROLL
            </span>
          </div>
          <svg width="10" height="7" viewBox="0 0 10 7" fill="rgba(255,255,255,0.45)">
            <path d="M5 7 L0 0 H10Z"/>
          </svg>
        </div>

        {/* ── Right scroll progress indicator, desktop only ────────── */}
        <div
          className="hidden md:block absolute z-10 w-px bg-white/20"
          style={{ right: 28, top: '10%', bottom: '10%' }}
        >
          <div
            ref={dotRef}
            className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white"
            style={{ top: '0%' }}
          />
        </div>

        {/* ── Footer credits ─────────────────────────────────────── */}
        <div
          className="absolute z-10 flex justify-between left-[5%] right-[5%]"
          style={{ bottom: '3.5%', color: 'rgba(255,255,255,0.32)', fontSize: 11, letterSpacing: 0.8 }}
        >
          <span>Marvel Studio</span>
          <span>Sony Pictures ©</span>
        </div>

      </div>
    </div>
  )
}

export default App