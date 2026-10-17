export const GIFT_TARGETS = Object.freeze({ hotel: 200000, rail: 80000, flights: 120000, restaurants: 20000, onsen: 10000, pokemon: null, together: null });

export function json(data, status = 200) {
  return Response.json(data, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
}

export async function getGifts(db) {
  const { results } = await db.prepare('SELECT gift_id, SUM(amount_cents) AS total FROM contributions GROUP BY gift_id').all();
  const totals = Object.fromEntries(results.map(row => [row.gift_id, row.total]));
  return Object.entries(GIFT_TARGETS).map(([id, targetCents]) => ({ id, targetCents, contributedCents: totals[id] || 0 }));
}

export async function recordContribution(request, env) {
  if (!env.GIFTS_DB) return json({ error: 'storage_unavailable' }, 503);
  const origin = request.headers.get('Origin');
  if (origin !== new URL(request.url).origin) return json({ error: 'origin_required' }, 403);
  if (!(request.headers.get('Content-Type') || '').toLowerCase().startsWith('application/json')) return json({ error: 'json_required' }, 415);
  // Read at most 8 KiB, including chunked requests without Content-Length.
  const reader = request.body?.getReader();
  if (!reader) return json({ error: 'invalid_input' }, 400);
  let length = 0;
  const chunks = [];
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > 8192) { await reader.cancel(); return json({ error: 'too_large' }, 413); }
    chunks.push(value);
  }
  let input;
  try {
    const buffer = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) { buffer.set(chunk, offset); offset += chunk.length; }
    input = JSON.parse(new TextDecoder().decode(buffer));
  } catch { return json({ error: 'invalid_input' }, 400); }
  if (!input || typeof input !== 'object' || Array.isArray(input)) return json({ error: 'invalid_input' }, 400);
  const { id, giftId, amountCents, coverage, name = '', message = '', transferred, website = '' } = input;
  if (website !== '' || !Object.hasOwn(GIFT_TARGETS, giftId) ||
      typeof id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id) ||
      !Number.isSafeInteger(amountCents) || amountCents <= 0 || transferred !== true ||
      !['partial', 'full'].includes(coverage) || typeof name !== 'string' || name.length > 100 ||
      typeof message !== 'string' || message.length > 1000) return json({ error: 'invalid_input' }, 400);
  const target = GIFT_TARGETS[giftId];
  if (target === null && coverage === 'full') return json({ error: 'invalid_input' }, 400);
  const db = env.GIFTS_DB;
  // A repeated request succeeds only for the same original payload.
  const existing = await db.prepare('SELECT gift_id, amount_cents, coverage, guest_name, message FROM contributions WHERE id = ?').bind(id).first();
  if (existing) {
    if (existing.gift_id !== giftId || existing.amount_cents !== amountCents || existing.coverage !== coverage || existing.guest_name !== name.trim() || existing.message !== message.trim()) return json({ error: 'id_conflict' }, 409);
    return json({ ok: true, duplicate: true });
  }
  // Hash the network address, never persist the address itself. Rotate via the secret.
  if (!env.GIFTS_RATE_SALT) return json({ error: 'storage_unavailable' }, 503);
  const ip = request.headers.get('CF-Connecting-IP') || 'local';
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(env.GIFTS_RATE_SALT + ':' + ip));
  const hash = Array.from(new Uint8Array(digest), value => value.toString(16).padStart(2, '0')).join('');
  const recent = await db.prepare('SELECT COUNT(*) AS count FROM contributions WHERE sender_hash = ? AND created_at > unixepoch() - 60').bind(hash).first();
  if (recent.count >= 5) return json({ error: 'rate_limit' }, 429);
  // The insert and capacity check are one SQL statement: concurrent guests cannot
  // overfill a finite gift, and a stale "full" contribution cannot over-report it.
  const result = await db.prepare(`
    INSERT INTO contributions (id, gift_id, amount_cents, coverage, guest_name, message, sender_hash)
    SELECT ?, ?, ?, ?, ?, ?, ?
    WHERE (? IS NULL OR
      (COALESCE((SELECT SUM(amount_cents) FROM contributions WHERE gift_id = ?), 0) + ? <= ?
       AND (? != 'full' OR COALESCE((SELECT SUM(amount_cents) FROM contributions WHERE gift_id = ?), 0) + ? = ?)))
    ON CONFLICT(id) DO NOTHING
  `).bind(id, giftId, amountCents, coverage, name.trim(), message.trim(), hash,
    target, giftId, amountCents, target, coverage, giftId, amountCents, target).run();
  if (!result.meta.changes) return json({ error: 'gift_changed' }, 409);
  return json({ ok: true }, 201);
}
