-- AI Knowledge & chatbot RAG (pgvector) — run after 001–003

create extension if not exists vector with schema extensions;

-- ---------------------------------------------------------------------------
-- Storage bucket for knowledge uploads
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'ai-knowledge',
  'ai-knowledge',
  false,
  52428800,
  array[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
    'text/plain',
    'application/json',
    'image/jpeg',
    'image/png',
    'image/webp'
  ]
)
on conflict (id) do update set
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "staff read ai knowledge files"
  on storage.objects for select
  using (bucket_id = 'ai-knowledge' and public.is_staff());

create policy "staff upload ai knowledge files"
  on storage.objects for insert
  with check (bucket_id = 'ai-knowledge' and public.is_staff());

create policy "staff update ai knowledge files"
  on storage.objects for update
  using (bucket_id = 'ai-knowledge' and public.is_staff());

create policy "staff delete ai knowledge files"
  on storage.objects for delete
  using (bucket_id = 'ai-knowledge' and public.is_staff());

-- ---------------------------------------------------------------------------
-- Documents & jobs
-- ---------------------------------------------------------------------------
create type public.ai_job_status as enum (
  'UPLOADED',
  'PROCESSING',
  'EXTRACTING',
  'STRUCTURING',
  'CHUNKING',
  'EMBEDDING',
  'INDEXING',
  'COMPLETED',
  'FAILED'
);

