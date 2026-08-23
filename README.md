<div align="center">

# 🧠 MCP Semantic Knowledge Base

### A Multi-User MCP Server for Semantic Search Over Personal Document Collections

![Python](https://img.shields.io/badge/Python-3.14-blue?logo=python&logoColor=white)
![FastMCP](https://img.shields.io/badge/FastMCP-Server-8A2BE2)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react&logoColor=black)
![Qdrant](https://img.shields.io/badge/Qdrant-Vector%20Database-red)
![Status](https://img.shields.io/badge/Status-In%20Progress-yellow)

</div>

---

## Overview

**MCP Semantic Knowledge Base** is a [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that exposes semantic search over a real, personally-owned document corpus as a set of callable tools. Any MCP-compatible client (Claude Desktop, Claude Code, or a custom client) can connect to the server and query it live.

Unlike keyword search, which misses content that doesn't share exact wording, this server uses vector embeddings to search **by meaning** — and exposes that capability as a reusable, protocol-level tool rather than a one-off chatbot.

The project expands beyond the server itself into a full multi-user web application, with per-user document isolation, authentication, and a web UI for uploading and searching documents.

---

## Problem Statement

Static keyword search over personal or team knowledge (notes, papers, docs) misses semantically related content that doesn't share exact keywords. This project builds a tool that lets any MCP client search a real corpus by meaning — and exposes it as a protocol-level tool that any compatible AI client can call directly, rather than through a custom chatbot UI.

---

## Project Status

🚧 **In active development — see Known Limitations below for an honest account of what did not make it into this submission.**

| Component | Owner | Status |
|---|---|---|
| MCP Server structure (FastMCP) | Suraiba | ✅ Done |
| `search_notes()` tool | Suraiba | ✅ Done (placeholder data; real Qdrant connection pending) |
| `get_document()` tool | Suraiba | ✅ Done |
| `list_sources()` tool | Suraiba | ✅ Done |
| Error handling / "no confident match" logic | Suraiba | ✅ Done |
| Document ingestion + chunking | Aniqa | ❌ Not started |
| Qdrant vector storage (real data) | Aniqa | ❌ Not started |
| Retrieval precision evaluation | Suraiba | ⏳ Blocked on real Qdrant data |
| Backend API + authentication | Saboora | 🚧 In progress |
| Frontend (upload + search UI) | Maryam | ✅ Done and merged |
| Per-user data isolation in Qdrant | Aniqa | ❌ Not started |
| Live demo with Claude Desktop | Suraiba | ⏳ Planned |

The MCP server's three tools are fully built and tested via the MCP Inspector against temporary placeholder data. The frontend is a complete, working React application. Backend authentication and Qdrant-backed ingestion were still in progress at submission time — see Known Limitations.

---

## Tech Stack

| Layer | Technology |
|---|---|
| MCP Server | FastMCP (Python) |
| Backend API | FastAPI |
| Vector Database | Qdrant |
| Frontend | React |
| Transport | JSON-RPC 2.0 over STDIO (local dev) |
| Testing | MCP Inspector |

---

## Project Structure

```
mcp-semantic-knowledge-base/
│
├── backend/
│   ├── mcp_server/          # MCP server exposing search_notes, get_document, list_sources
│   │   └── server.py
│   │
│   ├── ingestion/            # Document chunking, embeddings, Qdrant storage
│   │
│   ├── api/                  # FastAPI routes, authentication, per-user isolation
│   │
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/                 # Web UI for upload, search, and login (complete)
│
├── docs/                     # Architecture diagram, demo screenshots
│
└── README.md
```

---

## MCP Tools

| Tool | Description | Priority |
|---|---|---|
| `search_notes(query, top_k)` | Returns ranked, relevant document chunks with source citation | Must |
| `get_document(doc_id)` | Fetches the full content of a specific source document | Must |
| `list_sources()` | Enumerates all documents currently indexed | Should |

All three tools currently run against temporary in-memory placeholder data and have been verified working end-to-end via the MCP Inspector. They also handle empty inputs and unknown IDs gracefully, and return a "no confident match" message instead of a forced, low-relevance answer.

---

## Running the MCP Server Locally

1. Navigate to the server directory:
   ```bash
   cd backend/mcp_server
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/Scripts/activate   # Windows (Git Bash)
   ```
3. Install dependencies:
   ```bash
   pip install fastmcp
   ```
4. Run the server with the MCP Inspector for local testing:
   ```bash
   fastmcp dev inspector server.py
   ```
5. Open the Inspector URL printed in the terminal, connect to the server, and try the tools under the **Tools** tab.

*(Once ingestion is complete, this section will be updated with Qdrant setup instructions.)*

## Running the Frontend Locally

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```
Opens at `http://localhost:5173`. Requires the backend API running at the URL set in `.env`.

---

## Target Corpus

[PLACEHOLDER — replace with a short description of the real document set used, e.g. "a personal collection of self-help and non-fiction books"]

---

## Contributors

| Team Member | Responsibility |
|---|---|
| Suraiba Idrees | MCP Server + Tools, Integration, README |
| Aniqa | Document Ingestion + Qdrant |
| Saboora | Backend API + Authentication |
| Maryam | Frontend |

---

## Known Limitations (at submission time)

In the interest of an honest account of the project's state:

- **Document ingestion and Qdrant storage were not completed** by the assigned deadline, so `search_notes` and `get_document` are demonstrated against temporary placeholder data rather than a real, self-owned corpus. The tool interfaces are final and will not need to change once real ingestion is connected.
- **Backend authentication was still in progress** at submission time, so the frontend and MCP server have not yet been demonstrated as a fully connected, end-to-end system.
- **Retrieval precision evaluation** could not be produced without real retrieval results, and is planned as an immediate next step.
- **A live Claude Desktop demo** was not completed for this submission and is planned next.
- The **frontend is fully built and merged**, and the **MCP server's three tools are fully built, error-handled, and verified via the MCP Inspector** — these two pieces are ready to connect to the remaining backend work as soon as it lands.

---

## Roadmap

- [ ] Connect `search_notes` to real Qdrant vector search
- [ ] Implement per-user document isolation
- [ ] Backend API layer connecting frontend to MCP tools
- [ ] User authentication (signup/login)
- [ ] Retrieval precision evaluation on a hand-labeled query set
- [ ] Live demo with Claude Desktop

---

## License

Developed as part of the Zeppelin AI & Generative AI Fellowship.