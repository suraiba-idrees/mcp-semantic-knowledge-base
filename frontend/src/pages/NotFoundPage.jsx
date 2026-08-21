import { Link } from 'react-router-dom'
import BrandMark from '../components/BrandMark.jsx'

function NotFoundPage() {
  return (
    <main className="not-found-page">
      <BrandMark />
      <div className="not-found-page__record">
        <span>404 / Record missing</span>
        <h1>This page is not in the catalogue.</h1>
        <p>The address may have changed, or the record may never have existed.</p>
        <Link className="button" to="/">Return home</Link>
      </div>
    </main>
  )
}

export default NotFoundPage
