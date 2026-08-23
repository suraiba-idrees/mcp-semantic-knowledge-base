import { useCallback, useEffect, useState } from 'react'
import { documentsApi, normalizeDocuments } from '../services/api.js'

export function useDocuments() {
  const [documents, setDocuments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    documentsApi
      .list(controller.signal)
      .then((payload) => setDocuments(normalizeDocuments(payload)))
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') setError(requestError.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false)
      })

    return () => controller.abort()
  }, [reloadKey])

  const reload = useCallback(() => {
    setIsLoading(true)
    setError('')
    setReloadKey((key) => key + 1)
  }, [])

  return { documents, setDocuments, isLoading, error, reload }
}
