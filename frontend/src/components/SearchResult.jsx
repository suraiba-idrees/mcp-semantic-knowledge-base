function formatScore(value) {
  const score = Number(value)
  if (!Number.isFinite(score)) return null
  const percentage = score <= 1 ? score * 100 : score
  return `${Math.round(percentage)}% relevance`
}

function SearchResult({ result, index }) {
  const title = result.title || result.document_title || result.filename || 'Untitled source'
  const snippet = result.snippet || result.text || result.content || 'No excerpt was returned for this source.'
  const documentId = result.doc_id || result.document_id || result.id
  const score = formatScore(result.score || result.similarity || result.relevance)
  const sourceLabel = result.source || result.filename || (documentId ? `Record ${documentId}` : 'Personal library')

  return (
    <article className="search-result">
      <div className="search-result__index" aria-hidden="true">
        {String(index + 1).padStart(2, '0')}
      </div>
      <div className="search-result__content">
        <div className="search-result__meta">
          <span>{sourceLabel}</span>
          {score && <span className="search-result__score">{score}</span>}
        </div>
        <h2>{title}</h2>
        <p>{snippet}</p>
        <div className="search-result__footer">
          <span>Source record</span>
          {result.page && <span>Page {result.page}</span>}
          {result.chunk_id && <span>Passage {result.chunk_id}</span>}
        </div>
      </div>
    </article>
  )
}

export default SearchResult
