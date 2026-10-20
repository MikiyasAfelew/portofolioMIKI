import { useRef, useCallback } from 'react'

/**
 * Returns ref + event handlers for a subtle 3-D tilt on hover.
 * Usage:
 *   const { ref, onMouseMove, onMouseLeave } = useTilt()
 *   <div ref={ref} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} style={style}>
 */
export function useTilt(strength = 8) {
  const ref = useRef(null)

  const onMouseMove = useCallback((e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2
    const rotateX = ((y - cy) / cy) * -strength
    const rotateY = ((x - cx) / cx) * strength
    // also set CSS vars for the radial spotlight
    el.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`)
    el.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`)
    el.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(4px)`
    el.style.transition = 'transform 0.1s ease'
  }, [strength])

  const onMouseLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) translateZ(0)'
    el.style.transition = 'transform 0.4s ease'
  }, [])

  return { ref, onMouseMove, onMouseLeave }
}
