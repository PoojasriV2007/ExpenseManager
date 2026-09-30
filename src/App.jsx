import { useEffect, useMemo, useRef, useState } from 'react'
import Sidebar from './components/Sidebar'
import { Hero, PageHeader, TopBar } from './components/Header'
import Summary from './components/Summary'
import MonthlyChart from './components/MonthlyChart'
import CategoryChart from './components/CategoryChart'
import ExpenseList from './components/ExpenseList'
import ExpenseForm from './components/ExpenseForm'
import Modal from './components/Modal'
import CategoriesView from './components/CategoriesView'
import SettingsView from './components/SettingsView'
import { useExpenses } from './hooks/useExpenses'
import { getSummary } from './utils/stats'
import { formatCurrency } from './utils/format'

const NAME_KEY = 'spendly.userName'

const readName = () => {
  try {
    return localStorage.getItem(NAME_KEY) ?? 'Sachin'
  } catch {
    return 'Sachin'
  }
}

export default function App() {
  const { expenses, addExpense, updateExpense, deleteExpense, clearAll, loadSamples } = useExpenses()
  const [view, setView] = useState('dashboard')
  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [formState, setFormState] = useState(null) // null | { mode: 'add' } | { mode: 'edit', expense }
  const [pendingDelete, setPendingDelete] = useState(null)
  const [confirmClear, setConfirmClear] = useState(false)
  const [toast, setToast] = useState(null)
  const [name, setName] = useState(readName)
  const searchRef = useRef(null)
  const focusSearchRef = useRef(false)

  const sorted = useMemo(
    () => [...expenses].sort((a, b) => b.date.localeCompare(a.date)),
    [expenses],
  )

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase()
    return sorted.filter(
      (e) => (category === 'All' || e.category === category) && (!query || e.title.toLowerCase().includes(query)),
    )
  }, [sorted, search, category])

  const summary = useMemo(() => getSummary(expenses), [expenses])

  useEffect(() => {
    if (!toast) return undefined
    const t = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(t)
  }, [toast])

  useEffect(() => {
    if (focusSearchRef.current && searchRef.current) {
      searchRef.current.focus()
      focusSearchRef.current = false
    }
  }, [view])

  const navigate = (next) => {
    setMenuOpen(false)
    if (next === 'add') {
      setFormState({ mode: 'add' })
      return
    }
    setView(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const showCategory = (name) => {
    setCategory(name)
    setSearch('')
    navigate('expenses')
  }

  const openSearch = () => {
    if (view === 'dashboard' || view === 'expenses') {
      searchRef.current?.focus()
      searchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    focusSearchRef.current = true
    navigate('expenses')
  }

  const handleSubmit = (data) => {
    if (formState?.mode === 'edit') {
      updateExpense(formState.expense.id, data)
      setToast(`Updated “${data.title}”`)
    } else {
      addExpense(data)
      setToast(`Added “${data.title}” · ${formatCurrency(data.amount)}`)
    }
    setFormState(null)
  }

  const confirmDelete = () => {
    deleteExpense(pendingDelete.id)
    setToast(`Deleted “${pendingDelete.title}”`)
    setPendingDelete(null)
  }

  const saveName = (value) => {
    setName(value)
    try {
      localStorage.setItem(NAME_KEY, value)
    } catch {
      /* ignore */
    }
    setToast(value ? `Saved. Hello, ${value}!` : 'Name cleared')
  }

  const listProps = {
    expenses: visible,
    totalCount: expenses.length,
    search,
    onSearchChange: setSearch,
    category,
    onCategoryChange: setCategory,
    onAdd: () => setFormState({ mode: 'add' }),
    onEdit: (expense) => setFormState({ mode: 'edit', expense }),
    onDelete: setPendingDelete,
    searchRef,
  }

  return (
    <div className="app">
      <Sidebar view={view} onNavigate={navigate} open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className="main">
        <TopBar onMenu={() => setMenuOpen(true)} onSearch={openSearch} />

        {view === 'dashboard' && (
          <>
            <Hero name={name} />
            <Summary summary={summary} />
            <div className="charts-row">
              <MonthlyChart expenses={expenses} />
              <CategoryChart expenses={expenses} onSelect={showCategory} />
            </div>
            <ExpenseList {...listProps} limit={5} onViewAll={() => navigate('expenses')} />
          </>
        )}

        {view === 'expenses' && (
          <>
            <PageHeader title="Expenses" subtitle="Search, filter and manage every expense you've recorded." />
            <ExpenseList {...listProps} title="All Expenses" />
          </>
        )}

        {view === 'categories' && (
          <>
            <PageHeader title="Categories" subtitle="See where your money goes. Pick a category to view its expenses." />
            <CategoriesView expenses={expenses} onSelect={showCategory} />
          </>
        )}

        {view === 'analytics' && (
          <>
            <PageHeader title="Analytics" subtitle="Spending trends over the last year." />
            <Summary summary={summary} />
            <div className="charts-row analytics">
              <MonthlyChart expenses={expenses} defaultRange={12} />
              <CategoryChart expenses={expenses} onSelect={showCategory} />
            </div>
          </>
        )}

        {view === 'settings' && (
          <>
            <PageHeader title="Settings" subtitle="Personalise Spendly and manage your saved data." />
            <SettingsView
              name={name}
              onSaveName={saveName}
              count={expenses.length}
              onLoadSamples={() => {
                loadSamples()
                setToast('Sample data loaded')
              }}
              onClearAll={() => setConfirmClear(true)}
            />
          </>
        )}
      </main>

      {formState && (
        <Modal title={formState.mode === 'edit' ? 'Edit Expense' : 'Add Expense'} onClose={() => setFormState(null)}>
          <ExpenseForm
            key={formState.expense?.id ?? 'new'}
            initial={formState.mode === 'edit' ? formState.expense : null}
            onSubmit={handleSubmit}
            onCancel={() => setFormState(null)}
          />
        </Modal>
      )}

      {pendingDelete && (
        <Modal title="Delete expense?" size="sm" onClose={() => setPendingDelete(null)}>
          <p className="confirm-text">
            “{pendingDelete.title}” ({formatCurrency(pendingDelete.amount)}) will be permanently removed.
          </p>
          <div className="form-actions">
            <button type="button" className="btn-ghost" onClick={() => setPendingDelete(null)}>Cancel</button>
            <button type="button" className="btn-danger" onClick={confirmDelete}>Delete</button>
          </div>
        </Modal>
      )}

      {confirmClear && (
        <Modal title="Delete all expenses?" size="sm" onClose={() => setConfirmClear(false)}>
          <p className="confirm-text">All {expenses.length} expenses will be permanently removed from this browser.</p>
          <div className="form-actions">
            <button type="button" className="btn-ghost" onClick={() => setConfirmClear(false)}>Cancel</button>
            <button
              type="button"
              className="btn-danger"
              onClick={() => {
                clearAll()
                setConfirmClear(false)
                setToast('All expenses deleted')
              }}
            >
              Delete all
            </button>
          </div>
        </Modal>
      )}

      <div className={`toast${toast ? ' show' : ''}`} role="status" aria-live="polite">{toast}</div>
    </div>
  )
}
