import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import EmptyState from '../components/EmptyState.jsx'
import ErrorNotice from '../components/ErrorNotice.jsx'
import LoadingState from '../components/LoadingState.jsx'
import PageHeader from '../components/PageHeader.jsx'
import SearchBox from '../components/SearchBox.jsx'
import SearchResult from '../components/SearchResult.jsx'
import { normalizeSearchResults, searchApi } from '../services/api.js'

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)
  const [submittedQuery, setSubmittedQuery] = useState('')
  const [topK, setTopK] = useState(5)
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [error, setError] = useState('')
  const initialSearchDone = useRef(false)

  const runSearch = useCallback(async (searchQuery, resultLimit = topK) => {
    const trimmedQuery = searchQuery.trim()
    if (!trimmedQuery) return
    setIsLoading(true)
    setError('')
    setSubmittedQuery(trimmedQuery)
    setSearchParams({ q: trimmedQuery })

    try {
      const payload = await searchApi.search(trimmedQuery, resultLimit)
      setResults(normalizeSearchResults(payload))
      setHasSearched(true)
    } catch (requestError) {
      setResults([])
      setHasSearched(true)
      setError(requestError.message)
    } finally {
      setIsLoading(false)
    }
  }, [setSearchParams, topK])

  useEffect(() => {
    if (initialQuery && !initialSearchDone.current) {
      initialSearchDone.current = true
      runSearch(initialQuery, 5)
    }
  }, [initialQuery, runSearch])

  function handleSubmit(event) {
    event.preventDefault()
    runSearch(query)
  }

  return (
    <div className="page-stack page-stack--search">
      <PageHeader
        eyebrow="Semantic search"
        title="Find what you meant"
        description="Search by concept or question. Results stay grounded in the documents you added."
      />

      <section className="search-workspace">
        <SearchBox
          value={query}
          onChange={setQuery}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          placeholder="Search across your knowledge…"
          variant="page"
          autoFocus={!initialQuery}
        />
        <div className="search-options">
          <span>Meaning-based retrieval</span>
          <label>
            Results
            <select value={topK} onChange={(event) => setTopK(Number(event.target.value))}>
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
            </select>
          </label>
        </div>
      </section>

      {isLoading && (
        <section className="search-results-section">
          <LoadingState label="Looking across your sources…" />
        </section>
      )}

      {!isLoading && error && (
        <section className="search-results-section">
          <ErrorNotice message={error} onRetry={() => runSearch(submittedQuery)} />
        </section>
      )}

      {!isLoading && !error && !hasSearched && (
        <section className="search-introduction">
          <div>
            <span className="search-introduction__number">A–Z</span>
            <p className="eyebrow">Search with context</p>
            <h2>Ask for an idea, not a filename.</h2>
          </div>
          <div className="search-suggestions">
            <span>Try a question like</span>
            {[
              'What were the main research findings?',
              'Where did I write about project risks?',
              'Find notes related to retrieval quality.',
            ].map((suggestion) => (
              <button key={suggestion} type="button" onClick={() => setQuery(suggestion)}>
                {suggestion} <span aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {!isLoading && !error && hasSearched && results.length === 0 && (
        <EmptyState
          label="No confident match"
          title="Nothing in the archive answered that yet."
          description="Try a broader phrase, or add another source to your library."
          action={<Link className="button button--secondary" to="/upload">Add a document</Link>}
        />
      )}

      {!isLoading && !error && results.length > 0 && (
        <section className="search-results-section">
          <div className="section-title-row search-results-heading">
            <div>
              <p className="eyebrow">Most relevant passages</p>
              <h2>Results for “{submittedQuery}”</h2>
            </div>
            <span>{results.length} {results.length === 1 ? 'source' : 'sources'}</span>
          </div>
          <div className="search-results-list">
            {results.map((result, index) => (
              <SearchResult key={result.id || result.doc_id || result.chunk_id || index} result={result} index={index} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default SearchPage
