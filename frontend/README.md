# Commonplace frontend

Commonplace is the React interface for the Personal Semantic Knowledge Base. It presents uploaded sources as a private catalogue and semantic matches as grounded search results rather than a chat conversation.

## Run locally

```bash
npm install
copy .env.example .env
npm run dev
```

The Vite app opens at `http://localhost:5173`. Set `VITE_API_BASE_URL` when the FastAPI service is available somewhere other than `http://localhost:8000`.

## Available routes

- `/` — public landing page
- `/login` — account login
- `/signup` — account creation
- `/dashboard` — protected library overview
- `/documents` — protected document catalogue
- `/upload` — protected single-document upload
- `/search` — protected semantic search and source results
- `/account` — protected session and API details

Protected routes require a bearer token issued by the backend. The frontend validates an existing token through `GET /auth/me` before opening the library.

## Expected API contract

All calls are centralized in `src/services/api.js`.

| Method | Path | Frontend expectation |
| --- | --- | --- |
| `POST` | `/auth/signup` | JSON body with `email` and `password` |
| `POST` | `/auth/login` | JSON body with `email` and `password`; response contains `access_token` |
| `GET` | `/auth/me` | Current user payload, ideally including `user_id`, `email`, and optional `name` |
| `GET` | `/documents` | Response contains a `documents` array |
| `POST` | `/documents/upload` | Multipart form with one `file` field |
| `GET` | `/documents/{doc_id}` | Document record or content detail |
| `DELETE` | `/documents/{doc_id}` | Successful removal response |
| `POST` | `/search` | JSON body `{ "query": string, "top_k": number }`; response contains `results` |

The backend contract currently visible on `origin/feature/backend-api-auth` returns a placeholder token (`JWT_TOKEN`) and empty data arrays. The frontend deliberately rejects that placeholder token instead of treating it as production authentication. Once real JWT issuance and persistence are merged, no page-level fetch calls need to change.

## Quality checks

```bash
npm run lint
npm run build
```
