import { Link } from 'react-router-dom'

function BrandMark({ compact = false, inverse = false }) {
  return (
    <Link
      className={`brand-mark${compact ? ' brand-mark--compact' : ''}${inverse ? ' brand-mark--inverse' : ''}`}
      to="/"
      aria-label="Commonplace home"
    >
      <span className="brand-mark__symbol" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <span className="brand-mark__text">
        <strong>Commonplace</strong>
        {!compact && <small>Personal knowledge base</small>}
      </span>
    </Link>
  )
}

export default BrandMark
