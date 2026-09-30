import { useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { getMonthlyTotals, niceMax } from '../utils/stats'
import { formatCompact, formatCurrency } from '../utils/format'

const RANGES = [6, 9, 12]

export default function MonthlyChart({ expenses, defaultRange = 9 }) {
  const [range, setRange] = useState(defaultRange)
  const months = useMemo(() => getMonthlyTotals(expenses, range), [expenses, range])
  const [hovered, setHovered] = useState(null)

  const max = niceMax(Math.max(...months.map((m) => m.total)))
  const ticks = [4, 3, 2, 1, 0].map((i) => (max / 4) * i)
  const activeIndex = hovered ?? months.length - 1
  const active = months[activeIndex]

  return (
    <section className="card chart-card">
      <div className="card-head">
        <h2 className="card-title">Monthly Expenses</h2>
        <label className="select-pill">
          <span className="visually-hidden">Chart range</span>
          <select value={range} onChange={(e) => setRange(Number(e.target.value))}>
            {RANGES.map((r) => <option key={r} value={r}>Last {r} Months</option>)}
          </select>
          <ChevronDown size={15} />
        </label>
      </div>

      <div className="bar-chart" role="img" aria-label={`Monthly expenses for the last ${range} months`}>
        <div className="bar-axis">
          {ticks.map((t) => <span key={t}>{formatCompact(t)}</span>)}
        </div>
        <div className="bar-plot">
          {ticks.map((t) => <span key={t} className="grid-line" style={{ bottom: `${(t / max) * 100}%` }} />)}
          <div className="bars" onMouseLeave={() => setHovered(null)}>
            {months.map((m, i) => (
              <div
                key={m.key}
                className={`bar-col${i === activeIndex ? ' active' : ''}`}
                onMouseEnter={() => setHovered(i)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
                tabIndex={0}
                aria-label={`${m.fullLabel}: ${formatCurrency(m.total)}`}
              >
                <div className="bar-track">
                  {i === activeIndex && (
                    <div className="bar-tooltip" style={{ bottom: `calc(${(m.total / max) * 100}% + 10px)` }}>
                      <strong>{formatCurrency(active.total)}</strong>
                      <span>{active.fullLabel}</span>
                    </div>
                  )}
                  <div className="bar" style={{ height: `${Math.max((m.total / max) * 100, m.total ? 2 : 0)}%` }} />
                </div>
                <span className="bar-label">{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
