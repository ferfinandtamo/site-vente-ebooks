-- ########################################################
-- # AURA INTELLIGENCE - INFRASTRUCTURE CORE
-- ########################################################

-- 1. ENABLE EXTENSIONS
create extension if not exists vector;

-- 2. SEMANTIC MEMORY TABLE
-- Stores fragmented facts, user goals, and conversation summaries as embeddings
create table if not exists public.aura_memory (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid, -- Simplified for demo (no strict foreign key)
  content text not null,
  embedding vector(1536), -- Designed for OpenAI text-embedding-3-small
  metadata jsonb default '{}'::jsonb, -- {type: 'interest', 'goal', 'history_summary'}
  created_at timestamp with time zone default now()
);

-- Index for high-performance semantic search
create index on public.aura_memory using ivfflat (embedding vector_cosine_ops)
with (lists = 100);

-- 3. FEEDBACK LOOP TABLE
-- Stores user ratings to allow for RLHF (Reinforcement Learning from Human Feedback) style improvements
create table if not exists public.aura_feedback (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid, -- Simplified for demo
  query text not null,
  response text not null,
  rating int check (rating >= 1 and rating <= 5),
  tags text[], -- ['too_long', 'accurate', 'funny']
  created_at timestamp with time zone default now()
);

-- 4. RLS POLICIES
alter table public.aura_memory enable row level security;
alter table public.aura_feedback enable row level security;

create policy "Users can view their own memory." on public.aura_memory for select using (
  (auth.uid() = user_id) OR (user_id = '00000000-0000-0000-0000-000000000000')
);
create policy "Users can insert their own feedback." on public.aura_feedback for insert with check (
  (auth.uid() = user_id) OR (user_id = '00000000-0000-0000-0000-000000000000')
);

-- 5. FUNCTION FOR SEMANTIC SEARCH
-- Used by the backend to retrieve the most relevant context for Aura
create or replace function match_aura_memory (
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  p_user_id uuid
)
returns table (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    aura_memory.id,
    aura_memory.content,
    aura_memory.metadata,
    1 - (aura_memory.embedding <=> query_embedding) as similarity
  from aura_memory
  where aura_memory.user_id = p_user_id
    and 1 - (aura_memory.embedding <=> query_embedding) > match_threshold
  order by aura_memory.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- 6. INDEXATION DES EBOOKS EXISTANTS
-- On ajoute la colonne vecteur à la table ebooks existante
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name='ebooks' and column_name='embedding') then
    alter table public.ebooks add column embedding vector(1536);
  end if;
end $$;

-- Index pour la recherche sémantique des livres
create index if not exists ebooks_embedding_idx on public.ebooks using ivfflat (embedding vector_cosine_ops)
with (lists = 100);

-- 7. FUNCTION FOR EBOOK SEMANTIC SEARCH
-- Allows Aura to find the most relevant books for a query
create or replace function match_ebooks (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  title text,
  description text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    ebooks.id,
    ebooks.title,
    ebooks.description,
    1 - (ebooks.embedding <=> query_embedding) as similarity
  from ebooks
  where 1 - (ebooks.embedding <=> query_embedding) > match_threshold
  order by ebooks.embedding <=> query_embedding
  limit match_count;
end;
$$;
