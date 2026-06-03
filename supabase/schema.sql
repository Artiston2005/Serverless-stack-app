-- Supabase SQL Schema structure

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- PROJECTS
create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  description text,
  status text check (status in ('pending', 'active', 'completed')) default 'pending' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.projects enable row level security;

create policy "Users can view their own projects." on projects
  for select using (auth.uid() = user_id);

create policy "Users can insert their own projects." on projects
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own projects." on projects
  for update using (auth.uid() = user_id);

create policy "Users can delete their own projects." on projects
  for delete using (auth.uid() = user_id);

-- INVOICES
create table public.invoices (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  amount numeric(10, 2) not null,
  status text check (status in ('unpaid', 'paid')) default 'unpaid' not null,
  due_date date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.invoices enable row level security;

create policy "Users can view their own invoices." on invoices
  for select using (auth.uid() = user_id);

create policy "Users can insert their own invoices." on invoices
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own invoices." on invoices
  for update using (auth.uid() = user_id);

create policy "Users can delete their own invoices." on invoices
  for delete using (auth.uid() = user_id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function after a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
