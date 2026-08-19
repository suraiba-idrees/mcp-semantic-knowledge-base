import { Link } from 'react-router-dom'
import BrandMark from './BrandMark.jsx'

function AuthLayout({ eyebrow, title, description, children, footer }) {
  return (
    <div className="auth-page">
      <section className="auth-page__aside">
        <BrandMark inverse />
        <div className="auth-page__aside-content">
          <span className="auth-page__edition">Private edition · 2026</span>
          <blockquote>“A place for what you know, and a way back to it.”</blockquote>
          <p>
            Your documents stay arranged as a personal catalogue—not a feed, and not a conversation.
          </p>
        </div>
        <div className="auth-page__folios" aria-hidden="true">
          <span>Essays</span>
          <span>Research</span>
          <span>Notes</span>
        </div>
      </section>
      <section className="auth-page__main">
        <Link className="auth-page__back" to="/">
          <span aria-hidden="true">←</span> Back to home
        </Link>
        <div className="auth-card">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="auth-card__description">{description}</p>
          {children}
          <div className="auth-card__footer">{footer}</div>
        </div>
      </section>
    </div>
  )
}

export default AuthLayout
