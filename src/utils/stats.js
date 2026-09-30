import { CATEGORIES } from '../data/categories'
import { monthKey, toISODate } from './format'

export const sumAmounts = (list) => list.reduce((sum, e) => sum + e.amount, 0)

const shiftMonth = (date, offset) => new Date(date.getFullYear(), date.getMonth() + offset, 1)

const percentChange = (current, previous) =>
  previous > 0 ? Math.round(((current - previous) / previous) * 100) : null

export const getSummary = (expenses, now = new Date()) => {
  const thisKey = monthKey(toISODate(now))
  const lastKey = monthKey(toISODate(shiftMonth(now, -1)))

  const total = sumAmounts(expenses)
  const thisMonthList = expenses.filter((e) => monthKey(e.date) === thisKey)
  const thisMonth = sumAmounts(thisMonthList)
  const lastMonth = sumAmounts(expenses.filter((e) => monthKey(e.date) === lastKey))

  const byCategory = getCategoryTotals(expenses)
  const top = byCategory.filter((c) => c.total > 0).sort((a, b) => b.total - a.total)[0] ?? null

  return {
    total,
    totalGrowth: percentChange(total, total - thisMonth),
    thisMonth,
    monthChange: percentChange(thisMonth, lastMonth),
    topCategory: top,
    monthCount: thisMonthList.length,
  }
}

export const getCategoryTotals = (expenses) => {
  const total = sumAmounts(expenses)
  return CATEGORIES.map((c) => {
    const items = expenses.filter((e) => e.category === c.name)
    const catTotal = sumAmounts(items)
    return {
      ...c,
      total: catTotal,
      count: items.length,
      percent: total ? Math.round((catTotal / total) * 100) : 0,
    }
  })
}

export const getMonthlyTotals = (expenses, months, now = new Date()) =>
  Array.from({ length: months }, (_, i) => {
    const date = shiftMonth(now, i - months + 1)
    const key = monthKey(toISODate(date))
    return {
      key,
      label: date.toLocaleDateString('en-US', { month: 'short' }),
      fullLabel: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      total: sumAmounts(expenses.filter((e) => monthKey(e.date) === key)),
    }
  })

export const niceMax = (value) => {
  if (value <= 0) return 1000
  const magnitude = 10 ** Math.floor(Math.log10(value))
  const step = [1, 2, 2.5, 5, 10].find((s) => s * magnitude * 4 >= value) * magnitude
  return step * 4
}
