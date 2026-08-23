function ErrorNotice({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div className="notice notice--error" role="alert">
      <span className="notice__mark" aria-hidden="true">
        !
      </span>
      <div>
        <strong>{title}</strong>
        <p>{message}</p>
      </div>
      {onRetry && (
        <button className="text-button" type="button" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}

export default ErrorNotice
