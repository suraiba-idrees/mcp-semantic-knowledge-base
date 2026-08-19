import { useCallback, useEffect, useMemo, useState } from 'react'
import { authApi } from '../services/api.js'
import { clearStoredToken, getStoredToken, storeToken } from '../services/auth.js'
import AuthContext from './auth-context.js'

function normalizeUser(payload, fallbackEmail = '') {
  if (!payload || typeof payload !== 'object') return fallbackEmail ? { email: fallbackEmail } : null
  return {
    id: payload.user_id || payload.id || '',
    email: payload.email || fallbackEmail,
    name: payload.name || payload.full_name || '',
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isChecking, setIsChecking] = useState(Boolean(getStoredToken()))
  const [sessionNotice, setSessionNotice] = useState('')

  const logout = useCallback(() => {
    clearStoredToken()
    setUser(null)
    setSessionNotice('')
  }, [])

  useEffect(() => {
    function handleUnauthorized() {
      setUser(null)
      setSessionNotice('Your session has expired. Please log in again.')
    }
    window.addEventListener('commonplace:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('commonplace:unauthorized', handleUnauthorized)
  }, [])

  useEffect(() => {
    const token = getStoredToken()
    if (!token) return undefined

    let isActive = true
    authApi
      .me()
      .then((payload) => {
        if (isActive) setUser(normalizeUser(payload))
      })
      .catch(() => {
        if (isActive) logout()
      })
      .finally(() => {
        if (isActive) setIsChecking(false)
      })

    return () => {
      isActive = false
    }
  }, [logout])

  const login = useCallback(async (credentials) => {
    const payload = await authApi.login(credentials)
    const token = payload?.access_token

    if (!token || token === 'JWT_TOKEN') {
      throw new Error(
        token === 'JWT_TOKEN'
          ? 'The backend is still returning its placeholder token. Login will be enabled when real JWT issuance is merged.'
          : 'The login response did not include an access token.',
      )
    }

    storeToken(token)
    try {
      const profile = await authApi.me()
      const nextUser = normalizeUser(profile, credentials.email)
      setUser(nextUser)
      setSessionNotice('')
      return nextUser
    } catch (error) {
      clearStoredToken()
      throw error
    }
  }, [])

  const signup = useCallback((credentials) => authApi.signup(credentials), [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user && getStoredToken()),
      isChecking,
      sessionNotice,
      login,
      signup,
      logout,
    }),
    [isChecking, login, logout, sessionNotice, signup, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
