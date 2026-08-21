import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import BrandMark from './BrandMark.jsx'

function PublicLayout() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="public-layout">
      <header className="public-header">
        <div className="container public-header__inner">
          <BrandMark compact />
          <nav className="public-nav" aria-label="Main navigation">
            <Link to="/">Home</Link>
            <a href="/#how-it-works">How it works</a>
            <a href="/#principles">Why Commonplace</a>
          </nav>
          <div className="public-header__actions">
            {isAuthenticated ? (
              <Link className="button button--small" to="/dashboard">
                Open library
              </Link>
            ) : (
              <>
                <Link className="text-link text-link--quiet" to="/login">
                  Log in
                </Link>
                <Link className="button button--small" to="/signup">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default PublicLayout
