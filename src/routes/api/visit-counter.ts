import { createFileRoute } from '@tanstack/react-router'

// Ziyaretçi sayacı: Cloudflare KV'de tek bir sayı tutuyor.
// COUNTER, Cloudflare panosunda Settings > Bindings üzerinden bağlanan KV namespace'i.
const KEY = 'total'
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })

const handle = async ({ request }: { request: Request }) => {
  const env = (request as any).context?.cloudflare?.env
  try {
    const counter = env?.COUNTER
    if (!counter) return json({ error: 'unavailable: COUNTER binding bulunamadı' }, 500)
    let count = Number(await counter.get(KEY)) || 0
    if (request.method === 'POST') {
      count += 1
      await counter.put(KEY, String(count))
    }
    return json({ count })
  } catch (err: any) {
    return json({ error: `unavailable: ${err?.message ?? err}` }, 500)
  }
}

export const Route = createFileRoute('/api/visit-counter')({
  server: {
    handlers: {
      GET: handle,
      POST: handle,
    },
  },
})
