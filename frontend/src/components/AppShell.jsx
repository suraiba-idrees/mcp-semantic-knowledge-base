import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import BrandMark from './BrandMark.jsx'

const navigation = [
  { to: '/dashboard', label: 'Overview', icon: '⌂' },
  { to: '/documents', label: 'My documents', icon: '▤' },
  { to: '/search', label: 'Search knowledge', icon: '⌕' },
  { to: '/upload', label: 'Upload', icon: '+' },
]

function AppShell() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  const displayName = user?.name || user?.email || 'Library owner'
  const initial = displayName.charAt(0).toUpperCase()

  return (
    <div className="app-shell">
      <button
        className={`mobile-backdrop${isMenuOpen ? ' is-visible' : ''}`}
        type="button"
        aria-label="Close navigation"
        onClick={() => setIsMenuOpen(false)}
      />
      <aside className={`sidebar${isMenuOpen ? ' is-open' : ''}`}>
        <div className="sidebar__top">
          <BrandMark inverse />
          <button
            className="sidebar__close"
            type="button"
            aria-label="Close navigation"
            onClick={() => setIsMenuOpen(false)}
          >
            ×
          </button>
        </div>

        <div className="sidebar__section-label">Your library</div>
        <nav className="sidebar__nav" aria-label="Library navigation">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'is-active' : '')}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="sidebar__icon" aria-hidden="true">
                {item.icon}
              </span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__footer">
          <NavLink className="sidebar__account" to="/account">
            <span className="avatar" aria-hidden="true">
              {initial}
            </span>
            <span>
              <strong>{displayName}</strong>
              <small>Account</small>
            </span>
          </NavLink>
          <button className="sidebar__logout" type="button" onClick={handleLogout}>
            Log out <span aria-hidden="true">↗</span>
          </button>
        </div>
      </aside>

      <div className="app-shell__content">
        <header className="mobile-header">
          <BrandMark compact />
          <button
            className="mobile-menu-button"
            type="button"
            aria-label="Open navigation"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(true)}
          >
            <span />
            <span />
          </button>
        </header>
        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppShell
