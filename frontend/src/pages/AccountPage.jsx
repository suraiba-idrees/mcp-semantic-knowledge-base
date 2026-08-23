import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { API_BASE_URL } from '../services/api.js'

function AccountPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="page-stack page-stack--narrow">
      <PageHeader
        eyebrow="Account"
        title="Library settings"
        description="Review the identity and service connection used for this archive."
      />
      <section className="account-grid">
        <article className="account-card account-card--identity">
          <span className="account-card__avatar" aria-hidden="true">
            {(user?.name || user?.email || 'L').charAt(0).toUpperCase()}
          </span>
          <div>
            <p className="eyebrow">Signed in as</p>
            <h2>{user?.name || 'Library owner'}</h2>
            <p>{user?.email || 'Email not returned by the API'}</p>
          </div>
        </article>
        <article className="account-card">
          <p className="eyebrow">Service connection</p>
          <h2>Knowledge base API</h2>
          <dl className="account-details">
            <div><dt>Base URL</dt><dd>{API_BASE_URL}</dd></div>
            <div><dt>Authentication</dt><dd>Bearer token</dd></div>
            <div><dt>User ID</dt><dd>{user?.id || 'Not returned'}</dd></div>
          </dl>
        </article>
        <article className="account-card account-card--logout">
          <div>
            <p className="eyebrow">Session</p>
            <h2>Close this library session</h2>
            <p>Your local access token will be removed from this browser.</p>
          </div>
          <button className="button button--secondary" type="button" onClick={handleLogout}>Log out</button>
        </article>
      </section>
    </div>
  )
}

export default AccountPage
