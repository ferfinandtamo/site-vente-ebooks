-- ########################################################
-- # EBOOKSTORE PREMIUM - SAAS CORE SCHEMA
-- ########################################################

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. ENUMS
create type user_role as enum ('admin', 'author', 'customer');
create type subscription_status as enum ('active', 'inactive', 'past_due');

-- 3. PROFILES (Extends Auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  role user_role default 'customer',
  career_goal text,
  current_level text, -- Beginner, Intermediate, Expert
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. AUTHORS
create table public.authors (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  bio text,
  avatar_url text,
  website text,
  user_id uuid references public.profiles(id) -- Optional: link to a registered user
);

-- 5. CATEGORIES
create table public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  description text,
  icon text -- Emoji or SVG path
);

-- 6. EBOOKS
create table public.ebooks (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  author_id uuid references public.authors(id),
  category_id uuid references public.categories(id),
  price decimal(10,2) not null,
  cover_url text,
  file_url text, -- Secure Storage URL
  is_premium boolean default false, -- Included in subscription?
  fts tsvector generated always as (to_tsvector('french', title || ' ' || description)) stored,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. USER LIBRARY & PROGRESS
create table public.user_library (
  user_id uuid references public.profiles(id) on delete cascade,
  ebook_id uuid references public.ebooks(id) on delete cascade,
  purchased_at timestamp with time zone default now(),
  primary key (user_id, ebook_id)
);

create table public.reading_progress (
  user_id uuid references public.profiles(id) on delete cascade,
  ebook_id uuid references public.ebooks(id) on delete cascade,
  current_page int default 1,
  notes jsonb, -- [{page: 1, text: '...', color: 'yellow'}]
  last_read_at timestamp with time zone default now(),
  primary key (user_id, ebook_id)
);

-- 8. SUBSCRIPTIONS
create table public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  status subscription_status default 'inactive',
  plan_type text, -- 'Standard', 'Ultra'
  current_period_end timestamp with time zone
);

-- 9. COMMUNITY
create table public.comments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  ebook_id uuid references public.ebooks(id) on delete cascade,
  content text not null,
  rating int check (rating >= 1 and rating <= 5),
  created_at timestamp with time zone default now()
);

-- 10. ROW LEVEL SECURITY (RLS)
alter table public.profiles enable row level security;
alter table public.ebooks enable row level security;
alter table public.user_library enable row level security;

-- Policies
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);
create policy "Ebooks are viewable by everyone." on public.ebooks for select using (true);
create policy "User can view their own library." on public.user_library for select using (auth.uid() = user_id);
