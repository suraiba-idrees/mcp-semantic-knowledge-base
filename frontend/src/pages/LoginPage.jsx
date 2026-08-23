import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'
import { useAuth } from '../hooks/useAuth.js'

function LoginPage() {
  const { isAuthenticated, login, sessionNotice } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [requestError, setRequestError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  const signupMessage = location.state?.signupComplete
    ? 'Account created. Log in to open your library.'
    : ''

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
    setRequestError('')
  }

  function validate() {
    const nextErrors = {}
    if (!form.email.trim()) nextErrors.email = 'Enter your email address.'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = 'Enter a valid email address.'
    if (!form.password) nextErrors.password = 'Enter your password.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!validate()) return
    setIsSubmitting(true)
    setRequestError('')

    try {
      await login({ email: form.email.trim(), password: form.password })
      navigate(location.state?.from || '/dashboard', { replace: true })
    } catch (error) {
      setRequestError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Open your library."
      description="Log in to search your sources and continue building your archive."
      footer={
        <p>
          New to Commonplace? <Link to="/signup">Create an account</Link>
        </p>
      }
    >
      {(signupMessage || sessionNotice) && (
        <div className="form-message form-message--success" role="status">
          {signupMessage || sessionNotice}
        </div>
      )}
      {requestError && (
        <div className="form-message form-message--error" role="alert">
          {requestError}
        </div>
      )}
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="field-group">
          <label htmlFor="login-email">Email address</label>
          <input
            id="login-email"
            name="email"
            type="email"
            value={form.email}
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'login-email-error' : undefined}
            placeholder="you@example.com"
            onChange={updateField}
          />
          {errors.email && <small id="login-email-error">{errors.email}</small>}
        </div>
        <div className="field-group">
          <div className="field-group__label-row">
            <label htmlFor="login-password">Password</label>
            <span>Required</span>
          </div>
          <input
            id="login-password"
            name="password"
            type="password"
            value={form.password}
            autoComplete="current-password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'login-password-error' : undefined}
            placeholder="Enter your password"
            onChange={updateField}
          />
          {errors.password && <small id="login-password-error">{errors.password}</small>}
        </div>
        <button className="button button--wide" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Opening library…' : 'Log in'}
        </button>
      </form>
      <p className="auth-form__note">Authentication is verified by the connected knowledge base API.</p>
    </AuthLayout>
  )
}

export default LoginPage
