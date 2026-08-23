import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DocumentCard from '../components/DocumentCard.jsx'
import EmptyState from '../components/EmptyState.jsx'
import ErrorNotice from '../components/ErrorNotice.jsx'
import LoadingState from '../components/LoadingState.jsx'
import PageHeader from '../components/PageHeader.jsx'
import SearchBox from '../components/SearchBox.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { useDocuments } from '../hooks/useDocuments.js'

function getFirstName(user) {
  if (user?.name) return user.name.trim().split(/\s+/)[0]
  if (user?.email) return user.email.split('@')[0]
  return 'there'
}

function DashboardPage() {
  const { user } = useAuth()
  const { documents, isLoading, error, reload } = useDocuments()
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  function handleSearch(event) {
    event.preventDefault()
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  const recentDocuments = documents.slice(0, 3)

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Overview"
        title={`Good to see you, ${getFirstName(user)}.`}
        description="Your library is ready for the next question, source, or document."
        actions={
          <Link className="button" to="/upload">
            <span aria-hidden="true">+</span> Add document
          </Link>
        }
      />

      <section className="dashboard-search-panel">
        <div className="dashboard-search-panel__heading">
          <span className="eyebrow eyebrow--light">Semantic search</span>
          <span>Search by idea, topic, or remembered phrase.</span>
        </div>
        <SearchBox
          value={query}
          onChange={setQuery}
          onSubmit={handleSearch}
          label="Search your knowledge"
          placeholder="What do my documents say about…"
          variant="hero"
        />
      </section>

      <section className="metrics-grid" aria-label="Library overview">
        <article className="metric-card">
          <span className="metric-card__label">Documents</span>
          <strong>{isLoading ? '—' : documents.length}</strong>
          <Link to="/documents">View catalogue <span aria-hidden="true">→</span></Link>
        </article>
        <article className="metric-card">
          <span className="metric-card__label">Recently added</span>
          <strong>{isLoading ? '—' : recentDocuments.length}</strong>
          <span>Shown in this overview</span>
        </article>
        <article className="metric-card metric-card--quiet">
          <span className="metric-card__label">Search history</span>
          <strong>—</strong>
          <span>Not provided by the API</span>
        </article>
      </section>

      <section className="dashboard-section">
        <div className="section-title-row">
          <div>
            <p className="eyebrow">Latest records</p>
            <h2>Recently added</h2>
          </div>
          <Link className="text-link" to="/documents">View all documents <span aria-hidden="true">→</span></Link>
        </div>

        {isLoading && <LoadingState label="Reading the catalogue…" />}
        {!isLoading && error && <ErrorNotice message={error} onRetry={reload} />}
        {!isLoading && !error && recentDocuments.length === 0 && (
          <EmptyState
            compact
            label="Empty catalogue"
            title="Your first shelf is waiting."
            description="Upload a document to begin building your searchable archive."
            action={<Link className="button button--secondary" to="/upload">Add your first document</Link>}
          />
        )}
        {!isLoading && !error && recentDocuments.length > 0 && (
          <div className="document-grid document-grid--dashboard">
            {recentDocuments.map((document, index) => (
              <DocumentCard
                key={document.id || document.doc_id || document.filename || index}
                document={document}
                onOpen={() => navigate('/documents')}
              />
            ))}
          </div>
        )}
      </section>

      <section className="dashboard-prompt">
        <div className="dashboard-prompt__number">01</div>
        <div>
          <p className="eyebrow">A useful beginning</p>
          <h2>Build around the documents you return to.</h2>
          <p>
            Start with project notes, research, or reference material—not every file you have.
          </p>
        </div>
        <Link className="text-link" to="/upload">Choose a file <span aria-hidden="true">→</span></Link>
      </section>
    </div>
  )
}

export default DashboardPage
