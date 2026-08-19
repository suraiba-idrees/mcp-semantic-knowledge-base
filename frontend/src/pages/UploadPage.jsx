import { useState } from 'react'
import { Link } from 'react-router-dom'
import ErrorNotice from '../components/ErrorNotice.jsx'
import PageHeader from '../components/PageHeader.jsx'
import UploadArea from '../components/UploadArea.jsx'
import { documentsApi } from '../services/api.js'

function UploadPage() {
  const [file, setFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(null)

  async function handleUpload() {
    if (!file) return
    setIsUploading(true)
    setError('')
    setSuccess(null)

    try {
      const payload = await documentsApi.upload(file)
      setSuccess({ filename: payload?.filename || file.name, message: payload?.message })
      setFile(null)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="page-stack page-stack--narrow">
      <PageHeader
        eyebrow="New source"
        title="Add to the archive"
        description="Upload one document for the backend to process and index into your library."
      />

      <section className="upload-workspace">
        <div className="upload-workspace__main">
          {error && <ErrorNotice title="Upload could not be completed" message={error} />}
          {success && (
            <div className="upload-success" role="status">
              <span className="upload-success__mark" aria-hidden="true">✓</span>
              <div>
                <span className="eyebrow">Accepted by the service</span>
                <h2>{success.filename}</h2>
                <p>{success.message || 'The document was uploaded successfully.'}</p>
              </div>
              <Link className="text-link" to="/documents">View catalogue <span aria-hidden="true">→</span></Link>
            </div>
          )}

          <UploadArea file={file} onFileChange={setFile} disabled={isUploading} />

          <div className="upload-actions">
            <Link className="button button--text" to="/documents">Cancel</Link>
            <button className="button" type="button" disabled={!file || isUploading} onClick={handleUpload}>
              {isUploading ? 'Uploading document…' : 'Add to library'}
            </button>
          </div>
        </div>

        <aside className="upload-guidance">
          <span className="upload-guidance__number">01</span>
          <p className="eyebrow">Before you add a file</p>
          <h2>Choose material worth finding again.</h2>
          <ol>
            <li><span>1</span><p><strong>Select one document.</strong> The current API accepts a single file per request.</p></li>
            <li><span>2</span><p><strong>Wait for confirmation.</strong> Processing state will appear when supplied by the backend.</p></li>
            <li><span>3</span><p><strong>Search after indexing.</strong> Results will point back to their source record.</p></li>
          </ol>
          <div className="upload-guidance__note">
            <strong>Format support</strong>
            <p>No file-type restrictions are declared by the current backend contract.</p>
          </div>
        </aside>
      </section>
    </div>
  )
}

export default UploadPage
