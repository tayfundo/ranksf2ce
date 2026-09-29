// Ziyaretçi sayacı: Netlify Blobs üzerinde tek bir sayı tutar.
// POST -> sayacı 1 artırır ve yeni değeri döner, GET -> mevcut değeri döner.
import { getStore } from '@netlify/blobs';

const KEY = 'total';
const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

export default async (req) => {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }
  try {
    const store = getStore('visitor-counter');
    let count = Number(await store.get(KEY)) || 0;
    if (req.method === 'POST') {
      count += 1;
      await store.set(KEY, String(count));
    }
    return json({ count });
  } catch {
    return json({ error: 'unavailable' }, 500);
  }
};
