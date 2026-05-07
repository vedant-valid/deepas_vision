-- Charts: one row per generated Kundli
create table if not exists charts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users on delete cascade,
  name        text,
  dob         date not null,
  tob         time not null,
  place       text not null,
  latitude    float not null,
  longitude   float not null,
  timezone    text not null,
  kundli_data jsonb not null,
  created_at  timestamptz default now()
);

-- Interpretations: one per (chart, topic), cached after first Claude call
create table if not exists interpretations (
  id         uuid primary key default gen_random_uuid(),
  chart_id   uuid references charts on delete cascade,
  topic      text not null,
  content    text not null,
  model      text not null,
  created_at timestamptz default now(),
  unique (chart_id, topic)
);

-- Row Level Security
alter table charts enable row level security;
alter table interpretations enable row level security;

create policy "users_own_charts"
  on charts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users_own_interpretations"
  on interpretations for all
  using (
    chart_id in (
      select id from charts where user_id = auth.uid()
    )
  );
