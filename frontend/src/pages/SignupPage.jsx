import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'
import { useAuth } from '../hooks/useAuth.js'

function SignupPage() {
  const { isAuthenticated, signup } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [requestError, setRequestError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isAuthenticated) return <Navigate to="/dashboard" replace />

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
    if (!form.password) nextErrors.password = 'Create a password.'
    else if (form.password.length < 8) nextErrors.password = 'Use at least 8 characters.'
    if (!form.confirmPassword) nextErrors.confirmPassword = 'Confirm your password.'
    else if (form.password !== form.confirmPassword) nextErrors.confirmPassword = 'Passwords do not match.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!validate()) return
    setIsSubmitting(true)
    setRequestError('')

    try {
      await signup({ email: form.email.trim(), password: form.password })
      navigate('/login', { replace: true, state: { signupComplete: true } })
    } catch (error) {
      setRequestError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout
      eyebrow="Create your account"
      title="Begin your archive."
      description="Set up the private library where your documents can become easier to find."
      footer={
        <p>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      }
    >
      {requestError && (
        <div className="form-message form-message--error" role="alert">
          {requestError}
        </div>
      )}
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="field-group">
          <label htmlFor="signup-email">Email address</label>
          <input
            id="signup-email"
            name="email"
            type="email"
            value={form.email}
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'signup-email-error' : undefined}
            placeholder="you@example.com"
            onChange={updateField}
          />
          {errors.email && <small id="signup-email-error">{errors.email}</small>}
        </div>
        <div className="field-group">
          <div className="field-group__label-row">
            <label htmlFor="signup-password">Password</label>
            <span>8+ characters</span>
          </div>
          <input
            id="signup-password"
            name="password"
            type="password"
            value={form.password}
            autoComplete="new-password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'signup-password-error' : undefined}
            placeholder="Create a password"
            onChange={updateField}
          />
          {errors.password && <small id="signup-password-error">{errors.password}</small>}
        </div>
        <div className="field-group">
          <label htmlFor="signup-confirm-password">Confirm password</label>
          <input
            id="signup-confirm-password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            autoComplete="new-password"
            aria-invalid={Boolean(errors.confirmPassword)}
            aria-describedby={errors.confirmPassword ? 'signup-confirm-error' : undefined}
            placeholder="Repeat your password"
            onChange={updateField}
          />
          {errors.confirmPassword && <small id="signup-confirm-error">{errors.confirmPassword}</small>}
        </div>
        <button className="button button--wide" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>
      <p className="auth-form__note">By continuing, you agree to use the library for content you own or may store.</p>
    </AuthLayout>
  )
}

export default SignupPage
