import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { getGifts, recordContribution } from '../server/gift-store.js';
import { onRequestGet } from '../functions/api/gifts/index.js';
import { onRequestPost } from '../functions/api/gifts/contributions.js';

function fixture() {
  const sqlite = new DatabaseSync(':memory:');
  sqlite.exec(readFileSync(new URL('../migrations/0001_gifts.sql', import.meta.url), 'utf8'));
  const db = { prepare(sql) {
    let params = [];
    return { bind(...values) { params = values; return this; },
      async first() { return sqlite.prepare(sql).get(...params) || null; },
      async all() { return { results: sqlite.prepare(sql).all(...params) }; },
      async run() { return { meta: { changes: Number(sqlite.prepare(sql).run(...params).changes) } }; }
    };
  } };
  return { env: { GIFTS_DB: db, GIFTS_RATE_SALT: 'test-only' }, sqlite };
}
const body = changes => ({ id: crypto.randomUUID(), giftId: 'onsen', amountCents: 2500, coverage: 'partial', name: 'A guest', message: 'A private note', transferred: true, website: '', ...changes });
function request(data, headers = {}) { return new Request('https://wedding.example/api/gifts/contributions', { method: 'POST', headers: { Origin: 'https://wedding.example', 'Content-Type': 'application/json', 'CF-Connecting-IP': '192.0.2.1', ...headers }, body: JSON.stringify(data) }); }

test('partial gifts persist; public data contains totals only', async () => {
  const { env } = fixture();
  assert.equal((await recordContribution(request(body()), env)).status, 201);
  const gifts = await getGifts(env.GIFTS_DB);
  assert.equal(gifts.find(gift => gift.id === 'onsen').contributedCents, 2500);
  const response = await onRequestGet({ env });
  const text = await response.text();
  assert.ok(!text.includes('private') && !text.includes('guest') && !text.includes('sender_hash'));
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
});
test('a partial and remaining full gift reach the target, then further gifts are rejected', async () => {
  const { env } = fixture();
  assert.equal((await recordContribution(request(body()), env)).status, 201);
  assert.equal((await recordContribution(request(body({ amountCents: 7500, coverage: 'full' })), env)).status, 201);
  assert.equal((await recordContribution(request(body({ amountCents: 1 })), env)).status, 409);
});
test('concurrent contributions cannot exceed the target', async () => {
  const { env } = fixture();
  const responses = await Promise.all([recordContribution(request(body({ amountCents: 7000 })), env), recordContribution(request(body({ amountCents: 7000 })), env)]);
  assert.deepEqual(responses.map(response => response.status).sort(), [201, 409]);
  assert.equal((await getGifts(env.GIFTS_DB)).find(gift => gift.id === 'onsen').contributedCents, 7000);
});
test('a stale full amount is rejected rather than counted as complete', async () => {
  const { env } = fixture();
  assert.equal((await recordContribution(request(body({ amountCents: 9999, coverage: 'full' })), env)).status, 409);
});
test('retrying the same request never double-counts; changed payload cannot reuse an id', async () => {
  const { env } = fixture(), data = body();
  assert.equal((await recordContribution(request(data), env)).status, 201);
  assert.equal((await recordContribution(request(data), env)).status, 200);
  assert.equal((await recordContribution(request({ ...data, amountCents: 2000 }), env)).status, 409);
  assert.equal((await getGifts(env.GIFTS_DB)).find(gift => gift.id === 'onsen').contributedCents, 2500);
});
test('Pokémon and general gifts have no target and allow repeated contributions', async () => {
  const { env } = fixture();
  for (const giftId of ['pokemon', 'together']) {
    for (const amountCents of [1, 2000000]) assert.equal((await recordContribution(request(body({ giftId, amountCents })), env)).status, 201);
  }
  for (const gift of (await getGifts(env.GIFTS_DB)).filter(gift => gift.targetCents === null)) assert.equal(gift.contributedCents, 2000001);
});
test('invalid amounts, text, ids, confirmation and bots are rejected', async () => {
  const { env } = fixture();
  for (const change of [{ amountCents: 0 }, { amountCents: -1 }, { amountCents: 1.5 }, { amountCents: '200' }, { giftId: '__proto__' }, { giftId: 'invalid' }, { id: 'bad' }, { name: 'x'.repeat(101) }, { message: 'x'.repeat(1001) }, { transferred: false }, { website: 'bot' }, { coverage: 'other' }, { giftId: 'pokemon', coverage: 'full' }]) {
    assert.equal((await recordContribution(request(body(change)), env)).status, 400, JSON.stringify(change));
  }
});
test('cross-origin, missing origin and non-JSON requests are rejected', async () => {
  const { env } = fixture();
  assert.equal((await recordContribution(request(body(), { Origin: 'https://evil.example' }), env)).status, 403);
  assert.equal((await recordContribution(request(body(), { 'Content-Type': 'text/plain' }), env)).status, 415);
  const req = request(body()); req.headers.delete('Origin');
  assert.equal((await recordContribution(req, env)).status, 403);
});
test('oversized and malformed payloads are rejected', async () => {
  const { env } = fixture();
  assert.equal((await recordContribution(request(body({ message: 'x'.repeat(9000) })), env)).status, 413);
  const req = new Request('https://wedding.example/api/gifts/contributions', { method: 'POST', headers: { Origin: 'https://wedding.example', 'Content-Type': 'application/json' }, body: 'not-json' });
  assert.equal((await recordContribution(req, env)).status, 400);
});
test('short-term rate limiting is enforced', async () => {
  const { env } = fixture();
  for (let i = 0; i < 5; i++) assert.equal((await recordContribution(request(body({ giftId: 'together' })), env)).status, 201);
  assert.equal((await recordContribution(request(body({ giftId: 'together' })), env)).status, 429);
});
test('storage failures return a clear error rather than fake zero totals or success', async () => {
  assert.equal((await onRequestGet({ env: {} })).status, 503);
  assert.equal((await onRequestPost({ request: request(body()), env: {} })).status, 503);
  const { env } = fixture(); delete env.GIFTS_RATE_SALT;
  assert.equal((await onRequestPost({ request: request(body()), env })).status, 503);
});
