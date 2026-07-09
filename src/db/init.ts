import { db } from "@/db";
import { sql } from "drizzle-orm";

/**
 * Ensures the application tables exist. Runs lazily on the first request that
 * touches the database, so the app is resilient to a freshly-bootstrapped
 * database without needing a manual migration. Memoised so it only runs once
 * per server process.
 *
 * The ALTER statements make this idempotent against an already-existing
 * schema (e.g. an older deployment that pre-dates the parent_id column).
 */
const CREATE_MESSAGES = sql`
  CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(140) NOT NULL,
    email VARCHAR(220) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`;

const CREATE_COMMENTS = sql`
  CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(160) NOT NULL,
    name VARCHAR(80) NOT NULL,
    body TEXT NOT NULL,
    parent_id INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`;

const CREATE_COMMENTS_INDEX = sql`
  CREATE INDEX IF NOT EXISTS comments_slug_idx ON comments (slug)
`;

// Migration for pre-existing deployments that created comments without parent_id.
const ADD_PARENT_COLUMN = sql`
  ALTER TABLE comments ADD COLUMN IF NOT EXISTS parent_id INTEGER
`;

async function run(): Promise<void> {
  await db.execute(CREATE_MESSAGES);
  await db.execute(CREATE_COMMENTS);
  await db.execute(CREATE_COMMENTS_INDEX);
  await db.execute(ADD_PARENT_COLUMN);
}

let memo: Promise<void> | null = null;

export function ensureSchema(): Promise<void> {
  if (!memo) {
    memo = run().catch((err) => {
      memo = null; // allow a later request to retry
      console.error("[ensureSchema] failed:", err);
      throw err;
    });
  }
  return memo;
}
