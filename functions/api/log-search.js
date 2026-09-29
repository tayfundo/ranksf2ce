// Aranan nickleri gizli GitHub Gist'e kaydeden Cloudflare Pages Function.
// GH_TOKEN ve GH_GIST_ID → Cloudflare → Settings → Variables and Secrets
const FILE_NAME = 'arama-kayitlari.json';
const MAX_ENTRIES = 500;

export const onRequestPost = async ({ request, env }) => {
  const token = env.GH_TOKEN;
  const gistId = env.GH_GIST_ID;
  if (!token || !gistId) return new Response('Sunucu yapılandırması eksik', { status: 500 });

  let payload;
  try { payload = JSON.parse((await request.text()) || '{}'); }
  catch { return new Response('Bad Request', { status: 400 }); }

  const query = typeof payload.query === 'string' ? payload.query.slice(0, 60) : null;
  if (!query) return new Response('Bad Request', { status: 400 });
  const matched = typeof payload.matched === 'string' ? payload.matched.slice(0, 60) : null;

  const headers = {
    Authorization: `token ${token}`,
    'Content-Type': 'application/json',
    'User-Agent': 'sf2ce-rank-logger',
  };

  try {
    const getRes = await fetch(`https://api.github.com/gists/${gistId}`, { headers });
    if (!getRes.ok) return new Response('Gist okunamadı', { status: 500 });
    const gist = await getRes.json();

    let entries = [];
    try {
      entries = JSON.parse(gist.files[FILE_NAME].content);
      if (!Array.isArray(entries)) entries = [];
    } catch { entries = []; }

    entries.unshift({ query, matched, at: new Date().toISOString() });
    entries = entries.slice(0, MAX_ENTRIES);

    const patchRes = await fetch(`https://api.github.com/gists/${gistId}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ files: { [FILE_NAME]: { content: JSON.stringify(entries, null, 2) } } }),
    });
    if (!patchRes.ok) return new Response('Gist yazılamadı', { status: 500 });
    return new Response(null, { status: 204 });
  } catch { return new Response('Error', { status: 500 }); }
};

