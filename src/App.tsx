import { useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Scene from './Scene'

gsap.registerPlugin(ScrollTrigger)

const App = () => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const bgRef     = useRef<HTMLDivElement>(null)
  const trailerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(bgRef.current, {
        yPercent: -20,              // bg drifts up slightly as you scroll — parallax feel
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
      <div className="sticky top-0 h-screen overflow-hidden">

        <div
          ref={bgRef}
          className="absolute inset-0 bg-[url('/bg-img.webp')] bg-cover bg-center blur-lg scale-110 -z-10"
        />

        <Canvas
          frameloop="always"         // ← KEY FIX: lets GSAP camera mutations actually render
          className="absolute inset-0"
          style={{ width: '100%', height: '100%' }}
          camera={{ position: [0, 9, 5], fov: 50 }}
          gl={{ antialias: true }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <Environment files="/envmap.hdr" />
          <Scene scrollRef={scrollRef} />
          {/* <OrbitControls /> */}
        </Canvas>

      </div>

       {/* Navbar */}
          <header style={{
            position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '22px 30px',
          }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', cursor: 'pointer' }}>
              {/* Spider icon */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                <circle cx="12" cy="8" r="3.5"/>
                <path d="M12 11.5 Q6 14 4 20 H20 Q18 14 12 11.5Z"/>
                <line x1="12" y1="8" x2="3" y2="4"  stroke="white" strokeWidth="1.2"/>
                <line x1="12" y1="8" x2="21" y2="4" stroke="white" strokeWidth="1.2"/>
                <line x1="5"  y1="16" x2="0" y2="13" stroke="white" strokeWidth="1.2"/>
                <line x1="19" y1="16" x2="24" y2="13" stroke="white" strokeWidth="1.2"/>
              </svg>
              {/* Hamburger */}
              <svg width="20" height="13" viewBox="0 0 20 13" fill="white">
                <rect width="20" height="1.8" rx="1"/>
                <rect y="5.6" width="20" height="1.8" rx="1"/>
                <rect y="11.2" width="20" height="1.8" rx="1"/>
              </svg>
            </div>
            <span style={{
              fontFamily: 'Bebas Neue', fontSize: 26, letterSpacing: 6,
              color: '#e03030', textShadow: '0 0 28px rgba(220,40,40,0.55)',
            }}>
              SPIDER-MAN
                        </span>
            <button style={{
              background: '#fff', color: '#111', border: 'none',
              padding: '10px 24px', borderRadius: 50,
              fontSize: 11, fontWeight: 700, letterSpacing: 1.5, cursor: 'pointer',
            }}>
              BUY TICKETS
            </button>
          </header>

           {/* PLAY TRAILER — section 1, bottom-left */}
          <div ref={trailerRef} style={{
            position: 'absolute', bottom: '14%', left: '6%',
            zIndex: 5, display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <button style={{
              width: 50, height: 50, borderRadius: '50%',
              border: '1.5px solid rgba(255,255,255,0.65)',
              background: 'transparent', display: 'flex',
              alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}>
              <svg width="13" height="15" viewBox="0 0 13 15" fill="white">
                <path d="M0 0 L13 7.5 L0 15Z"/>
              </svg>
            </button>
            <span style={{ color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: 2 }}>
              PLAY TRAILER
            </span>
          </div>

    </div>
  )
}

export default App