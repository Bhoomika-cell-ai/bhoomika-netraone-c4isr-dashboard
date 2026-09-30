const fmt = (s) => [s / 3600, (s % 3600) / 60, s % 60].map((n) => String(Math.floor(n)).padStart(2, '0')).join(':')
const Card = ({ label, value, accent = 'text-zinc-100' }) => (
  <div className="border border-zinc-800 bg-zinc-900/60 p-3">
    <div className="text-[10px] tracking-widest text-zinc-500">{label}</div>
    <div className={`mt-1 text-2xl font-bold ${accent}`}>{value}</div>
  </div>
)
export default function MetricsCards({ stats, uptime }) {
  const max = Math.max(1, stats.car, stats.bike, stats.truck)
  return (
    <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <Card label="TOTAL DETECTIONS" value={stats.total} accent="text-emerald-400" />
      <div className="border border-zinc-800 bg-zinc-900/60 p-3">
        <div className="mb-2 text-[10px] tracking-widest text-zinc-500">VEHICLE BREAKDOWN</div>
        {[['Cars', 'car'], ['Bikes', 'bike'], ['Trucks', 'truck']].map(([l, k]) => (
          <div key={k} className="mb-1 flex items-center gap-2 text-[11px]">
            <span className="w-11 text-zinc-400">{l}</span>
            <div className="h-1.5 flex-1 bg-zinc-800"><div className="h-full bg-emerald-500 transition-all" style={{ width: `${(stats[k] / max) * 100}%` }} /></div>
            <span className="w-6 text-right">{stats[k]}</span>
          </div>
        ))}
      </div>
      <Card label="SYSTEM UPTIME" value={fmt(uptime)} />
      <Card label="AVAILABILITY" value="99.98%" accent="text-emerald-400" />
    </section>
  )
}
