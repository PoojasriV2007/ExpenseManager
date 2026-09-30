import { Pencil, Trash2 } from 'lucide-react'
import { getCategory } from '../data/categories'
import { formatCurrency, formatDate } from '../utils/format'

export default function ExpenseItem({ expense, onEdit, onDelete }) {
  const cat = getCategory(expense.category)
  const Icon = cat.icon
  return (
    <tr className="expense-row">
      <td className="cell-date">
        <span className="cat-icon" style={{ background: cat.bg, color: cat.ink }} aria-hidden="true">
          <Icon size={19} strokeWidth={2.2} />
        </span>
        <span>{formatDate(expense.date)}</span>
      </td>
      <td className="cell-title">{expense.title}</td>
      <td className="cell-category">
        <span className="cat-pill" style={{ background: cat.bg, color: cat.ink }}>{expense.category}</span>
      </td>
      <td className="cell-amount">{formatCurrency(expense.amount)}</td>
      <td className="cell-actions">
        <button type="button" className="round-btn" onClick={() => onEdit(expense)} aria-label={`Edit ${expense.title}`} title="Edit">
          <Pencil size={17} />
        </button>
        <button type="button" className="round-btn danger" onClick={() => onDelete(expense)} aria-label={`Delete ${expense.title}`} title="Delete">
          <Trash2 size={17} />
        </button>
      </td>
    </tr>
  )
}
