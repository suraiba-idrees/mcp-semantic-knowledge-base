import { useRef, useState } from 'react'

function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function UploadArea({ file, onFileChange, disabled = false }) {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  function selectFile(nextFile) {
    if (nextFile) onFileChange(nextFile)
  }

  function handleDrop(event) {
    event.preventDefault()
    setIsDragging(false)
    if (!disabled) selectFile(event.dataTransfer.files?.[0])
  }

  if (file) {
    const extension = file.name.includes('.') ? file.name.split('.').pop().toUpperCase() : 'FILE'
    return (
      <div className="selected-file">
        <div className="selected-file__folio" aria-hidden="true">
          {extension.slice(0, 4)}
        </div>
        <div className="selected-file__details">
          <span className="eyebrow">Ready to add</span>
          <strong>{file.name}</strong>
          <span>{formatBytes(file.size)}</span>
        </div>
        <button
          className="text-button text-button--danger"
          type="button"
          disabled={disabled}
          onClick={() => onFileChange(null)}
        >
          Remove
        </button>
      </div>
    )
  }

  return (
    <div
      className={`upload-area${isDragging ? ' is-dragging' : ''}`}
      onDragEnter={(event) => {
        event.preventDefault()
        if (!disabled) setIsDragging(true)
      }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsDragging(false)
      }}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        hidden
        id="document-file"
        type="file"
        disabled={disabled}
        onChange={(event) => selectFile(event.target.files?.[0])}
      />
      <span className="upload-area__symbol" aria-hidden="true">
        <span />
        <span>+</span>
      </span>
      <h2>Bring a document into your library</h2>
      <p>Drop one file here, or choose it from your device.</p>
      <button className="button button--secondary" type="button" onClick={() => inputRef.current?.click()}>
        Browse files
      </button>
      <small>Accepted formats are determined by the backend ingestion service.</small>
    </div>
  )
}

export default UploadArea
