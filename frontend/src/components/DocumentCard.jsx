import StatusBadge from './StatusBadge.jsx'

function formatDate(value) {
  if (!value) return 'Date unavailable'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function getDocumentName(document) {
  return document.title || document.filename || document.name || 'Untitled document'
}

function getDocumentType(document) {
  if (document.type) return String(document.type).replace('application/', '').toUpperCase()
  const filename = document.filename || document.name || ''
  const extension = filename.includes('.') ? filename.split('.').pop() : ''
  return extension ? extension.toUpperCase() : 'DOCUMENT'
}

function DocumentCard({ document, onOpen, onRemove, isRemoving = false }) {
  const documentId = document.id || document.doc_id || document.document_id
  const name = getDocumentName(document)
  const type = getDocumentType(document)
  const date = document.uploaded_at || document.created_at || document.upload_date

  return (
    <article className="document-card">
      <button className="document-card__body" type="button" onClick={() => onOpen?.(document)}>
        <span className="document-card__folio" aria-hidden="true">
          <span>{type.slice(0, 4)}</span>
        </span>
        <span className="document-card__content">
          <span className="document-card__topline">
            <StatusBadge status={document.status} />
            <span className="document-card__date">{formatDate(date)}</span>
          </span>
          <strong>{name}</strong>
          <span className="document-card__meta">{type} · Personal archive</span>
        </span>
      </button>
      <div className="document-card__footer">
        <button type="button" className="text-button" onClick={() => onOpen?.(document)}>
          Open record <span aria-hidden="true">→</span>
        </button>
        {documentId && onRemove && (
          <button
            type="button"
            className="text-button text-button--danger"
            disabled={isRemoving}
            onClick={() => onRemove(document)}
          >
            {isRemoving ? 'Removing…' : 'Remove'}
          </button>
        )}
      </div>
    </article>
  )
}

export default DocumentCard
