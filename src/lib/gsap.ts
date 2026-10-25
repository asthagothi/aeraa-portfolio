// Single place where GSAP plugins are registered. Import gsap/useGSAP/ScrollTrigger from here.
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// The router places scroll itself (hash targets inside the pinned phone, restored positions), so the
// browser must not restore it on reload. ScrollTrigger re-applies whatever value it saw at start-up
// on every refresh, which would quietly turn the browser's restoration back on; set it here.
ScrollTrigger.clearScrollMemory('manual')

export { gsap, useGSAP, ScrollTrigger }
