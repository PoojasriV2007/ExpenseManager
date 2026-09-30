import { useMemo } from 'react'
import { getCategoryTotals, sumAmounts } from '../utils/stats'
import { formatCurrency } from '../utils/format'

const RADIUS = 60
const STROKE = 26
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const GAP = 2

export default function CategoryChart({ expenses, title = 'Category Breakdown', onSelect }) {
  const categories = useMemo(() => getCategoryTotals(expenses), [expenses])
  const total = sumAmounts(expenses)

  const segments = useMemo(
    () =>
      categories
        .filter((c) => c.total > 0)
        .reduce((acc, c) => {
          const prev = acc[acc.length - 1]
          const offset = prev ? prev.offset + prev.length : 0
          return [...acc, { ...c, length: (c.total / total) * CIRCUMFERENCE, offset }]
        }, []),
    [categories, total],
  )

  return (
    <section className="card donut-card">
      <div className="card-head">
        <h2 className="card-title">{title}</h2>
      </div>
      <div className="donut-body">
        <div className="donut">
          <svg viewBox="0 0 160 160" role="img" aria-label="Spending by category">
            <circle cx="80" cy="80" r={RADIUS} fill="none" stroke="#eef0f7" strokeWidth={STROKE} />
            {segments.map((s) => (
              <circle
                key={s.name}
                cx="80"
                cy="80"
                r={RADIUS}
                fill="none"
                stroke={s.color}
                strokeWidth={STROKE}
                strokeDasharray={`${Math.max(s.length - (segments.length > 1 ? GAP : 0), 0.5)} ${CIRCUMFERENCE}`}
                strokeDashoffset={-s.offset}
                transform="rotate(-90 80 80)"
              >
                <title>{`${s.name}: ${formatCurrency(s.total)} (${s.percent}%)`}</title>
              </circle>
            ))}
          </svg>
          <div className="donut-center">
            <strong>{formatCurrency(total)}</strong>
            <span>Total</span>
          </div>
        </div>

        <ul className="legend">
          {categories.map((c) => (
            <li key={c.name}>
              <button
                type="button"
                className="legend-item"
                onClick={onSelect ? () => onSelect(c.name) : undefined}
                disabled={!onSelect}
                title={onSelect ? `Show ${c.name} expenses` : undefined}
              >
                <span className="legend-dot" style={{ background: c.color }} />
                <span className="legend-name">{c.name}</span>
                <span className="legend-value">{c.percent}%</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
