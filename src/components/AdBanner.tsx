// Dost site reklam alanı: epassiones.net (Arcade Stick Longplays).
// Kartları değiştirmek için aşağıdaki CARDS listesini düzenlemen yeterli.
// Görseller public/ads/ klasöründe durur. Logo için public/ads/logo.png dosyasını koy;
// dosya yoksa otomatik olarak "ASL" kutusu görünür.

import { useState } from 'react'

const SITE_URL = 'https://epassiones.net/'
const YOUTUBE_URL = 'https://www.youtube.com/@arcadesticklongplays'

type AdCard = {
  href: string
  image: string
  position: string // görselin kartta hangi noktasının görüneceği (object-position)
  eyebrow: string
  title: string
  small?: boolean // uzun başlıklar için daha küçük punto
  desc: string
  day: string
  time: string
}

const CARDS: AdCard[] = [
  {
    href: 'https://epassiones.net/three-to-fall/',
    image: '/ads/three-to-fall.jpg',
    position: '50% 30%',
    eyebrow: 'YENİ TURNUVA · 3V3',
    title: 'THREE TO FALL',
    desc: 'Üç karakterli ekiplerin sabit sırayla savaştığı takım turnuvası.',
    day: 'CUMARTESİ',
    time: '21:30 TR',
  },
  {
    href: 'https://epassiones.net/shadow-dojo-league-season-2/',
    image: '/ads/shadow-dojo-s2.jpg',
    position: '50% 22%',
    eyebrow: 'SEZON 2 · AÇIK DAVET',
    title: 'SHADOW DOJO LEAGUE — SEASON 2',
    small: true,
    desc: "Türkiye ve Avrupa'dan oyunculara açık yeni sezon.",
    day: 'PAZAR',
    time: '21:30 TR',
  },
  {
    href: 'https://epassiones.net/crown-clash/',
    image: '/ads/crown-clash.jpg',
    position: '50% 40%',
    eyebrow: 'CUMA GECESİ · TAÇ SAVAŞLARI',
    title: 'CROWN CLASH — TAÇ SAVAŞLARI',
    small: true,
    desc: "Türkiye'ye özel Street Fighter II rekabet gecesi.",
    day: 'CUMA',
    time: '21:30 TR',
  },
]

const AD_CSS = `
.ad-box{max-width:1180px;margin:30px auto 6px;position:relative;z-index:3;padding:16px;border:1px solid var(--line);background:rgba(4,9,22,.78)}
.ad-head{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:14px}
.ad-logo{width:42px;height:42px;display:grid;place-items:center;flex:none;background:#05060d;border:1px solid #f5b63a;color:#f5b63a;font:900 15px 'Barlow Condensed';letter-spacing:.06em}
.ad-logo-img{display:block;height:46px;width:auto;max-width:120px;object-fit:contain;flex:none}
.ad-copy{flex:1;min-width:180px}
.ad-tag{display:block;font:500 9px 'DM Mono',monospace;letter-spacing:.2em;color:#8cb2d9;margin-bottom:3px}
.ad-title{margin:0;font:800 23px/1.1 'Barlow Condensed';letter-spacing:.02em;color:#fff}
.ad-title span{color:#f5b63a}
.ad-btn{display:inline-flex;align-items:center;gap:8px;flex:none;padding:10px 14px;border-radius:4px;text-decoration:none;font:500 11px 'DM Mono',monospace;letter-spacing:.08em}
.ad-btn svg{width:16px;height:16px;flex:none}
.ad-btn-site{background:#f5b63a;color:#1a1200}
.ad-btn-yt{background:#e0241f;color:#fff}
.ad-btn:hover{filter:brightness(1.08)}
.ad-btn:focus-visible,.ad-card:focus-visible{outline:2px solid #f5b63a;outline-offset:3px}
.ad-cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
.ad-card{position:relative;display:flex;flex-direction:column;overflow:hidden;border:1px solid rgba(255,255,255,.16);border-radius:12px;background:#0a0c1a;color:inherit;text-decoration:none;transition:border-color .2s}
.ad-card:hover{border-color:#f5b63a}
.ad-art{position:relative;height:150px}
.ad-art img{display:block;width:100%;height:100%;object-fit:cover}
.ad-art:after{content:'';position:absolute;inset:0;background:linear-gradient(to bottom,rgba(10,12,26,.15) 0%,rgba(10,12,26,.55) 60%,#0a0c1a 100%)}
.ad-body{position:relative;z-index:1;margin-top:-50px;padding:0 15px 15px}
.ad-eyebrow{font:500 10px 'DM Mono',monospace;letter-spacing:.14em;color:#f5b63a;margin-bottom:7px}
.ad-name{font:900 28px/1 'Barlow Condensed';letter-spacing:.01em;color:#fff;margin:0 0 7px}
.ad-name.sm{font-size:22px}
.ad-desc{font:500 15px/1.3 'Barlow Condensed';color:#cfd6ee;margin:0 0 11px}
.ad-chips{display:flex;gap:6px;flex-wrap:wrap}
.ad-chips span{font:500 10px 'DM Mono',monospace;letter-spacing:.08em;color:#fff;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.25);border-radius:999px;padding:3px 10px}
@media(max-width:760px){
.ad-box{padding:14px}
.ad-cards{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:12px;padding-bottom:6px;-webkit-overflow-scrolling:touch}
.ad-card{flex:0 0 78%;scroll-snap-align:start}
.ad-art{height:130px}
.ad-title{font-size:20px}
}
`

function AdLogo() {
  const [failed, setFailed] = useState(false)
  if (failed) return <div className="ad-logo" aria-hidden="true">ASL</div>
  return <img className="ad-logo-img" src="/ads/logo.png" alt="Arcade Stick Longplays" onError={() => setFailed(true)} />
}

export default function AdBanner() {
  return (
    <section className="ad-box" aria-label="Dost site">
      <style>{AD_CSS}</style>
      <div className="ad-head">
        <AdLogo />
        <div className="ad-copy">
          <span className="ad-tag">DOST SİTE</span>
          <h2 className="ad-title">Fightcade'in <span>rekabet geceleri.</span></h2>
        </div>
        <a className="ad-btn ad-btn-site" href={SITE_URL} target="_blank" rel="noopener">epassiones.net</a>
        <a className="ad-btn ad-btn-yt" href={YOUTUBE_URL} target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2C.5 9.1.5 12 .5 12s0 2.9.5 4.8a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-4.8.5-4.8s0-2.9-.5-4.8zM9.7 15.1V8.9l5.8 3.1-5.8 3.1z"/></svg>
          YouTube
        </a>
      </div>
      <div className="ad-cards">
        {CARDS.map(card => (
          <a className="ad-card" key={card.href} href={card.href} target="_blank" rel="noopener">
            <div className="ad-art">
              <img src={card.image} alt="" loading="lazy" style={{ objectPosition: card.position }} />
            </div>
            <div className="ad-body">
              <div className="ad-eyebrow">{card.eyebrow}</div>
              <h3 className={card.small ? 'ad-name sm' : 'ad-name'}>{card.title}</h3>
              <p className="ad-desc">{card.desc}</p>
              <div className="ad-chips"><span>{card.day}</span><span>{card.time}</span></div>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
