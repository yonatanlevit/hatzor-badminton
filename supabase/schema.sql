-- Profiles (extends auth.users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  email text unique not null,
  phone text not null,
  role text not null check (role in ('player', 'coach', 'admin')) default 'player',
  push_token text,
  created_at timestamptz default now()
);

-- Training sessions (each row = one session on a specific date)
create table training_sessions (
  id uuid primary key default gen_random_uuid(),
  session_date date not null,
  day_of_week int generated always as (extract(dow from session_date)) stored,
  start_time time not null,
  end_time time not null,
  location text,
  training_type text,
  description text,
  notes text, -- special notes like "bring extra shoes"
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);

-- Announcements
create table announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);

-- RLS policies
alter table profiles enable row level security;
alter table training_sessions enable row level security;
alter table announcements enable row level security;

-- Profiles: everyone reads own, coaches read all, coaches write all
create policy "Users read own profile" on profiles for select using (auth.uid() = id);
create policy "Coaches read all profiles" on profiles for select using (
  exists (select 1 from profiles where id = auth.uid() and role in ('coach', 'admin'))
);
create policy "Coaches manage profiles" on profiles for all using (
  exists (select 1 from profiles where id = auth.uid() and role in ('coach', 'admin'))
);

-- Training sessions: everyone reads, coaches write
create policy "Everyone reads sessions" on training_sessions for select using (true);
create policy "Coaches manage sessions" on training_sessions for all using (
  exists (select 1 from profiles where id = auth.uid() and role in ('coach', 'admin'))
);

-- Announcements: everyone reads, coaches write
create policy "Everyone reads announcements" on announcements for select using (true);
create policy "Coaches manage announcements" on announcements for all using (
  exists (select 1 from profiles where id = auth.uid() and role in ('coach', 'admin'))
);

-- Conversation logs (coach-only journal for face-to-face conversations)
create table conversation_logs (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references profiles(id) on delete cascade not null,
  coach_id uuid references profiles(id) not null,
  conversation_date date not null default current_date,
  summary text not null,
  created_at timestamptz default now()
);

alter table conversation_logs enable row level security;
create policy "Players read own conversation logs" on conversation_logs
  for select using (auth.uid() = player_id);
create policy "Coaches read all conversation logs" on conversation_logs
  for select using (is_coach());
create policy "Coaches manage conversation logs" on conversation_logs
  for insert with check (is_coach());
create policy "Coaches delete conversation logs" on conversation_logs
  for delete using (is_coach());

-- Goals
create table goals (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references profiles(id) on delete cascade not null,
  created_by uuid references profiles(id) not null,
  title text not null,
  description text,
  status text not null check (status in ('active', 'completed', 'cancelled')) default 'active',
  target_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table goals enable row level security;
create policy "Players read own goals" on goals for select using (auth.uid() = player_id);
create policy "Coaches read all goals" on goals for select using (is_coach());
create policy "Players manage own goals" on goals for all using (auth.uid() = player_id);
create policy "Coaches manage all goals" on goals for all using (is_coach());
