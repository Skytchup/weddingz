import { json, recordContribution } from '../../../server/gift-store.js';

export async function onRequestPost({ request, env }) {
  try { return await recordContribution(request, env); }
  catch { return json({ error: 'storage_unavailable' }, 503); }
}
