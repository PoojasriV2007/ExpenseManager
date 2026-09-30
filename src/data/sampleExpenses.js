import { createId, toISODate } from '../utils/format'

// A small deterministic generator so every first visit sees the same demo data.
const createRandom = () => {
  let seed = 42
  return () => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }
}
let random = createRandom()

const POOL = {
  Food: [['Groceries', 400, 1200], ['Dinner with friends', 500, 1400], ['Lunch with team', 250, 600], ['Coffee & snacks', 120, 300]],
  Transport: [['Metro card recharge', 300, 500], ['Cab to office', 180, 450], ['Fuel', 800, 1500]],
  Shopping: [['T-shirt', 499, 1200], ['Shoes', 1200, 2500], ['Home essentials', 350, 900]],
  Bills: [['Electricity bill', 900, 1600], ['Mobile recharge', 299, 699], ['Internet bill', 599, 999]],
  Entertainment: [['Movie tickets', 400, 800], ['Streaming subscription', 199, 649], ['Concert pass', 900, 1800]],
  Others: [['Gift for mom', 500, 1500], ['Stationery', 120, 400]],
}

const pick = (list) => list[Math.floor(random() * list.length)]
const amountBetween = (min, max) => Math.round((min + random() * (max - min)) / 10) * 10

const CATEGORY_WEIGHTS = ['Food', 'Food', 'Food', 'Shopping', 'Shopping', 'Bills', 'Bills', 'Transport', 'Transport', 'Entertainment', 'Others']
const ITEMS_PER_MONTH = [2, 4, 4, 5, 4, 5, 7, 6]

export const buildSampleExpenses = (now = new Date()) => {
  random = createRandom()
  const expenses = []
  const add = (title, amount, category, date) =>
    expenses.push({ id: createId(), title, amount, category, date: toISODate(date) })

  // Previous 8 months
  ITEMS_PER_MONTH.forEach((count, i) => {
    const monthsAgo = ITEMS_PER_MONTH.length - i
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() - monthsAgo + 1, 0).getDate()
    for (let n = 0; n < count; n += 1) {
      const category = pick(CATEGORY_WEIGHTS)
      const [title, min, max] = pick(POOL[category])
      const day = 1 + Math.floor(random() * daysInMonth)
      add(title, amountBetween(min, max), category, new Date(now.getFullYear(), now.getMonth() - monthsAgo, day))
    }
  })

  // Current month: the five most recent entries from the design, plus a few earlier ones
  const daysAgo = (d) => new Date(now.getFullYear(), now.getMonth(), now.getDate() - d)
  const recent = [
    ['Lunch with team', 450, 'Food', 3],
    ['Metro card recharge', 300, 'Transport', 4],
    ['T-shirt', 899, 'Shopping', 5],
    ['Electricity bill', 1200, 'Bills', 6],
    ['Movie tickets', 600, 'Entertainment', 7],
  ]
  recent.forEach(([title, amount, category, d]) => add(title, amount, category, daysAgo(d)))

  const earlier = [
    ['Groceries', 1150, 'Food'], ['Coffee & snacks', 180, 'Food'], ['Dinner with friends', 920, 'Food'],
    ['Cab to office', 260, 'Transport'], ['Home essentials', 640, 'Shopping'], ['Mobile recharge', 399, 'Bills'],
    ['Streaming subscription', 199, 'Entertainment'], ['Stationery', 220, 'Others'],
  ]
  earlier.forEach(([title, amount, category], i) => {
    const day = Math.max(1, now.getDate() - 8 - i * 2)
    add(title, amount, category, new Date(now.getFullYear(), now.getMonth(), day))
  })

  return expenses.sort((a, b) => b.date.localeCompare(a.date))
}
