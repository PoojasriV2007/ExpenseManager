import { ArrowDown, ArrowUp, CalendarDays, ChartPie, Wallet, WalletCards } from 'lucide-react'
import { formatCurrency } from '../utils/format'

function Change({ value, label, goodWhenDown = false }) {
  if (value === null) return <p className="stat-foot muted">{label}</p>
  const up = value >= 0
  const good = goodWhenDown ? !up : true
  const Arrow = up ? ArrowUp : ArrowDown
  return (
    <p className={`stat-foot ${good ? 'good' : 'bad'}`}>
      <Arrow size={14} strokeWidth={2.4} /> {Math.abs(value)}% from last month
    </p>
  )
}

export default function Summary({ summary }) {
  const { total, totalGrowth, thisMonth, monthChange, topCategory, monthCount } = summary
  return (
    <section className="stats" aria-label="Expense summary">
      <article className="stat-card">
        <span className="stat-icon grad-purple"><Wallet size={28} /></span>
        <div>
          <p className="stat-label">Total Expenses</p>
          <p className="stat-value" data-testid="total">{formatCurrency(total)}</p>
          <Change value={totalGrowth} label="All time" />
        </div>
      </article>

      <article className="stat-card">
        <span className="stat-icon grad-green"><WalletCards size={28} /></span>
        <div>
          <p className="stat-label">This Month</p>
          <p className="stat-value">{formatCurrency(thisMonth)}</p>
          <Change value={monthChange} label="No data for last month" goodWhenDown />
        </div>
      </article>

      <article className="stat-card">
        <span className="stat-icon grad-blue"><ChartPie size={28} /></span>
        <div>
          <p className="stat-label">Top Category</p>
          <p className="stat-value">{topCategory ? topCategory.name : '—'}</p>
          <p className="stat-foot muted">
            {topCategory ? `${formatCurrency(topCategory.total)} (${topCategory.percent}%)` : 'No expenses yet'}
          </p>
        </div>
      </article>

      <article className="stat-card">
        <span className="stat-icon grad-pink"><CalendarDays size={28} /></span>
        <div>
          <p className="stat-label">Total Transactions</p>
          <p className="stat-value">{monthCount}</p>
          <p className="stat-foot muted">This month</p>
        </div>
      </article>
    </section>
  )
}
