function StatusBadge({ status }) {
  const normalized = (status || 'indexed').toLowerCase()
  const labelMap = {
    indexed: 'Indexed',
    ready: 'Indexed',
    complete: 'Indexed',
    completed: 'Indexed',
    processing: 'Processing',
    pending: 'Pending',
    failed: 'Failed',
    error: 'Failed',
  }
  const label = labelMap[normalized] || status || 'Indexed'
  const tone = ['failed', 'error'].includes(normalized)
    ? 'error'
    : ['processing', 'pending'].includes(normalized)
      ? 'pending'
      : 'success'

  return (
    <span className={`status-badge status-badge--${tone}`}>
      <span aria-hidden="true" />
      {label}
    </span>
  )
}

export default StatusBadge
