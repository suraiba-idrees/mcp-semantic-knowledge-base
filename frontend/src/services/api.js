import { clearStoredToken, getStoredToken } from './auth.js'

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()
export const API_BASE_URL = (configuredBaseUrl || 'http://localhost:8000').replace(/\/$/, '')

export class ApiError extends Error {
  constructor(message, status = 0, data = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

function getErrorMessage(data, response) {
  if (typeof data === 'string' && data.trim()) return data
  if (typeof data?.detail === 'string') return data.detail
  if (Array.isArray(data?.detail)) {
    return data.detail.map((item) => item.msg).filter(Boolean).join(' ') || 'The request was not accepted.'
  }
  if (typeof data?.message === 'string') return data.message
  return response.statusText || 'The request could not be completed.'
}

async function request(path, options = {}) {
  const { body, formData, signal, includeAuth = true, ...fetchOptions } = options
  const headers = new Headers(fetchOptions.headers)
  const token = getStoredToken()

  if (includeAuth && token) headers.set('Authorization', `Bearer ${token}`)
  if (body !== undefined) headers.set('Content-Type', 'application/json')

  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...fetchOptions,
      headers,
      body: formData || (body !== undefined ? JSON.stringify(body) : undefined),
      signal,
    })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new ApiError(
      'The knowledge base service is unavailable. Check that the backend is running and try again.',
      0,
    )
  }

  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json')
    ? await response.json().catch(() => null)
    : await response.text().catch(() => '')

  if (!response.ok) {
    if (response.status === 401 && includeAuth) {
      clearStoredToken()
      window.dispatchEvent(new CustomEvent('commonplace:unauthorized'))
    }
    throw new ApiError(getErrorMessage(data, response), response.status, data)
  }

  return data
}

export const authApi = {
  signup: (credentials) => request('/auth/signup', { method: 'POST', body: credentials, includeAuth: false }),
  login: (credentials) => request('/auth/login', { method: 'POST', body: credentials, includeAuth: false }),
  me: () => request('/auth/me'),
}

export const documentsApi = {
  list: (signal) => request('/documents', { signal }),
  get: (documentId, signal) => request(`/documents/${encodeURIComponent(documentId)}`, { signal }),
  upload: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return request('/documents/upload', { method: 'POST', formData })
  },
  remove: (documentId) => request(`/documents/${encodeURIComponent(documentId)}`, { method: 'DELETE' }),
}

export const searchApi = {
  search: (query, topK = 5, signal) =>
    request('/search', { method: 'POST', body: { query, top_k: topK }, signal }),
}

export function normalizeDocuments(payload) {
  const documents = Array.isArray(payload) ? payload : payload?.documents
  return Array.isArray(documents) ? documents : []
}

export function normalizeSearchResults(payload) {
  const results = Array.isArray(payload) ? payload : payload?.results
  return Array.isArray(results) ? results : []
}
