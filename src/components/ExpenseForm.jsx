import { useState } from 'react'
import { CATEGORIES } from '../data/categories'
import { todayISO } from '../utils/format'

const EMPTY = { title: '', amount: '', category: 'Food', date: '' }

const validate = ({ title, amount, category, date }) => {
  const errors = {}
  if (!title.trim()) errors.title = 'Please enter a title.'
  else if (title.trim().length > 60) errors.title = 'Keep the title under 60 characters.'

  const value = Number(amount)
  if (amount === '' || Number.isNaN(value)) errors.amount = 'Please enter an amount.'
  else if (value <= 0) errors.amount = 'Amount must be greater than 0.'
  else if (value > 10000000) errors.amount = 'That amount looks too large.'
  else if (!/^\d+(\.\d{1,2})?$/.test(String(amount))) errors.amount = 'Use at most 2 decimal places.'

  if (!category) errors.category = 'Please pick a category.'

  if (!date) errors.date = 'Please pick a date.'
  else if (date > todayISO()) errors.date = "Date can't be in the future."
  return errors
}

export default function ExpenseForm({ initial, onSubmit, onCancel }) {
  const [values, setValues] = useState(() =>
    initial ? { ...initial, amount: String(initial.amount) } : { ...EMPTY, date: todayISO() },
  )
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState(false)

  const update = (field) => (e) => {
    const next = { ...values, [field]: e.target.value }
    setValues(next)
    if (touched) setErrors(validate(next))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setTouched(true)
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) {
      e.currentTarget.querySelector(`[name="${Object.keys(found)[0]}"]`)?.focus()
      return
    }
    onSubmit({
      title: values.title.trim(),
      amount: Math.round(Number(values.amount) * 100) / 100,
      category: values.category,
      date: values.date,
    })
  }

  const fieldClass = (name) => `field-input${errors[name] ? ' invalid' : ''}`

  return (
    <form className="expense-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="exp-title">Title</label>
        <input
          id="exp-title"
          name="title"
          className={fieldClass('title')}
          placeholder="e.g. Lunch with team"
          value={values.title}
          onChange={update('title')}
          maxLength={80}
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? 'err-title' : undefined}
        />
        {errors.title && <p className="field-error" id="err-title">{errors.title}</p>}
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="exp-amount">Amount (₹)</label>
          <input
            id="exp-amount"
            name="amount"
            className={fieldClass('amount')}
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            placeholder="0"
            value={values.amount}
            onChange={update('amount')}
            aria-invalid={Boolean(errors.amount)}
            aria-describedby={errors.amount ? 'err-amount' : undefined}
          />
          {errors.amount && <p className="field-error" id="err-amount">{errors.amount}</p>}
        </div>

        <div className="field">
          <label htmlFor="exp-date">Date</label>
          <input
            id="exp-date"
            name="date"
            className={fieldClass('date')}
            type="date"
            max={todayISO()}
            value={values.date}
            onChange={update('date')}
            aria-invalid={Boolean(errors.date)}
            aria-describedby={errors.date ? 'err-date' : undefined}
          />
          {errors.date && <p className="field-error" id="err-date">{errors.date}</p>}
        </div>
      </div>

      <fieldset className="field">
        <legend>Category</legend>
        <div className="category-picker">
          {CATEGORIES.map(({ name, icon: Icon, bg, ink }) => (
            <label
              key={name}
              className={`category-option${values.category === name ? ' selected' : ''}`}
              style={{ '--cat-bg': bg, '--cat-ink': ink }}
            >
              <input type="radio" name="category" value={name} checked={values.category === name} onChange={update('category')} />
              <Icon size={18} strokeWidth={2.2} />
              {name}
            </label>
          ))}
        </div>
        {errors.category && <p className="field-error">{errors.category}</p>}
      </fieldset>

      <div className="form-actions">
        <button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn-gradient">{initial ? 'Save Changes' : 'Add Expense'}</button>
      </div>
    </form>
  )
}
