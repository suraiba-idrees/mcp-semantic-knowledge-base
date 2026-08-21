function SearchBox({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  label = 'Search across your knowledge',
  placeholder = 'What did I save about…',
  variant = 'default',
  autoFocus = false,
}) {
  return (
    <form className={`search-box search-box--${variant}`} onSubmit={onSubmit} role="search">
      <label htmlFor={`knowledge-query-${variant}`}>{label}</label>
      <div className="search-box__control">
        <span className="search-box__icon" aria-hidden="true">
          ⌕
        </span>
        <input
          id={`knowledge-query-${variant}`}
          type="search"
          value={value}
          placeholder={placeholder}
          autoComplete="off"
          autoFocus={autoFocus}
          onChange={(event) => onChange(event.target.value)}
        />
        <button className="button" type="submit" disabled={isLoading || !value.trim()}>
          {isLoading ? 'Searching…' : 'Search library'}
        </button>
      </div>
    </form>
  )
}

export default SearchBox
