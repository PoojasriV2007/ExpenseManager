import { useEffect, useState } from 'react'
import { CATEGORY_NAMES } from '../data/categories'
import { buildSampleExpenses } from '../data/sampleExpenses'
import { createId, isValidISODate, todayISO } from '../utils/format'

const STORAGE_KEY = 'spendly.expenses'
const SEEDED_KEY = 'spendly.seeded'

const sanitize = (e) => {
  if (!e || typeof e !== 'object') return null
  const title = typeof e.title === 'string' ? e.title.trim() : ''
  const amount = Number(e.amount)
  if (!title || !Number.isFinite(amount) || amount <= 0) return null
  return {
    id: e.id != null ? String(e.id) : createId(),
    title: title.slice(0, 60),
    amount: Math.round(amount * 100) / 100,
    category: CATEGORY_NAMES.includes(e.category) ? e.category : 'Others',
    date: isValidISODate(e.date) ? e.date : todayISO(),
  }
}

const loadInitial = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw !== null) {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed.map(sanitize).filter(Boolean) : []
    }
    if (!localStorage.getItem(SEEDED_KEY)) {
      const samples = buildSampleExpenses()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(samples))
      localStorage.setItem(SEEDED_KEY, '1')
      return samples
    }
  } catch {
    console.warn('Spendly: saved expenses could not be read, starting fresh.')
  }
  return []
}

// All expense data lives in React state; localStorage only mirrors it so a refresh keeps it.
export function useExpenses() {
  const [expenses, setExpenses] = useState(loadInitial)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
    } catch {
      /* storage unavailable (private mode etc.) – app keeps working in memory */
    }
  }, [expenses])

  const addExpense = (data) => setExpenses((list) => [{ ...data, id: createId() }, ...list])

  const updateExpense = (id, data) =>
    setExpenses((list) => list.map((e) => (e.id === id ? { ...e, ...data } : e)))

  const deleteExpense = (id) => setExpenses((list) => list.filter((e) => e.id !== id))

  const clearAll = () => setExpenses([])

  const loadSamples = () => setExpenses(buildSampleExpenses())

  return { expenses, addExpense, updateExpense, deleteExpense, clearAll, loadSamples }
}
