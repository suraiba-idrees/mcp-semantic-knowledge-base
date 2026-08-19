import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import DocumentCard from '../components/DocumentCard.jsx'
import EmptyState from '../components/EmptyState.jsx'
import ErrorNotice from '../components/ErrorNotice.jsx'
import LoadingState from '../components/LoadingState.jsx'
import PageHeader from '../components/PageHeader.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { useDocuments } from '../hooks/useDocuments.js'
import { documentsApi } from '../services/api.js'

function documentName(document) {
  return document.title || document.filename || document.name || 'Untitled document'
}

function formatDetail(value) {
  if (!value) return 'Not provided'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return new Intl.DateTimeFormat('en', { dateStyle: 'long' }).format(date)
}

function DocumentsPage() {
  const { documents, setDocuments, isLoading, error, reload } = useDocuments()
  const [filter, setFilter] = useState('')
  const [sort, setSort] = useState('recent')
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [detailError, setDetailError] = useState('')
  const [isLoadingDetail, setIsLoadingDetail] = useState(false)
  const [removingId, setRemovingId] = useState('')
  const [actionError, setActionError] = useState('')

  const filteredDocuments = useMemo(() => {
    const query = filter.trim().toLowerCase()
    const nextDocuments = query
      ? documents.filter((document) => documentName(document).toLowerCase().includes(query))
      : [...documents]

    if (sort === 'title') nextDocuments.sort((a, b) => documentName(a).localeCompare(documentName(b)))
    return nextDocuments
  }, [documents, filter, sort])

  async function openDocument(document) {
    setSelectedDocument(document)
    setDetailError('')
    const id = document.id || document.doc_id || document.document_id
    if (!id) return

    setIsLoadingDetail(true)
    try {
      const payload = await documentsApi.get(id)
      setSelectedDocument((current) => ({ ...current, ...payload }))
    } catch (requestError) {
      setDetailError(requestError.message)
    } finally {
      setIsLoadingDetail(false)
    }
  }

  async function removeDocument(document) {
    const id = document.id || document.doc_id || document.document_id
    if (!id) return
    if (!window.confirm(`Remove “${documentName(document)}” from your library?`)) return

    setRemovingId(id)
    setActionError('')
    try {
      await documentsApi.remove(id)
      setDocuments((current) => current.filter((item) => (item.id || item.doc_id || item.document_id) !== id))
      if ((selectedDocument?.id || selectedDocument?.doc_id || selectedDocument?.document_id) === id) {
        setSelectedDocument(null)
      }
    } catch (requestError) {
      setActionError(requestError.message)
    } finally {
      setRemovingId('')
    }
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="My documents"
        title="The catalogue"
        description="Browse the sources that make up your personal knowledge base."
        actions={<Link className="button" to="/upload"><span aria-hidden="true">+</span> Add document</Link>}
      />

      <div className="catalogue-toolbar">
        <label className="catalogue-filter">
          <span className="sr-only">Filter documents</span>
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            value={filter}
            placeholder="Filter this catalogue…"
            onChange={(event) => setFilter(event.target.value)}
          />
        </label>
        <div className="catalogue-toolbar__count">
          {isLoading ? 'Reading catalogue…' : `${filteredDocuments.length} ${filteredDocuments.length === 1 ? 'record' : 'records'}`}
        </div>
        <label className="catalogue-sort">
          <span>Sort</span>
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="recent">Recently added</option>
            <option value="title">Title A–Z</option>
          </select>
        </label>
      </div>

      {actionError && <ErrorNotice title="The document was not removed" message={actionError} />}
      {isLoading && <LoadingState label="Reading the catalogue…" />}
      {!isLoading && error && <ErrorNotice message={error} onRetry={reload} />}
      {!isLoading && !error && documents.length === 0 && (
        <EmptyState
          label="No records yet"
          title="A quiet shelf, for now."
          description="Add a document and it will appear here once the backend has accepted it."
          action={<Link className="button" to="/upload">Upload a document</Link>}
        />
      )}
      {!isLoading && !error && documents.length > 0 && filteredDocuments.length === 0 && (
        <EmptyState
          compact
          label="No matching records"
          title="Try a broader title."
          description="This catalogue filter looks at document names only."
          action={<button className="button button--secondary" type="button" onClick={() => setFilter('')}>Clear filter</button>}
        />
      )}
      {!isLoading && !error && filteredDocuments.length > 0 && (
        <div className="document-grid">
          {filteredDocuments.map((document, index) => {
            const id = document.id || document.doc_id || document.document_id
            return (
              <DocumentCard
                key={id || document.filename || index}
                document={document}
                onOpen={openDocument}
                onRemove={removeDocument}
                isRemoving={removingId === id}
              />
            )
          })}
        </div>
      )}

      {selectedDocument && (
        <div className="record-panel" role="dialog" aria-modal="true" aria-labelledby="record-panel-title">
          <button className="record-panel__backdrop" type="button" aria-label="Close record" onClick={() => setSelectedDocument(null)} />
          <aside className="record-panel__sheet">
            <div className="record-panel__header">
              <span className="eyebrow">Catalogue record</span>
              <button type="button" aria-label="Close record" onClick={() => setSelectedDocument(null)}>×</button>
            </div>
            {isLoadingDetail ? (
              <LoadingState label="Opening record…" />
            ) : (
              <>
                <div className="record-panel__folio" aria-hidden="true">DOC</div>
                <StatusBadge status={selectedDocument.status} />
                <h2 id="record-panel-title">{documentName(selectedDocument)}</h2>
                {detailError && <ErrorNotice title="Full record unavailable" message={detailError} />}
                <dl className="record-details">
                  <div><dt>Record ID</dt><dd>{selectedDocument.id || selectedDocument.doc_id || selectedDocument.document_id || 'Not provided'}</dd></div>
                  <div><dt>Added</dt><dd>{formatDetail(selectedDocument.uploaded_at || selectedDocument.created_at || selectedDocument.upload_date)}</dd></div>
                  <div><dt>Type</dt><dd>{selectedDocument.type || 'Not provided'}</dd></div>
                </dl>
                {(selectedDocument.content || selectedDocument.text || selectedDocument.snippet) && (
                  <div className="record-panel__excerpt">
                    <span className="eyebrow">Document text</span>
                    <p>{selectedDocument.content || selectedDocument.text || selectedDocument.snippet}</p>
                  </div>
                )}
              </>
            )}
          </aside>
        </div>
      )}
    </div>
  )
}

export default DocumentsPage
