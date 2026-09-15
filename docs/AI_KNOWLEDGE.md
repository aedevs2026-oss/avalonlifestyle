# AI Knowledge & Ask Avalon

## Overview

Admin-managed knowledge pipeline: upload sources → extract → chunk → embed (pgvector) → retrieval for **Ask Avalon** chat. Answers prioritize structured catalogue data; missing facts return “Information not available.”

**No prior RAG stack existed** — this module adds Supabase `pgvector`, storage bucket `ai-knowledge`, and **Google Gemini** (recommended) or OpenAI/Ollama for chat & embeddings.

## Manual setup

1. Run migration: `supabase/migrations/004_ai_knowledge.sql` in the Supabase SQL editor (after 001–003).
2. Enable **pgvector** on your Supabase project if prompted.
3. Set environment variables (see below).
4. Run **Admin → AI Knowledge → Re-index all knowledge** after publishing products.
5. Upload catalogues → **Approve & Index** when content is verified.

## Environment variables

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | **Required for Gemini** — from [Google AI Studio](https://aistudio.google.com/apikey). Alias: `GOOGLE_GENERATIVE_AI_API_KEY` |
| `AI_CHAT_PROVIDER` | `gemini` (default when key is set), `rules`, `openai`, or `ollama` |
| `AI_CHAT_MODEL` | Default `gemini-3.6-flash` |
| `EMBEDDING_PROVIDER` | `gemini` (default when key is set), `openai`, `ollama`, or `none` |
| `EMBEDDING_MODEL` | Default `text-embedding-004` (768 dims) |
| `EMBEDDING_DIMENSION` | Must match DB column (default `768`) |
| `OPENAI_API_KEY` | If using OpenAI embeddings/chat |
| `OLLAMA_BASE_URL` | Only if `AI_CHAT_PROVIDER=ollama` |
| `AI_KNOWLEDGE_ENABLED` | Set `false` to disable public chat |
| `AI_MAX_CONTEXT_CHUNKS` | Default `10` |

Existing Supabase vars still required: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.

## Upload formats

PDF, DOCX, XLSX, CSV, TXT, JSON, JPEG/PNG/WebP (images: no OCR in v1 — warning shown).

## Embedding model

Default with Gemini: **`text-embedding-004`** at 768 dimensions (matches migration `vector(768)`). OpenAI/Ollama require matching `EMBEDDING_DIMENSION`.

## APIs

**Admin (session required)**

- `POST /api/admin/ai-knowledge/upload`
- `POST /api/admin/ai-knowledge/process`
- `GET /api/admin/ai-knowledge` · `?stats=1`
- `GET/PATCH/DELETE /api/admin/ai-knowledge/[id]`
- `POST /api/admin/ai-knowledge/[id]/reindex` (body `{ productId }` for products)
- `POST /api/admin/ai-knowledge/reindex-all`
- `GET /api/admin/ai-knowledge/chunks`
- `POST /api/admin/ai-chat/test` (debug pipeline)

**Public**

- `POST /api/ai-chat`
- `POST /api/ai-chat/compare`
- `POST /api/ai-chat/recommend`
- `POST /api/ai-chat/dealer-search`

## Source priority

1. Structured `products` / categories  
2. Published `ai_faqs`  
3. Published `ai_company_knowledge`  
4. Vector chunks (approved/enabled)  
5. Gemini (or other LLM) phrasing only when `AI_CHAT_PROVIDER` is `gemini` / `openai` / `ollama` and context is retrieved

## Not included yet

- Langfuse (not in repo)
- Image OCR (Tesseract/cloud)
- Streaming chat responses
- Automatic PDF → product row creation (extracted text is chunked; products remain in Admin → Products)
