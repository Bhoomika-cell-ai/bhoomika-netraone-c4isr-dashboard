import { useState } from 'react'
import { CAMERAS, CLASSES } from '../data'

const STYLE = {
  CRITICAL: 'bg-red-500/15 text-red-400 border-red-500/60',
  WARNING: 'bg-amber-500/15 text-amber-400 border-amber-500/60',
  INFO: 'bg-sky-500/15 text-sky-400 border-sky-500/60',
}
const Sel = ({ value, onChange, options, label }) => (
  <select value={value} onChange={(e) => onChange(e.target.value)} className="flex-1 border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-300 outline-none focus:border-emerald-500">
    <option value="all">{label}</option>{options.map((o) => <option key={o} value={o}>{o}</option>)}
  </select>
)
export default function AlertFeed({ events }) {
  const [cam, setCam] = useState('all'), [veh, setVeh] = useState('all'), [sev, setSev] = useState('all')
  const shown = events.filter((e) => (cam === 'all' || e.camera === cam) && (veh === 'all' || e.vehicle === veh) && (sev === 'all' || e.severity === sev))
  return (
    <aside className="flex max-h-[80vh] flex-col border border-zinc-800 bg-zinc-950 lg:max-h-none">
      <div className="border-b border-zinc-800 p-3">
        <div className="mb-2 flex items-center justify-between text-xs tracking-widest">
          <span className="text-zinc-300">SECURITY ALERT FEED</span><span className="text-zinc-500">{shown.length} EVENTS</span>
        </div>
        <div className="flex gap-2">
          <Sel value={cam} onChange={setCam} options={CAMERAS.map((c) => c.id)} label="All cameras" />
          <Sel value={veh} onChange={setVeh} options={CLASSES} label="All classes" />
          <Sel value={sev} onChange={setSev} options={Object.keys(STYLE)} label="All levels" />
        </div>
      </div>
      <ul className="flex-1 space-y-2 overflow-y-auto p-3">
        {shown.length === 0 && <li className="py-8 text-center text-xs text-zinc-600">NO EVENTS MATCH FILTERS</li>}
        {shown.map((e) => (
          <li key={e.id} className={`slide-in border-l-2 bg-zinc-900/60 p-2.5 ${STYLE[e.severity].split(' ')[2]}`}>
            <div className="flex items-center justify-between">
              <span className={`border px-1.5 py-0.5 text-[10px] font-bold ${STYLE[e.severity]}`}>{e.severity}</span>
              <span className="text-[10px] text-zinc-500">{e.time}</span>
            </div>
            <div className="mt-1.5 text-xs text-zinc-200">{e.title}</div>
            <div className="mt-1 text-[10px] text-zinc-500">{e.camera} · class: {e.vehicle}</div>
          </li>
        ))}
      </ul>
    </aside>
  )
}
