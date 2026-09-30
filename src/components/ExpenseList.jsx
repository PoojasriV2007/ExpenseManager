import { ChevronDown, Inbox, Plus, Search } from 'lucide-react'
import { CATEGORY_NAMES } from '../data/categories'
import { formatCurrency } from '../utils/format'
import { sumAmounts } from '../utils/stats'
import ExpenseItem from './ExpenseItem'

export default function ExpenseList({
  title = 'Recent Expenses',
  expenses,
  totalCount,
  limit,
  search,
  onSearchChange,
  category,
  onCategoryChange,
  onAdd,
  onEdit,
  onDelete,
  onViewAll,
  searchRef,
}) {
  const shown = limit ? expenses.slice(0, limit) : expenses
  const filtered = Boolean(search.trim()) || category !== 'All'

  return (
    <section className="card list-card">
      <div className="list-head">
        <h2 className="card-title">{title}</h2>
        <div className="list-tools">
          <label className="search-box">
            <Search size={19} />
            <span className="visually-hidden">Search expenses by title</span>
            <input
              ref={searchRef}
              type="search"
              placeholder="Search expenses..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </label>
          <label className="select-box">
            <span className="visually-hidden">Filter by category</span>
            <select value={category} onChange={(e) => onCategoryChange(e.target.value)}>
              <option value="All">All Categories</option>
              {CATEGORY_NAMES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown size={16} />
          </label>
          <button type="button" className="btn-gradient" onClick={onAdd}>
            <Plus size={20} strokeWidth={2.4} /> Add Expense
          </button>
        </div>
      </div>

      {shown.length > 0 ? (
        <div className="table-wrap">
          <table className="expense-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Title</th>
                <th>Category</th>
                <th>Amount</th>
                <th className="th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((e) => (
                <ExpenseItem key={e.id} expense={e} onEdit={onEdit} onDelete={onDelete} />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty">
          <Inbox size={40} strokeWidth={1.5} />
          <p>{totalCount === 0 ? 'No expenses yet. Add your first expense to get started!' : 'No expenses match your search or filter.'}</p>
          {totalCount === 0 && (
            <button type="button" className="btn-gradient" onClick={onAdd}><Plus size={18} /> Add Expense</button>
          )}
        </div>
      )}

      {expenses.length > 0 && (
        <div className="list-foot">
          <span>
            Showing <strong>{shown.length}</strong> of <strong>{expenses.length}</strong>
            {filtered ? ' matching' : ''} expense{expenses.length === 1 ? '' : 's'}
            {' · '}Total <strong className="foot-total" data-testid="filtered-total">{formatCurrency(sumAmounts(expenses))}</strong>
          </span>
          {onViewAll && expenses.length > shown.length && (
            <button type="button" className="link-btn" onClick={onViewAll}>View all expenses →</button>
          )}
        </div>
      )}
    </section>
  )
}
