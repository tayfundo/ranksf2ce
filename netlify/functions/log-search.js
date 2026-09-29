// Aranan nickleri gizli bir GitHub Gist'e kaydeden Netlify Function.
// GH_TOKEN ve GH_GIST_ID, Netlify panosunda "Environment variables"
// olarak tanımlanır — tarayıcıya (client'a) asla gönderilmez.
const FILE_NAME = 'arama-kayitlari.json';
const MAX_ENTRIES = 500;

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const token = process.env.GH_TOKEN;
  const gistId = process.env.GH_GIST_ID;
  if (!token || !gistId) {
    return { statusCode: 500, body: 'Sunucu yapılandırması eksik' };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: 'Bad Request' };
  }

  const query = typeof payload.query === 'string' ? payload.query.slice(0, 60) : null;
  if (!query) {
    return { statusCode: 400, body: 'Bad Request' };
  }
  const matched = typeof payload.matched === 'string' ? payload.matched.slice(0, 60) : null;

  const headers = {
    Authorization: `token ${token}`,
    'Content-Type': 'application/json',
    'User-Agent': 'sf2ce-rank-logger',
  };

  try {
    const getRes = await fetch(`https://api.github.com/gists/${gistId}`, { headers });
    if (!getRes.ok) throw new Error(`Gist okunamadı: ${getRes.status}`);
    const gist = await getRes.json();

    let entries = [];
    try {
      entries = JSON.parse(gist.files[FILE_NAME].content);
      if (!Array.isArray(entries)) entries = [];
    } catch {
      entries = [];
    }

    entries.unshift({ query, matched, at: new Date().toISOString() });
    entries = entries.slice(0, MAX_ENTRIES);

    const patchRes = await fetch(`https://api.github.com/gists/${gistId}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ files: { [FILE_NAME]: { content: JSON.stringify(entries, null, 2) } } }),
    });
    if (!patchRes.ok) throw new Error(`Gist yazılamadı: ${patchRes.status}`);

    return { statusCode: 204, body: '' };
  } catch (err) {
    return { statusCode: 500, body: 'Error' };
  }
};
