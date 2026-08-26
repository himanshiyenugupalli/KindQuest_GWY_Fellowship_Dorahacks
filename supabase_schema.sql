-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('volunteer', 'organization')),
  full_name text not null,
  email text not null,
  location text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Volunteer Profiles Table
create table if not exists public.volunteer_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  volunteer_id text not null unique,
  bio text,
  causes text[] default '{}',
  skills text[] default '{}',
  availability text[] default '{}',
  preferred_type text default 'Both',
  impact_points integer default 0,
  rank_id text default 'r1',
  reliability jsonb default '{"score": 100, "effort": 100, "reliability": 100, "conduct": 100}'::jsonb,
  contributions integer default 0,
  badge_ids text[] default '{}',
  joined_on text default to_char(now(), 'DD Mon YYYY')
);

-- 3. Organization Profiles Table
create table if not exists public.organization_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  org_id text not null unique,
  name text not null,
  type text default 'Nonprofit',
  description text,
  location text,
  verified boolean default true,
  contact_email text,
  website text,
  logo_url text,
  total_volunteers integer default 0,
  rating numeric default 5.0,
  active_opportunities integer default 0
);

-- 4. Adventure Sessions Table
create table if not exists public.adventure_sessions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  adventure_progress integer default 0,
  visited_destinations jsonb default '[]'::jsonb,
  completed_interactions jsonb default '[]'::jsonb,
  discovered_interests jsonb default '[]'::jsonb,
  activity_preferences jsonb default '[]'::jsonb,
  discovered_skills jsonb default '[]'::jsonb,
  volunteering_mode jsonb default '[]'::jsonb,
  availability jsonb default '[]'::jsonb,
  exploration_history jsonb default '[]'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Opportunities Table
create table if not exists public.opportunities (
  id text primary key,
  title text not null,
  description text not null,
  organization_id text not null,
  organization_name text not null,
  cause text not null,
  location text not null,
  remote boolean default false,
  skills text[] default '{}',
  availability text,
  commitment text,
  urgency text default 'normal',
  spots_left integer default 5,
  spots_total integer default 10,
  impact_points integer default 50,
  status text default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Opportunity Applications Table
create table if not exists public.opportunity_applications (
  id text primary key,
  opportunity_id text not null references public.opportunities(id) on delete cascade,
  volunteer_id uuid not null references public.profiles(id) on delete cascade,
  status text not null check (status in ('Requested', 'Accepted', 'In Progress', 'Awaiting Rating', 'Verified', 'Rejected')),
  applied_on text not null,
  completed_on text,
  points_awarded integer default 0,
  rating_id text,
  certificate_id text,
  recommendation_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Saved Opportunities Table
create table if not exists public.saved_opportunities (
  user_id uuid references public.profiles(id) on delete cascade,
  opportunity_id text references public.opportunities(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, opportunity_id)
);

-- 8. Badges Table
create table if not exists public.badges (
  id text primary key,
  title text not null,
  description text not null,
  icon text not null,
  tone text default 'primary'
);

-- 9. User Badges Table
create table if not exists public.user_badges (
  user_id uuid references public.profiles(id) on delete cascade,
  badge_id text references public.badges(id) on delete cascade,
  earned_on text not null,
  primary key (user_id, badge_id)
);

-- 10. Certificates Table
create table if not exists public.certificates (
  id text primary key,
  title text not null,
  type text not null check (type in ('organization', 'platform')),
  recipient text not null,
  recipient_id uuid references public.profiles(id) on delete set null,
  issuer text not null,
  achievement text not null,
  issued_on text not null,
  verified boolean default true
);

-- 11. Organization Ratings Table
create table if not exists public.organization_ratings (
  id text primary key,
  volunteer_id uuid references public.profiles(id) on delete cascade,
  volunteer_name text not null,
  organization_id text not null,
  organization_name text not null,
  opportunity_title text not null,
  effort integer default 5,
  reliability integer default 5,
  conduct integer default 5,
  overall integer default 5,
  comment text,
  public_testimonial text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 12. Chain of Kindness Table
create table if not exists public.chain_of_kindness (
  id text primary key,
  starter_id uuid references public.profiles(id) on delete set null,
  starter_name text not null,
  story text not null,
  cause text not null,
  points_generated integer default 0,
  members_count integer default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 13. Professionals Directory Table
create table if not exists public.professionals (
  id text primary key,
  name text not null,
  role text not null,
  organization text not null,
  email text not null,
  phone text,
  skills text[] default '{}',
  status text default 'Active'
);

-- 14. Payment Records Table
create table if not exists public.payment_records (
  id text primary key,
  organization_name text not null,
  volunteer_name text not null,
  amount numeric default 0,
  currency text default 'INR',
  purpose text not null,
  status text default 'Completed',
  date text not null
);

-- 15. Notifications Table
create table if not exists public.notifications (
  id text primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  message text not null,
  type text default 'info',
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.volunteer_profiles enable row level security;
alter table public.organization_profiles enable row level security;
alter table public.adventure_sessions enable row level security;
alter table public.opportunities enable row level security;
alter table public.opportunity_applications enable row level security;
alter table public.saved_opportunities enable row level security;
alter table public.badges enable row level security;
alter table public.user_badges enable row level security;
alter table public.certificates enable row level security;
alter table public.organization_ratings enable row level security;
alter table public.chain_of_kindness enable row level security;
alter table public.professionals enable row level security;
alter table public.payment_records enable row level security;
alter table public.notifications enable row level security;

-- Public RLS Policies
create policy "Public profiles read" on public.profiles for select using (true);
create policy "Users manage profile" on public.profiles for all using (auth.uid() = id);

create policy "Public volunteer_profiles read" on public.volunteer_profiles for select using (true);
create policy "Volunteers update profile" on public.volunteer_profiles for all using (auth.uid() = id);

create policy "Public organization_profiles read" on public.organization_profiles for select using (true);
create policy "Org manage profile" on public.organization_profiles for all using (auth.uid() = id);

create policy "User adventure session" on public.adventure_sessions for all using (auth.uid() = user_id);

create policy "Public opportunities read" on public.opportunities for select using (true);
create policy "Org manage opportunities" on public.opportunities for all using (true);

create policy "Public applications read" on public.opportunity_applications for select using (true);
create policy "Volunteers manage applications" on public.opportunity_applications for all using (true);

create policy "Saved opportunities policy" on public.saved_opportunities for all using (auth.uid() = user_id);

create policy "Public badges read" on public.badges for select using (true);
create policy "User badges policy" on public.user_badges for all using (true);

create policy "Public certificates read" on public.certificates for select using (true);
create policy "Public ratings read" on public.organization_ratings for select using (true);
create policy "Public chain read" on public.chain_of_kindness for select using (true);
create policy "Public professionals read" on public.professionals for select using (true);
create policy "Public payment records read" on public.payment_records for select using (true);
create policy "User notifications policy" on public.notifications for all using (auth.uid() = user_id);
