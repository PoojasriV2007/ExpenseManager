import { House, SquarePlus, List, ChartPie, ChartColumn, Settings, Sprout, Wallet, X } from 'lucide-react'

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: House },
  { id: 'add', label: 'Add Expense', icon: SquarePlus },
  { id: 'expenses', label: 'Expenses', icon: List },
  { id: 'categories', label: 'Categories', icon: ChartPie },
  { id: 'analytics', label: 'Analytics', icon: ChartColumn },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export function Logo() {
  return (
    <span className="logo">
      <span className="logo-icon"><Wallet size={26} strokeWidth={2.2} /></span>
      <span className="logo-text">Spend<span className="logo-accent">ly</span></span>
    </span>
  )
}

export default function Sidebar({ view, onNavigate, open, onClose }) {
  return (
    <>
      <div className={`sidebar-backdrop${open ? ' show' : ''}`} onClick={onClose} aria-hidden="true" />
      <aside className={`sidebar${open ? ' open' : ''}`} aria-label="Main navigation">
        <div className="sidebar-head">
          <Logo />
          <button type="button" className="sidebar-close" onClick={onClose} aria-label="Close menu">
            <X size={22} />
          </button>
        </div>
        <p className="sidebar-tagline">Track Today<br />Build a Better Tomorrow</p>

        <nav className="sidebar-nav">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              className={`nav-link${view === id ? ' active' : ''}`}
              aria-current={view === id ? 'page' : undefined}
              onClick={() => onNavigate(id)}
            >
              <Icon size={24} strokeWidth={1.8} />
              {label}
            </button>
          ))}
        </nav>

        <div className="sidebar-art">
          <img src="/images/sidebar-illustration.jpg" alt="Student at a laptop with a note: Small Steps Make Big Freedom" />
        </div>

        <div className="sidebar-quote">
          <Sprout size={26} strokeWidth={1.6} />
          <p>“Track your money today, for the dreams of tomorrow.”</p>
        </div>
      </aside>
    </>
  )
}
