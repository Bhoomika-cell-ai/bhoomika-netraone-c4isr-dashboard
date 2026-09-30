import { useEffect, useState } from 'react'
import CameraGrid from './components/CameraGrid'
import AlertFeed from './components/AlertFeed'
import MetricsCards from './components/MetricsCards'
import Telemetry from './components/Telemetry'
import { generateEvent } from './data'

export default function App() {
  const [tab, setTab] = useState('ops')
  const [events, setEvents] = useState(() => Array.from({ length: 6 }, generateEvent))
  const [stats, setStats] = useState({ total: 0, car: 0, bike: 0, truck: 0, bus: 0 })
  const [now, setNow] = useState(new Date())
  const [uptime, setUptime] = useState(0)

  useEffect(() => {
    const t = setInterval(() => { setNow(new Date()); setUptime((u) => u + 1) }, 1000)
    const e = setInterval(() => {
      const ev = generateEvent()
      setEvents((p) => [ev, ...p].slice(0, 100))
      setStats((s) => ({ ...s, total: s.total + 1, ...(ev.vehicle !== 'none' && { [ev.vehicle]: s[ev.vehicle] + 1 }) }))
    }, 2500)
    return () => { clearInterval(t); clearInterval(e) }
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 bg-zinc-950 px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="live-dot h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <h1 className="text-sm font-bold tracking-[0.25em] text-emerald-400">NETRA-ONE <span className="text-zinc-500">// C4ISR</span></h1>
        </div>
        <nav className="flex gap-1 text-xs">
          {[['ops', 'LIVE OPS'], ['telemetry', 'DATASET INGESTION TELEMETRY']].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)}
              className={`border px-3 py-1.5 tracking-wider transition ${tab === k ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'}`}>{l}</button>
          ))}
        </nav>
        <time className="text-xs text-zinc-400">{now.toISOString().slice(0, 19).replace('T', ' ')} UTC</time>
      </header>
      {tab === 'ops' ? (
        <main className="grid flex-1 gap-4 p-4 lg:grid-cols-[1fr_380px]">
          <div className="flex min-w-0 flex-col gap-4">
            <MetricsCards stats={stats} uptime={uptime} />
            <CameraGrid now={now} />
          </div>
          <AlertFeed events={events} />
        </main>
      ) : <Telemetry />}
    </div>
  )
}
