const KEY = 'total';
const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

export const onRequest = async ({ request, env }) => {
  if (request.method !== 'GET' && request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }
  try {
    let count = Number(await env.COUNTER.get(KEY)) || 0;
    if (request.method === 'POST') {
      count += 1;
      await env.COUNTER.put(KEY, String(count));
    }
    return json({ count });
  } catch (err) {
    return json({ error: `unavailable: ${err?.message ?? err}` }, 500);
  }
};

