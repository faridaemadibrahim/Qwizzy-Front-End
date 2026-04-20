import { stats } from '../data/landingContent.js'

export default function StatsSection() {
  return (
    <section className="py-5" aria-label="Platform statistics">
      <div className="container">
        <div className="stats-panel px-4 py-5 px-md-5">
          <div className="row text-center g-4">
            {stats.map((s) => (
              <div className="col-md-4" key={s.label}>
                <div className="stat-value">{s.value}</div>
                <div className="small text-qm-muted mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