create table if not exists public.ai_knowledge_documents (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  file_type text not null,
  file_size_bytes bigint not null default 0,
  storage_bucket text not null default 'ai-knowledge',
  storage_path text not null,
  status public.ai_job_status not null default 'UPLOADED',
  is_enabled boolean not null default true,
  is_approved boolean not null default false,
  extracted_text text,
  structured_data jsonb not null default '{}'::jsonb,
  record_count int not null default 0,
  chunk_count int not null default 0,
  embedding_count int not null default 0,
  warnings jsonb not null default '[]'::jsonb,
  error_message text,
  uploaded_by uuid references auth.users (id) on delete set null,
  uploaded_by_email text,
  last_indexed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_processing_jobs (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references public.ai_knowledge_documents (id) on delete cascade,
  product_id uuid references public.products (id) on delete cascade,
  job_type text not null check (job_type in ('document', 'product', 'category', 'full_reindex', 'dealer')),
  status public.ai_job_status not null default 'UPLOADED',
  progress_pct int not null default 0 check (progress_pct >= 0 and progress_pct <= 100),
  message text,
  meta jsonb not null default '{}'::jsonb,
  error_message text,
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Structured knowledge overlays (approved extractions — nullable fields only)
-- ---------------------------------------------------------------------------
create table if not exists public.ai_product_knowledge (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products (id) on delete cascade,
  document_id uuid references public.ai_knowledge_documents (id) on delete set null,
  slug text,
  sku text,
  data jsonb not null default '{}'::jsonb,
  is_enabled boolean not null default true,
  is_approved boolean not null default false,
  source_priority int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id)
);

create table if not exists public.ai_category_knowledge (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories (id) on delete cascade,
  document_id uuid references public.ai_knowledge_documents (id) on delete set null,
  data jsonb not null default '{}'::jsonb,
  is_enabled boolean not null default true,
  is_approved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (category_id)
);

create table if not exists public.ai_company_knowledge (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique,
  title text not null,
  body text,
  data jsonb not null default '{}'::jsonb,
  language text not null default 'en',
  is_published boolean not null default false,
  sort_order int not null default 0,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.ai_faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text,
  related_product_ids uuid[] default '{}',
  priority int not null default 0,
  is_published boolean not null default false,
  language text not null default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Chunks & embeddings (dimension must match EMBEDDING_DIMENSION env — default 768)
-- ---------------------------------------------------------------------------
create table if not exists public.ai_knowledge_chunks (
  id uuid primary key default gen_random_uuid(),
  chunk_id text not null unique,
  document_id uuid references public.ai_knowledge_documents (id) on delete cascade,
  product_id uuid references public.products (id) on delete cascade,
  category_id uuid references public.categories (id) on delete cascade,
  faq_id uuid references public.ai_faqs (id) on delete cascade,
  company_section_id uuid references public.ai_company_knowledge (id) on delete cascade,
  content text not null,
  content_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  embedding extensions.vector(768),
  embedding_id text,
  is_enabled boolean not null default true,
  language text not null default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ai_chunks_document_idx on public.ai_knowledge_chunks (document_id);
create index if not exists ai_chunks_product_idx on public.ai_knowledge_chunks (product_id);
create index if not exists ai_chunks_category_idx on public.ai_knowledge_chunks (category_id);
create index if not exists ai_chunks_content_type_idx on public.ai_knowledge_chunks (content_type);
create index if not exists ai_chunks_enabled_idx on public.ai_knowledge_chunks (is_enabled) where is_enabled = true;

create index if not exists ai_chunks_embedding_hnsw
  on public.ai_knowledge_chunks
  using hnsw (embedding vector_cosine_ops)
  where embedding is not null and is_enabled = true;

-- ---------------------------------------------------------------------------
-- Chat observability (no PII beyond optional city)
-- ---------------------------------------------------------------------------
create table if not exists public.ai_chat_logs (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null,
  user_question text not null,
  detected_intent text,
  filters jsonb,
  retrieved_product_ids uuid[],
  retrieved_chunk_ids uuid[],
  retrieval_score double precision,
  response_time_ms int,
  model text,
  answer_source text,
  fallback_used boolean not null default false,
  answer_preview text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Similarity search (service role / server only)
-- ---------------------------------------------------------------------------
create or replace function public.match_ai_knowledge_chunks(
  query_embedding extensions.vector(768),
  match_count int default 12,
  filter_product_id uuid default null,
  filter_category_id uuid default null,
  filter_source_type text default null
)
returns table (
  id uuid,
  content text,
  content_type text,
  metadata jsonb,
  product_id uuid,
  category_id uuid,
  similarity double precision
)
language sql
stable
as $$
  select
    c.id,
    c.content,
    c.content_type,
    c.metadata,
    c.product_id,
    c.category_id,
    1 - (c.embedding <=> query_embedding) as similarity
  from public.ai_knowledge_chunks c
  where c.is_enabled = true
    and c.embedding is not null
    and (filter_product_id is null or c.product_id = filter_product_id)
    and (filter_category_id is null or c.category_id = filter_category_id)
    and (filter_source_type is null or c.metadata->>'source_type' = filter_source_type)
  order by c.embedding <=> query_embedding
  limit match_count;
$$;

-- ---------------------------------------------------------------------------
-- RLS: staff manage; public chat uses service role APIs only
-- ---------------------------------------------------------------------------
alter table public.ai_knowledge_documents enable row level security;
alter table public.ai_processing_jobs enable row level security;
alter table public.ai_product_knowledge enable row level security;
alter table public.ai_category_knowledge enable row level security;
alter table public.ai_company_knowledge enable row level security;
alter table public.ai_faqs enable row level security;
alter table public.ai_knowledge_chunks enable row level security;
alter table public.ai_chat_logs enable row level security;

create policy "staff manage ai_knowledge_documents"
  on public.ai_knowledge_documents for all
  using (public.is_staff()) with check (public.is_staff());

create policy "staff manage ai_processing_jobs"
  on public.ai_processing_jobs for all
  using (public.is_staff()) with check (public.is_staff());

create policy "staff manage ai_product_knowledge"
  on public.ai_product_knowledge for all
  using (public.is_staff()) with check (public.is_staff());

create policy "staff manage ai_category_knowledge"
  on public.ai_category_knowledge for all
  using (public.is_staff()) with check (public.is_staff());

create policy "staff manage ai_company_knowledge"
  on public.ai_company_knowledge for all
  using (public.is_staff()) with check (public.is_staff());

create policy "staff manage ai_faqs"
  on public.ai_faqs for all
  using (public.is_staff()) with check (public.is_staff());

create policy "staff manage ai_knowledge_chunks"
  on public.ai_knowledge_chunks for all
  using (public.is_staff()) with check (public.is_staff());

create policy "staff read ai_chat_logs"
  on public.ai_chat_logs for select
  using (public.is_staff());

create policy "public read published company knowledge"
  on public.ai_company_knowledge for select
  using (is_published = true);

create policy "public read published faqs"
  on public.ai_faqs for select
  using (is_published = true);
