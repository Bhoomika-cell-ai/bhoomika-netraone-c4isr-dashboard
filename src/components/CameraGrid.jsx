import { useEffect, useRef, useState } from 'react'
import { CAMERAS } from '../data'

function Feed({ standby, seed }) {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current, x = c.getContext('2d'); let raf, t = seed * 100
    const boxes = Array.from({ length: 3 }, (_, i) => ({ y: 40 + i * 45, s: 0.4 + Math.random(), o: Math.random() * 300, l: ['CAR', 'BIKE', 'TRUCK'][i] }))
    const draw = () => {
      t++; x.fillStyle = '#0a0f0d'; x.fillRect(0, 0, 320, 180)
      x.strokeStyle = 'rgba(16,185,129,.08)'
      for (let i = 0; i < 320; i += 20) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, 180); x.stroke() }
      for (let i = 0; i < 180; i += 20) { x.beginPath(); x.moveTo(0, i); x.lineTo(320, i); x.stroke() }
      if (!standby) boxes.forEach((b) => {
        const px = ((b.o + t * b.s) % 380) - 40
        x.strokeStyle = '#10b981'; x.strokeRect(px, b.y, 46, 26)
        x.fillStyle = '#10b981'; x.font = '8px monospace'; x.fillText(`${b.l} 0.${80 + Math.floor(b.s * 10)}`, px, b.y - 3)
      })
      x.fillStyle = `rgba(255,255,255,${Math.random() * 0.03})`; x.fillRect(0, 0, 320, 180)
      raf = requestAnimationFrame(draw)
    }
    draw(); return () => cancelAnimationFrame(raf)
  }, [standby, seed])
  return <canvas ref={ref} width="320" height="180" className={`w-full ${standby ? 'opacity-30' : ''}`} />
}

export default function CameraGrid({ now }) {
  const [fps, setFps] = useState(30)
  useEffect(() => { const i = setInterval(() => setFps(29 + Math.round(Math.random())), 1000); return () => clearInterval(i) }, [])
  return (
    <section className="grid gap-3 sm:grid-cols-2">
      {CAMERAS.map((c, i) => {
        const on = c.status === 'ONLINE'
        return (
          <div key={c.id} className="relative overflow-hidden border border-zinc-800 bg-black">
            <Feed standby={!on} seed={i} />
            <div className="absolute inset-x-0 top-0 flex justify-between bg-gradient-to-b from-black/80 to-transparent p-2 text-[10px]">
              <span className="font-bold text-zinc-200">{c.id} · {c.name}</span>
              <span className={`flex items-center gap-1 font-bold ${on ? 'text-emerald-400' : 'text-amber-400'}`}>
                <span className={`h-1.5 w-1.5 rounded-full live-dot ${on ? 'bg-emerald-400' : 'bg-amber-400'}`} />{c.status}
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 flex justify-between bg-gradient-to-t from-black/80 to-transparent p-2 text-[10px] text-zinc-400">
              <span>{on ? fps : 0} FPS</span><span>{now.toLocaleTimeString('en-GB')}</span>
            </div>
          </div>
        )
      })}
    </section>
  )
}