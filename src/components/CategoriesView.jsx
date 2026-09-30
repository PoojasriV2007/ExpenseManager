import { useMemo } from 'react'
import { getCategoryTotals } from '../utils/stats'
import { formatCurrency } from '../utils/format'

export default function CategoriesView({ expenses, onSelect }) {
  const categories = useMemo(() => getCategoryTotals(expenses), [expenses])
  return (
    <section className="category-grid">
      {categories.map(({ name, icon: Icon, bg, ink, color, total, count, percent }) => (
        <button key={name} type="button" className="card category-card" onClick={() => onSelect(name)}>
          <div className="category-card-head">
            <span className="cat-icon lg" style={{ background: bg, color: ink }}><Icon size={24} strokeWidth={2.1} /></span>
            <span className="category-share">{percent}%</span>
          </div>
          <p className="category-name">{name}</p>
          <p className="category-total">{formatCurrency(total)}</p>
          <div className="progress" aria-hidden="true"><span style={{ width: `${percent}%`, background: color }} /></div>
          <p className="category-count">{count} expense{count === 1 ? '' : 's'} · View all →</p>
        </button>
      ))}
    </section>
  )
}
