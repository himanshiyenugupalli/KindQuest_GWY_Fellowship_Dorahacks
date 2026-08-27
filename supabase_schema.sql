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
  date text not null,
  volunteer_id uuid references public.profiles(id) on delete set null,
  organization_id uuid references public.profiles(id) on delete set null
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

-- Drop all old broad policies if re-applying
drop policy if exists "Public profiles read" on public.profiles;
drop policy if exists "Users manage profile" on public.profiles;
drop policy if exists "Public volunteer_profiles read" on public.volunteer_profiles;
drop policy if exists "Volunteers update profile" on public.volunteer_profiles;
drop policy if exists "Public organization_profiles read" on public.organization_profiles;
drop policy if exists "Org manage profile" on public.organization_profiles;
drop policy if exists "User adventure session" on public.adventure_sessions;
drop policy if exists "Public opportunities read" on public.opportunities;
drop policy if exists "Org manage opportunities" on public.opportunities;
drop policy if exists "Public applications read" on public.opportunity_applications;
drop policy if exists "Volunteers manage applications" on public.opportunity_applications;
drop policy if exists "Saved opportunities policy" on public.saved_opportunities;
drop policy if exists "Public badges read" on public.badges;
drop policy if exists "User badges policy" on public.user_badges;
drop policy if exists "Public certificates read" on public.certificates;
drop policy if exists "Public ratings read" on public.organization_ratings;
drop policy if exists "Public chain read" on public.chain_of_kindness;
drop policy if exists "Public professionals read" on public.professionals;
drop policy if exists "Public payment records read" on public.payment_records;
drop policy if exists "User notifications policy" on public.notifications;

-- 1. PROFILES POLICIES
create policy "Public profiles read" on public.profiles
  for select using (true);

create policy "Users insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users update own profile" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- 2. VOLUNTEER PROFILES POLICIES
create policy "Public volunteer_profiles read" on public.volunteer_profiles
  for select using (true);

create policy "Volunteers insert own profile" on public.volunteer_profiles
  for insert with check (auth.uid() = id);

create policy "Volunteers update own profile" on public.volunteer_profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- 3. ORGANIZATION PROFILES POLICIES
create policy "Public organization_profiles read" on public.organization_profiles
  for select using (true);

create policy "Org insert own profile" on public.organization_profiles
  for insert with check (auth.uid() = id);

create policy "Org update own profile" on public.organization_profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- 4. ADVENTURE SESSIONS POLICIES
create policy "User select own adventure session" on public.adventure_sessions
  for select using (auth.uid() = user_id);

create policy "User insert own adventure session" on public.adventure_sessions
  for insert with check (auth.uid() = user_id);

create policy "User update own adventure session" on public.adventure_sessions
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 5. OPPORTUNITIES POLICIES
create policy "Public opportunities select" on public.opportunities
  for select using (true);

create policy "Org insert opportunity" on public.opportunities
  for insert with check (
    exists (
      select 1 from public.organization_profiles
      where id = auth.uid() and org_id = opportunities.organization_id
    )
  );

create policy "Org update opportunity" on public.opportunities
  for update using (
    exists (
      select 1 from public.organization_profiles
      where id = auth.uid() and org_id = opportunities.organization_id
    )
  ) with check (
    exists (
      select 1 from public.organization_profiles
      where id = auth.uid() and org_id = opportunities.organization_id
    )
  );

create policy "Org delete opportunity" on public.opportunities
  for delete using (
    exists (
      select 1 from public.organization_profiles
      where id = auth.uid() and org_id = opportunities.organization_id
    )
  );

-- 6. OPPORTUNITY APPLICATIONS POLICIES
create policy "Users select applications" on public.opportunity_applications
  for select using (
    auth.uid() = volunteer_id or
    exists (
      select 1 from public.opportunities o
      join public.organization_profiles op on op.org_id = o.organization_id
      where o.id = opportunity_applications.opportunity_id and op.id = auth.uid()
    )
  );

create policy "Volunteers insert application" on public.opportunity_applications
  for insert with check (
    auth.uid() = volunteer_id and
    status = 'Requested' and
    points_awarded = 0
  );

create policy "Org update application status" on public.opportunity_applications
  for update using (
    exists (
      select 1 from public.opportunities o
      join public.organization_profiles op on op.org_id = o.organization_id
      where o.id = opportunity_applications.opportunity_id and op.id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.opportunities o
      join public.organization_profiles op on op.org_id = o.organization_id
      where o.id = opportunity_applications.opportunity_id and op.id = auth.uid()
    )
  );

-- 7. SAVED OPPORTUNITIES POLICIES
create policy "User select saved opportunities" on public.saved_opportunities
  for select using (auth.uid() = user_id);

create policy "User insert saved opportunities" on public.saved_opportunities
  for insert with check (auth.uid() = user_id);

create policy "User delete saved opportunities" on public.saved_opportunities
  for delete using (auth.uid() = user_id);

-- 8. BADGES POLICIES
create policy "Public badges read" on public.badges
  for select using (true);

-- 9. USER BADGES POLICIES (No direct insert for users with true; only select own or service role inserts)
create policy "User select own badges" on public.user_badges
  for select using (auth.uid() = user_id);

-- 10. CERTIFICATES POLICIES
create policy "Public certificates select" on public.certificates
  for select using (true);

create policy "Org insert certificates" on public.certificates
  for insert with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'organization'
    )
  );

-- 11. ORGANIZATION RATINGS POLICIES
create policy "Public ratings select" on public.organization_ratings
  for select using (true);

create policy "Org insert ratings" on public.organization_ratings
  for insert with check (
    exists (
      select 1 from public.organization_profiles
      where id = auth.uid() and org_id = organization_ratings.organization_id
    )
  );

-- 12. CHAIN OF KINDNESS POLICIES
create policy "Public chain select" on public.chain_of_kindness
  for select using (true);

create policy "Authenticated insert chain" on public.chain_of_kindness
  for insert with check (auth.role() = 'authenticated');

-- 13. PROFESSIONALS DIRECTORY POLICIES (Requires authentication)
create policy "Authenticated professionals select" on public.professionals
  for select using (auth.role() = 'authenticated');

-- 14. PAYMENT RECORDS POLICIES (Restricted to involved parties)
create policy "Involved parties payment select" on public.payment_records
  for select using (
    auth.uid() = volunteer_id or auth.uid() = organization_id
  );

-- 15. NOTIFICATIONS POLICIES
create policy "User select own notifications" on public.notifications
  for select using (auth.uid() = user_id);

create policy "User update own notifications" on public.notifications
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
