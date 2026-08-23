import { Link } from 'react-router-dom'

const workflow = [
  {
    number: '01',
    title: 'Upload',
    description: 'Bring the documents that matter into one private collection.',
  },
  {
    number: '02',
    title: 'Organize',
    description: 'Each file becomes a searchable source in your personal catalogue.',
  },
  {
    number: '03',
    title: 'Search',
    description: 'Ask with natural language instead of remembering exact keywords.',
  },
  {
    number: '04',
    title: 'Retrieve',
    description: 'Return to the most relevant passage and its original source.',
  },
]

function LandingPage() {
  return (
    <>
      <section className="hero">
        <div className="container hero__grid">
          <div className="hero__copy">
            <p className="eyebrow eyebrow--light">Your private digital archive</p>
            <h1>Your knowledge, <em>organized.</em></h1>
            <p className="hero__lede">
              Upload your documents, build a personal library, and find information by meaning—not
              just keywords.
            </p>
            <div className="hero__actions">
              <Link className="button button--accent" to="/signup">
                Start your library <span aria-hidden="true">→</span>
              </Link>
              <a className="button button--ghost-light" href="#how-it-works">
                See how it works
              </a>
            </div>
            <p className="hero__note">A focused workspace for documents, sources, and ideas.</p>
          </div>

          <div className="catalogue-preview" aria-label="Knowledge library interface preview">
            <div className="catalogue-preview__header">
              <span>Catalogue no. 01</span>
              <span>Interface preview</span>
            </div>
            <div className="catalogue-preview__search">
              <span aria-hidden="true">⌕</span>
              <span>Search the archive by meaning…</span>
              <kbd>↵</kbd>
            </div>
            <div className="catalogue-preview__label">Relevant sources</div>
            <div className="preview-record preview-record--primary">
              <span className="preview-record__number">A–01</span>
              <div>
                <strong>Research methods</strong>
                <p>Notes on qualitative interviews and recurring themes…</p>
              </div>
              <span className="preview-record__tag">PDF</span>
            </div>
            <div className="preview-record">
              <span className="preview-record__number">A–02</span>
              <div>
                <strong>Project observations</strong>
                <p>Collected decisions, questions, and source material…</p>
              </div>
              <span className="preview-record__tag">DOC</span>
            </div>
            <div className="catalogue-preview__footer">
              <span><i /> Sources remain attached</span>
              <span>Meaning over keywords</span>
            </div>
          </div>
        </div>
      </section>

      <section className="workflow-section" id="how-it-works">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">From file to finding</p>
              <h2>A simple path through your own knowledge.</h2>
            </div>
            <p>
              Commonplace turns a folder of documents into an archive you can actually return to.
            </p>
          </div>
          <div className="workflow-grid">
            {workflow.map((item, index) => (
              <article className="workflow-card" key={item.number}>
                <div className="workflow-card__top">
                  <span>{item.number}</span>
                  {index < workflow.length - 1 && <span aria-hidden="true">→</span>}
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="principles-section" id="principles">
        <div className="container principles-grid">
          <div className="principles-intro">
            <p className="eyebrow eyebrow--light">Designed for return</p>
            <h2>Not another chat window. A library with memory.</h2>
            <p>
              Search should lead back to evidence. Every result is presented as a passage from a
              named source, so your archive stays legible and trustworthy.
            </p>
            <Link className="text-link text-link--light" to="/signup">
              Create your catalogue <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="principles-list">
            <article>
              <span>01 / Private by structure</span>
              <h3>Your collection belongs to your account.</h3>
              <p>Personal documents and results are organized around a per-user library.</p>
            </article>
            <article>
              <span>02 / Sources first</span>
              <h3>Every finding keeps its context.</h3>
              <p>Relevant passages stay connected to the document they came from.</p>
            </article>
            <article>
              <span>03 / Quietly useful</span>
              <h3>A serious tool without the spectacle.</h3>
              <p>Clear hierarchy and restrained interaction keep the work in focus.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="landing-cta">
        <div className="container landing-cta__inner">
          <div>
            <p className="eyebrow">Begin a commonplace book</p>
            <h2>Make your documents easier to remember.</h2>
          </div>
          <Link className="button" to="/signup">
            Get started <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <footer className="public-footer">
        <div className="container public-footer__inner">
          <div>
            <strong>Commonplace</strong>
            <span>Personal semantic knowledge base</span>
          </div>
          <p>Built for private research, retrieval, and return.</p>
        </div>
      </footer>
    </>
  )
}

export default LandingPage
