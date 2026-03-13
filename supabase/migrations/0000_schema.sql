-- Profiles (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique not null,
  avatar_url text,
  level integer default 1,
  xp integer default 0,
  streak_current integer default 0,
  streak_best integer default 0,
  created_at timestamptz default now()
);

-- Sessions
create table public.sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  wpm integer not null,
  raw_wpm integer not null,
  accuracy integer not null,
  consistency integer default 0,
  errors integer default 0,
  mode text not null,
  duration integer not null,
  text_used text,
  created_at timestamptz default now()
);

-- Lesson progress
create table public.lesson_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  lesson_id text not null,
  completed boolean default false,
  best_wpm integer default 0,
  best_accuracy integer default 0,
  attempts integer default 0,
  completed_at timestamptz,
  unique(user_id, lesson_id)
);

-- Achievements
create table public.achievements (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  achievement_key text not null,
  unlocked_at timestamptz default now(),
  unique(user_id, achievement_key)
);

-- Weak keys
create table public.weak_keys (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  key_char text not null,
  error_count integer default 0,
  total_attempts integer default 0,
  updated_at timestamptz default now(),
  unique(user_id, key_char)
);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.sessions enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.achievements enable row level security;
alter table public.weak_keys enable row level security;

-- RLS policies (users can only see their own data)
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can view own sessions" on public.sessions for select using (auth.uid() = user_id);
create policy "Users can insert own sessions" on public.sessions for insert with check (auth.uid() = user_id);
create policy "Users can view own lesson progress" on public.lesson_progress for select using (auth.uid() = user_id);
create policy "Users can upsert own lesson progress" on public.lesson_progress for all using (auth.uid() = user_id);
create policy "Users can view own achievements" on public.achievements for select using (auth.uid() = user_id);
create policy "Users can insert own achievements" on public.achievements for insert with check (auth.uid() = user_id);
create policy "Users can manage own weak keys" on public.weak_keys for all using (auth.uid() = user_id);
