'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export const useGSAPMount = (selector: string, delay = 0) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      const elements = ref.current.querySelectorAll(selector)
      gsap.fromTo(elements, 
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          stagger: 0.08, 
          duration: 0.7, 
          ease: 'power3.out',
          delay 
        }
      )
    }
  }, [selector, delay])

  return ref
}

export const useGSAPHover = () => {
  const handleMouseEnter = (e: React.MouseEvent) => {
    gsap.to(e.currentTarget, { scale: 1.03, duration: 0.3, ease: 'power2.out' })
  }

  const handleMouseLeave = (e: React.MouseEvent) => {
    gsap.to(e.currentTarget, { scale: 1, duration: 0.3, ease: 'power2.out' })
  }

  return { handleMouseEnter, handleMouseLeave }
}