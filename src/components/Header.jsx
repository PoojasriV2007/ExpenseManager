import { useState } from 'react'
import { Menu, Search } from 'lucide-react'
import { Logo } from './Sidebar'

const greetingFor = (hour) => (hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening')

export function TopBar({ onMenu, onSearch }) {
  return (
    <div className="topbar">
      <button type="button" className="icon-square menu-btn" onClick={onMenu} aria-label="Open menu">
        <Menu size={22} />
      </button>
      <span className="topbar-logo"><Logo /></span>
      <div className="topbar-actions">
        <button type="button" className="icon-square" onClick={onSearch} aria-label="Search expenses">
          <Search size={21} strokeWidth={2.2} />
        </button>
        <img className="avatar" src="/images/avatar.png" alt="Profile" />
      </div>
    </div>
  )
}

export function Hero({ name }) {
  const [greeting] = useState(() => greetingFor(new Date().getHours()))
  return (
    <section className="hero">
      <div className="hero-text">
        <p className="hero-greeting">{name ? `${greeting}, ${name}` : greeting} <span aria-hidden="true">👋</span></p>
        <h1 className="hero-title">Take Control of<br />Your <span className="text-gradient">Expenses</span></h1>
        <p className="hero-sub">Track, manage and build a better tomorrow.</p>
      </div>
      <img className="hero-art" src="/images/hero-mountains.jpg" alt="" aria-hidden="true" />
    </section>
  )
}

export function PageHeader({ title, subtitle, children }) {
  return (
    <section className="page-header">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-sub">{subtitle}</p>}
      </div>
      {children}
    </section>
  )
}
