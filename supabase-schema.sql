-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard)
-- 1. Create a new project at supabase.com (free tier)
-- 2. Go to SQL Editor and paste this entire file
-- 3. Click "Run"

-- ============================================
-- REPORTS TABLE
-- ============================================
create table if not exists reports (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  photo_url text,
  latitude double precision not null,
  longitude double precision not null,
  address text not null default '',
  severity text not null check (severity in ('Minor', 'Moderate', 'Major')),
  description text default '',
  status text not null default 'Reported' check (status in ('Reported', 'Assigned', 'In Progress', 'Swept')),
  neighborhood text default '',
  reporter_name text default 'Anonymous'
);

-- Index for map queries (lat/lng bounding box)
create index if not exists idx_reports_coords on reports (latitude, longitude);
-- Index for status filtering
create index if not exists idx_reports_status on reports (status);
-- Index for ordering by newest
create index if not exists idx_reports_created on reports (created_at desc);

-- ============================================
-- STORAGE BUCKET FOR PHOTOS
-- ============================================
insert into storage.buckets (id, name, public)
values ('report-photos', 'report-photos', true)
on conflict (id) do nothing;

-- Allow anyone to upload photos (for the citizen app)
create policy "Anyone can upload photos"
  on storage.objects for insert
  with check (bucket_id = 'report-photos');

-- Allow anyone to view photos
create policy "Anyone can view photos"
  on storage.objects for select
  using (bucket_id = 'report-photos');

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table reports enable row level security;

-- Anyone can read reports (public dashboard)
create policy "Public read access" on reports
  for select using (true);

-- Anyone can insert reports (citizen reporting)
create policy "Public insert access" on reports
  for insert with check (true);

-- ============================================
-- DASHBOARD STATS VIEW
-- ============================================
create or replace view dashboard_stats as
select
  count(*) as total_reports,
  count(*) filter (where status = 'Swept') as resolved_reports,
  count(*) filter (where status = 'Reported') as pending_reports,
  count(*) filter (where status = 'In Progress') as in_progress_reports,
  count(*) filter (where status = 'Assigned') as assigned_reports,
  count(*) filter (where severity = 'Major') as major_reports,
  count(*) filter (where severity = 'Moderate') as moderate_reports,
  count(*) filter (where severity = 'Minor') as minor_reports,
  count(*) filter (where created_at > now() - interval '24 hours') as reports_today,
  count(*) filter (where created_at > now() - interval '7 days') as reports_this_week
from reports;

-- ============================================
-- SEED DATA (Dallas locations)
-- ============================================
insert into reports (latitude, longitude, address, severity, description, status, neighborhood) values
  (32.7840, -96.7830, '2700 Main St, Dallas, TX', 'Moderate', 'Pile of trash bags behind the mural wall near the parking lot.', 'Reported', 'Deep Ellum'),
  (32.7380, -96.8260, '1300 S Beckley Ave, Dallas, TX', 'Major', 'Illegal dump site near vacant lot. Mattress, tires, and construction debris.', 'Assigned', 'Oak Cliff'),
  (32.7780, -96.7620, '3800 Parry Ave, Dallas, TX', 'Minor', 'Fast food wrappers and cups scattered along the sidewalk.', 'In Progress', 'Fair Park'),
  (32.8620, -96.8710, '10200 Harry Hines Blvd, Dallas, TX', 'Moderate', 'Overflowing dumpster with bags spilling onto the sidewalk.', 'Reported', 'Harry Hines'),
  (32.7890, -96.7980, '700 N Pearl St, Dallas, TX', 'Minor', 'Cigarette butts and coffee cups near the bus stop bench.', 'Swept', 'Arts District'),
  (32.8110, -96.7420, '4500 Columbia Ave, Dallas, TX', 'Moderate', 'Broken glass and litter along the jogging trail by White Rock Creek.', 'In Progress', 'Lakewood'),
  (32.7710, -96.7970, '1500 Marilla St, Dallas, TX', 'Major', 'Large pile of household furniture and bags dumped behind the warehouse.', 'Assigned', 'Cedars'),
  (32.8740, -96.7690, '8300 Park Ln, Dallas, TX', 'Moderate', 'Scattered trash around apartment complex dumpster area.', 'Swept', 'Vickery Meadow'),
  (32.8180, -96.7710, '600 Greenville Ave, Dallas, TX', 'Minor', 'Beer cans and paper plates left after weekend sidewalk party.', 'Swept', 'Lower Greenville'),
  (32.7870, -96.7790, '2900 Swiss Ave, Dallas, TX', 'Minor', 'Plastic bags caught in tree branches and scattered on median.', 'Reported', 'East Dallas'),
  (32.7500, -96.8100, '400 N Zang Blvd, Dallas, TX', 'Major', 'Construction debris and broken pallets dumped on vacant lot corner.', 'Reported', 'North Oak Cliff'),
  (32.7950, -96.8050, '2500 McKinney Ave, Dallas, TX', 'Minor', 'Paper cups and napkins around outdoor dining area.', 'Swept', 'Uptown'),
  (32.7650, -96.7500, '4200 Scyene Rd, Dallas, TX', 'Major', 'Tires, mattresses, and household items dumped along the road.', 'Assigned', 'Pleasant Grove'),
  (32.8300, -96.7800, '5600 E Mockingbird Ln, Dallas, TX', 'Moderate', 'Fast food bags and drink containers in parking lot.', 'In Progress', 'Mockingbird'),
  (32.7770, -96.8100, '1000 Fort Worth Ave, Dallas, TX', 'Moderate', 'Overflowing public trash cans and wind-blown litter.', 'Reported', 'West Dallas');
