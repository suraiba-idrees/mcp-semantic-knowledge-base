function LoadingState({ label = 'Loading…', compact = false }) {
  return (
    <div className={`loading-state${compact ? ' loading-state--compact' : ''}`} role="status">
      <span className="loading-state__mark" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <span>{label}</span>
    </div>
  )
}

export default LoadingState
