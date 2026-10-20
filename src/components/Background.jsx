import { useEffect, useRef } from 'react'

export default function Background({ darkMode }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let w = (canvas.width = window.innerWidth)
    let h = (canvas.height = window.innerHeight)

    const cols = Math.floor(w / 22)
    const drops = Array(cols).fill(1)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*'

    let animId

    function draw() {
      // trail fade — dark mode = near-black, light = near-white
      ctx.fillStyle = darkMode ? 'rgba(10,10,10,0.05)' : 'rgba(255,255,255,0.06)'
      ctx.fillRect(0, 0, w, h)

      // characters — dark blue accent in both modes
      ctx.fillStyle = darkMode ? '#1E3A5F' : '#2A5298'
      ctx.font = '13px JetBrains Mono, monospace'

      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillText(char, i * 22, y * 22)
        if (y * 22 > h && Math.random() > 0.975) drops[i] = 0
        drops[i]++
      })

      animId = requestAnimationFrame(draw)
    }

    draw()

    const onResize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
    }
  }, [darkMode])

  return (
    <canvas
      ref={canvasRef}
      id="bg-canvas"
      aria-hidden="true"
      style={{ opacity: darkMode ? 0.04 : 0.025 }}
    />
  )
}
