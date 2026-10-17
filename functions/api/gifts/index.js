import { getGifts, json } from '../../../server/gift-store.js';

export async function onRequestGet({ env }) {
  if (!env.GIFTS_DB) return json({ error: 'storage_unavailable' }, 503);
  try { return json({ gifts: await getGifts(env.GIFTS_DB) }); }
  catch { return json({ error: 'storage_unavailable' }, 503); }
}
