# Supabase Setup (Vercel)

This app uses Supabase (Postgres) when the environment variables are set. If they are missing, it falls back to local demo data so the UI still works.

## 1) Create tables

Run in Supabase SQL Editor:

```sql
create table if not exists public.infrastructure_assets (
  id uuid primary key default gen_random_uuid(),
  name text,
  asset_type text,
  region text,
  municipality text,
  latitude double precision,
  longitude double precision,
  time_horizon text,
  overall_risk_score numeric,
  climate_risks jsonb,
  population_served numeric,
  equity_score numeric,
  created_at timestamptz default now()
);

create table if not exists public.investment_projects (
  id uuid primary key default gen_random_uuid(),
  title text,
  description text,
  asset_id uuid references public.infrastructure_assets(id) on delete set null,
  status text default 'proposed',
  cost numeric,
  risk_reduction_impact numeric,
  population_benefit numeric,
  equity_score numeric,
  cost_benefit_ratio numeric,
  priority_rank numeric,
  created_at timestamptz default now()
);

create index if not exists idx_assets_time_horizon on public.infrastructure_assets(time_horizon);
create index if not exists idx_projects_status on public.investment_projects(status);
```

## 2) Enable RLS + policies (demo mode)

Turn **RLS ON** for both tables, then run:

```sql
create policy "public read assets"
on public.infrastructure_assets for select
using (true);

create policy "public read projects"
on public.investment_projects for select
using (true);

create policy "public write projects"
on public.investment_projects for insert
with check (true);

create policy "public update projects"
on public.investment_projects for update
using (true);
```

> For production, tighten these policies and require authentication.

## 3) Vercel environment variables

Add these in Vercel → Project Settings → Environment Variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 4) Seed (optional)

```sql
insert into public.infrastructure_assets
(name, asset_type, region, municipality, latitude, longitude, time_horizon, overall_risk_score, climate_risks, population_served, equity_score)
values
('North Substation A', 'Electrical Substation', 'Ontario', 'Brampton', 43.7315, -79.7624, 'immediate', 72, '{"wildfire_risk": 12, "flood_risk": 65, "heat_risk": 54, "storm_risk": 78}'::jsonb, 125000, 0.62);
```
