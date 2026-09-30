export const formatCurrency = (value) =>
  `₹ ${Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`

export const formatCompact = (value) => (value >= 1000 ? `${+(value / 1000).toFixed(1)}K` : `${value}`)

export const toISODate = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

export const todayISO = () => toISODate(new Date())

export const parseISODate = (iso) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const formatDate = (iso) =>
  parseISODate(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export const monthKey = (iso) => iso.slice(0, 7)

export const isValidISODate = (v) =>
  typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(parseISODate(v).getTime())

export const createId = () =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`
