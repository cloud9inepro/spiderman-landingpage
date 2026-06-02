import { useRef, useEffect, useMemo } from 'react'
import { useGLTF, Text } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTexture } from '@react-three/drei'
import { Box3, Vector3, RepeatWrapping } from 'three'

gsap.registerPlugin(ScrollTrigger)

const CAMERA_HEAD_Y = 9    // matches canvas camera.position.y — tune to show head
const CAMERA_FEET_Y = 2   // where camera ends up — tune to show feet

export default function Scene({ scrollRef }) {
  const { scene }  = useGLTF('/spiderman.glb')
  const {scene: eye} = useGLTF('/eyeglass.glb')
  const { camera, size } = useThree() 
  const modelRef   = useRef()
  const eyeRef   = useRef()
  const floorRef   = useRef()
  const groupRef  = useRef()

  // Load all your PBR maps at once
  const floorMaps = useTexture({
    map:          '/textures/floor_diffuse.jpg',
    normalMap:    '/textures/floor_normal.jpg',
    roughnessMap: '/textures/floor_roughness.jpg',
    aoMap:        '/textures/floor_ao.jpg',
    displacementMap: '/textures/floor_displacement.jpg',
  })


   const r = useMemo(() => {
    const w = size.width

    if (w < 768) return {
      scale:     0.061,
      cameraZ:   10,
      headY:     7,
      feetY:     1.5,
      floorR:    2,
      titleSize: 0.45,
      bodySize:  0.15,
      title:     [-1.2,   9,    -1  ],
      director:  [-0.8, 6.5,  0.5],
      cast:      [0,    4.5,  0.5],
      date:      [0,    1.5,  0  ],
    }

     if (w < 1024) return {
      scale:     0.055,
      cameraZ:   6,
      headY:     8,
      feetY:     1.8,
      floorR:    2.5,
      titleSize: 0.7,
      bodySize:  0.2,
      title:     [-2,   9.5,  -1 ],
      director:  [-1.3, 7,    0.8],
      cast:      [0.3,  5,    0.8],
      date:      [0.3,  1.5,  0  ],
    }

      return {
      scale:     0.065,
      cameraZ:   5,
      headY:     9,
      feetY:     2,
      floorR:    3,
      titleSize: 0.9,
      bodySize:  0.25,
      title:     [-2.5, 10,   -1 ],
      director:  [-1.7, 7,    1  ],
      cast:      [0.5,  5,    1  ],
      date:      [0.5,  1,    0  ],
    }
  }, [size.width])

  useEffect(() => {
  // Center model on X/Z so it spins in place — Y stays at -1.5 (feet level)
  if (modelRef.current) {
    modelRef.current.updateWorldMatrix(true, true)

    const box    = new Box3().setFromObject(modelRef.current)
    const center = new Vector3()
    box.getCenter(center)

    modelRef.current.position.x -= center.x  // cancel out the X offset
    modelRef.current.position.z -= center.z  // cancel out the Z offset
  }

  // uv2 for aoMap
  if (floorRef.current) {
    const geo = floorRef.current.geometry
    geo.setAttribute('uv2', geo.getAttribute('uv'))
  }

  // Texture repeat
  Object.values(floorMaps).forEach(tex => {
    tex.wrapS = tex.wrapT = RepeatWrapping
    tex.repeat.set(2, 2)
    tex.needsUpdate = true
  })
}, [scene])

   useEffect(() => {
    // Apply repeat wrapping to every map
    Object.values(floorMaps).forEach(tex => {
      tex.wrapS = tex.wrapT = RepeatWrapping
      tex.repeat.set(2, 2)    // tile — adjust to taste
      tex.needsUpdate = true
    })

    // circleGeometry has no uv2 by default — aoMap needs it
    if (floorRef.current) {
      const geo = floorRef.current.geometry
      geo.setAttribute('uv2', geo.getAttribute('uv'))
    }
  }, [])


  useGSAP(() => {
    if (!groupRef.current || !scrollRef?.current) return

    // R3F default lookAt is [0,0,0] — fix it to look straight ahead at head level
    camera.lookAt(0, camera.position.y, 0)

    // This plain object travels alongside camera.position.y
    // so camera.lookAt stays horizontal throughout the scroll
    const lookAt = { y: camera.position.y }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
      },
    })

    tl
      // Camera descends — model stays still, camera scans head → feet
      .to([camera.position, lookAt], {
        y: CAMERA_FEET_Y,
        ease: 'none',
        onUpdate: () => camera.lookAt(0, lookAt.y, 0),
      }, 0)

      // Model rotates on Y — only rotation, never position
      .to(groupRef.current.rotation, {
        y: -Math.PI * 1.5,
        ease: 'none',
      }, 0)

  }, [])

  return (
    <>
    <group ref={groupRef}>
    // position and scale never change — model is fixed in world space
    <primitive
      ref={modelRef}
      object={scene}
      position={[0, 0, 0]}
      scale={r.scale}
    />


     {/* Floor plane — y matches model position.y so it sits right under the feet */}
      <mesh 
        ref={floorRef}
        rotation={[-Math.PI / 2, 0, 0]}   // rotate flat
        position={[0, 0.0, 0]}           // same Y as model base
      >
        <circleGeometry args={[3, 64]} />  {/* radius 3, 64 segments for smooth edge */}
        <meshStandardMaterial
          {...floorMaps}
          aoMapIntensity={1}
          roughness={1}       // let roughnessMap drive it — set to 1 as base
          displacementScale={0.1} // adjust for more/less pronounced bumps
        />
      </mesh>

      <primitive
      ref={eyeRef}
      object={eye}
      position={[0, 0.1, 1.1]}
      rotation={[0, Math.PI/1, 0]} // rotate 180 degrees on Y to face the camera
      scale={5}
    />

      </group>

     {/* Head area — visible at start */}
      <Text
        position={r.title}
        fontSize={r.titleSize}
        lineHeight={2}
        letterSpacing={0.2}
        color="white"
        font="/fonts/BebasNeue-Regular.ttf"
        anchorX="left"
        anchorY="middle"
      >
        NO WAY HOME
      </Text>

       {/* Torso area — camera reaches this mid-scroll */}
      <Text
        position={r.director}
        fontSize={r.bodySize}
        color="white"
        font="/fonts/BebasNeue-Regular.ttf"
        anchorX="left"
        lineHeight={1.3}
      >
        {`DIRECTED BY\nJON WATTS`}
      </Text>



      {/* Legs/feet area — camera reaches this late scroll */}
      <Text
        position={r.cast}
        fontSize={r.bodySize}
        color="white"
        font="/fonts/BebasNeue-Regular.ttf"
        anchorX="left"
        lineHeight={1.3}
      >
        {`CAST\nTOM HOLLAND\nZENDAYA\nJACOB BATALON`}
      </Text>


      {/* Legs/feet area — camera reaches this late scroll */}
      <Text
        position={r.date}
        fontSize={r.bodySize}
        color="white"
        font="/fonts/BebasNeue-Regular.ttf"
        anchorX="left"
        lineHeight={1.3}
      >
        {`DEC 17, 2026\nExclusively in theaters`}
      </Text>


    </>
  )
}