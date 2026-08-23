function EmptyState({ label, title, description, action, compact = false }) {
  return (
    <div className={`empty-state${compact ? ' empty-state--compact' : ''}`}>
      {label && <span className="empty-state__label">{label}</span>}
      <span className="empty-state__motif" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <h2>{title}</h2>
      <p>{description}</p>
      {action && <div className="empty-state__action">{action}</div>}
    </div>
  )
}

export default EmptyState
