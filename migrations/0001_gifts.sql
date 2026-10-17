CREATE TABLE IF NOT EXISTS contributions (
  id TEXT PRIMARY KEY,
  gift_id TEXT NOT NULL CHECK (gift_id IN ('hotel','rail','flights','restaurants','onsen','pokemon','together')),
  amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
  coverage TEXT NOT NULL CHECK (coverage IN ('partial','full')),
  guest_name TEXT NOT NULL DEFAULT '' CHECK (length(guest_name) <= 100),
  message TEXT NOT NULL DEFAULT '' CHECK (length(message) <= 1000),
  sender_hash TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX IF NOT EXISTS contributions_gift ON contributions(gift_id);
CREATE INDEX IF NOT EXISTS contributions_rate ON contributions(sender_hash, created_at);
