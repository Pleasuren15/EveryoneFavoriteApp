-- EveryoneFavoriteApp - PostgreSQL Schema
-- PascalCase naming, singular table names
create extension if not exists "pgcrypto";
create table "User" (
  "Id"           uuid primary key default gen_random_uuid(),
  "Email"        varchar(255) not null unique,
  "PasswordHash" varchar(255) not null,
  "DisplayName"  varchar(100) not null,
  "CreatedAt"    timestamptz not null default now()
);
create table "Category" (
  "Id"        uuid primary key default gen_random_uuid(),
  "Name"      varchar(50) not null unique,
  "Label"     varchar(50) not null,
  "SortOrder" int not null default 0
);
create table "Todo" (
  "Id"         uuid primary key default gen_random_uuid(),
  "UserId"      uuid not null references "User"("Id") on delete cascade,
  "CategoryId" uuid not null references "Category"("Id") on delete restrict,
  "Text"       text not null,
  "Completed"  boolean not null default false,
  "CreatedAt"  timestamptz not null default now(),
  "DueDate"    date,
  "Price"      decimal(10,2),
  "ContactId"  text,
  "ContactName" text
);
create index "Idx_Todo_UserId" on "Todo"("UserId");
create index "Idx_Todo_CategoryId" on "Todo"("CategoryId");
create index "Idx_Todo_CreatedAt" on "Todo"("CreatedAt");
create index "Idx_Todo_Active" on "Todo"("Completed") where "Completed" = false;
create index "Idx_Todo_DueDate" on "Todo"("DueDate") where "DueDate" is not null;
create table "Subtask" (
  "Id"        uuid primary key default gen_random_uuid(),
  "TodoId"    uuid not null references "Todo"("Id") on delete cascade,
  "Text"      text not null,
  "Completed" boolean not null default false,
  "SortOrder" int not null default 0
);
create index "Idx_Subtask_TodoId" on "Subtask"("TodoId");
create table "BudgetEntry" (
  "Id"          uuid primary key default gen_random_uuid(),
  "UserId"      uuid not null references "User"("Id") on delete cascade,
  "Type"        varchar(10) not null check ("Type" in ('income', 'expense')),
  "Category"    varchar(100) not null,
  "Amount"      decimal(12,2) not null check ("Amount" >= 0),
  "Description" text not null default '',
  "Date"        date not null,
  "CreatedAt"   timestamptz not null default now()
);
create index "Idx_BudgetEntry_UserId" on "BudgetEntry"("UserId");
create index "Idx_BudgetEntry_Type" on "BudgetEntry"("Type");
create index "Idx_BudgetEntry_Date" on "BudgetEntry"("Date");
insert into "Category" ("Name", "Label", "SortOrder") values
  ('Todo',     'Todo',     1),
  ('Shopping', 'Shopping', 2),
  ('Personal', 'Personal', 3),
  ('Work',     'Work',     4),
  ('Others',   'Others',   5),
  ('Birthday',  'Birthday', 6);
