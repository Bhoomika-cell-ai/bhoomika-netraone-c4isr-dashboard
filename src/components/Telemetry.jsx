import { useEffect, useState } from 'react'
export default function Telemetry() {
  const [d, setD] = useState(null), [err, setErr] = useState(false)
  useEffect(() => { fetch('/sample_output.json').then((r) => r.json()).then(setD).catch(() => setErr(true)) }, [])
  if (err) return <p className="p-6 text-red-400">Failed to load sample_output.json</p>
  if (!d) return <p className="p-6 text-zinc-500">LOADING TELEMETRY…</p>
  const max = Math.max(...Object.values(d.labeled_counts))
  return (
    <main className="mx-auto w-full max-w-4xl space-y-4 p-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="border border-zinc-800 bg-zinc-900/60 p-4"><div className="text-[10px] tracking-widest text-zinc-500">TOTAL PROCESSED</div><div className="text-3xl font-bold text-emerald-400">{d.total_processed}</div></div>
        <div className="border border-zinc-800 bg-zinc-900/60 p-4"><div className="text-[10px] tracking-widest text-zinc-500">QUARANTINED (LOW QUALITY)</div><div className="text-3xl font-bold text-red-400">{d.quarantined_low_quality}</div></div>
      </div>
      <div className="border border-zinc-800 bg-zinc-900/60 p-4">
        <div className="mb-3 text-[10px] tracking-widest text-zinc-500">LABELED COUNTS</div>
        {Object.entries(d.labeled_counts).map(([k, v]) => (
          <div key={k} className="mb-2 flex items-center gap-3 text-xs">
            <span className="w-14 uppercase text-zinc-400">{k}</span>
            <div className="h-2 flex-1 bg-zinc-800"><div className="h-full bg-emerald-500" style={{ width: `${(v / max) * 100}%` }} /></div><span className="w-8 text-right">{v}</span>
          </div>
        ))}
      </div>
      <pre className="overflow-x-auto border border-zinc-800 bg-black p-4 text-xs text-emerald-300">{JSON.stringify(d, null, 2)}</pre>
    </main>
  )
}
