-- SmartGarden : base de données Supabase
-- À coller dans Supabase > SQL Editor > New query, puis « Run ».

-- 1. Réglages de chaque agriculteur (une ligne par compte)
create table if not exists public.profils (
  user_id uuid primary key references auth.users on delete cascade,
  reglages jsonb not null default '{}'::jsonb,
  maj timestamptz not null default now()
);

-- 2. Parcelles et plantations (le contenu détaillé est dans « data »)
create table if not exists public.parcelles (
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  id text not null,
  data jsonb not null,
  maj timestamptz not null default now(),
  primary key (user_id, id)
);
create table if not exists public.plantations (
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  id text not null,
  data jsonb not null,
  maj timestamptz not null default now(),
  primary key (user_id, id)
);

-- 3. Archives partagées : climat, carburant, El Niño, mercuriales (lecture publique)
create table if not exists public.archives (
  cle text primary key,
  contenu jsonb not null,
  maj timestamptz not null default now()
);

-- 4. Sécurité : chacun ne voit et ne modifie que ses propres lignes
alter table public.profils enable row level security;
alter table public.parcelles enable row level security;
alter table public.plantations enable row level security;
alter table public.archives enable row level security;

drop policy if exists "profil perso" on public.profils;
create policy "profil perso" on public.profils for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "parcelles perso" on public.parcelles;
create policy "parcelles perso" on public.parcelles for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "plantations perso" on public.plantations;
create policy "plantations perso" on public.plantations for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "archives lisibles" on public.archives;
create policy "archives lisibles" on public.archives for select to anon, authenticated using (true);
-- Pas de règle d'écriture : seules la tâche planifiée (clé serveur) et l'éditeur SQL peuvent modifier les archives.

-- 5. Résultats anonymes : écart moyen entre récolte réelle et prévision, par culture,
--    seulement quand au moins 3 récoltes existent (aucune identité, aucune position).
create or replace function public.resultats_anonymes()
returns table (culture text, recoltes bigint, ratio_reel_prevu numeric)
language sql security definer set search_path = public as $$
  select data->>'culture',
         count(*),
         round(avg((data->>'recolteKg')::numeric / nullif((data->>'surface')::numeric, 0) / nullif((data->>'predRdt')::numeric, 0)), 3)
  from public.plantations
  where (data->>'recolteKg') is not null and (data->>'predRdt') is not null
  group by 1
  having count(*) >= 3;
$$;
revoke all on function public.resultats_anonymes() from public;
grant execute on function public.resultats_anonymes() to anon, authenticated;
