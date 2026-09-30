import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'

// Sıralama verisini Cloudflare KV'den (RANKINGS) okuyup olduğu gibi döndürür.
// Veriyi PC'deki upload-rankings.mjs script'i KV'ye yazıyor.
const KEY = 'sf2ce-rankings'

export const Route = createFileRoute('/api/rankings')({
  server: {
    handlers: {
      GET: async () => {
        try {
          const kv = (env as any).RANKINGS
          if (!kv) return new Response('RANKINGS binding bulunamadı', { status: 500 })
          // cacheTtl: KV okumasını kenarda 5 dk önbellekler (ücretsiz okuma limitini korur)
          const body = await kv.get(KEY, { type: 'text', cacheTtl: 300 })
          if (!body) return new Response('Veri bulunamadı', { status: 404 })
          return new Response(body, {
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
              'Cache-Control': 'public, max-age=300',
            },
          })
        } catch (err: any) {
          return new Response(`Hata: ${err?.message ?? err}`, { status: 500 })
        }
      },
    },
  },
})
