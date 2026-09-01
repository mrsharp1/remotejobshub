import { useState, useEffect } from 'react'

export const useVisualViewport = () => {
  const [viewport, setViewport] = useState({
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
    offsetTop: 0
  })

  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return

    const updateViewport = () => {
      setViewport({
        height: window.visualViewport?.height || window.innerHeight,
        offsetTop: window.visualViewport?.offsetTop || 0
      })
    }

    updateViewport()

    window.visualViewport.addEventListener('resize', updateViewport)
    window.visualViewport.addEventListener('scroll', updateViewport)

    return () => {
      window.visualViewport?.removeEventListener('resize', updateViewport)
      window.visualViewport?.removeEventListener('scroll', updateViewport)
    }
  }, [])

  return viewport
}
