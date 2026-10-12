// epassiones.net turnuva kartları (Arcade Stick Longplays).
// Kartları değiştirmek için aşağıdaki CARDS listesini düzenlemen yeterli (her yazı TR ve EN).
// Görseller public/turnuva/ klasöründe durur. Logo için public/turnuva/logo.png dosyasını koy;
// dosya yoksa otomatik olarak "ASL" kutusu görünür.

import { useState } from 'react'
import type { Lang } from './i18n'

const SITE_URL = 'https://epassiones.net/'
const YOUTUBE_URL = 'https://www.youtube.com/@arcadesticklongplays'

type Text = { eyebrow: string; title: string; desc: string; day: string; time: string }
type CardItem = {
  href: string
  image: string
  position: string // görselin kartta hangi noktasının görüneceği (object-position)
  small?: boolean // uzun başlıklar için daha küçük punto
  text: Record<Lang, Text>
}

const CARDS: CardItem[] = [
  {
    href: 'https://epassiones.net/three-to-fall/',
    image: '/turnuva/three-to-fall.jpg',
    position: '50% 30%',
    text: {
      tr: { eyebrow: 'YENİ TURNUVA · 3V3', title: 'THREE TO FALL', desc: 'Üç karakterli ekiplerin sabit sırayla savaştığı takım turnuvası.', day: 'CUMARTESİ', time: '21:30 TR' },
      en: { eyebrow: 'NEW TOURNAMENT · 3V3', title: 'THREE TO FALL', desc: 'A team tournament where three-character squads fight in a fixed order.', day: 'SATURDAY', time: '21:30 TRT' },
    },
  },
  {
    href: 'https://epassiones.net/shadow-dojo-league-season-2/',
    image: '/turnuva/shadow-dojo-s2.jpg',
    position: '50% 22%',
    small: true,
    text: {
      tr: { eyebrow: 'SEZON 2 · AÇIK DAVET', title: 'SHADOW DOJO LEAGUE — SEASON 2', desc: "Türkiye ve Avrupa'dan oyunculara açık yeni sezon.", day: 'PAZAR', time: '21:30 TR' },
      en: { eyebrow: 'SEASON 2 · OPEN INVITE', title: 'SHADOW DOJO LEAGUE — SEASON 2', desc: 'A new season open to players from Turkey and Europe.', day: 'SUNDAY', time: '21:30 TRT' },
    },
  },
  {
    href: 'https://epassiones.net/crown-clash/',
    image: '/turnuva/crown-clash.jpg',
    position: '50% 40%',
    small: true,
    text: {
      tr: { eyebrow: 'CUMA GECESİ · TAÇ SAVAŞLARI', title: 'CROWN CLASH — TAÇ SAVAŞLARI', desc: "Türkiye'ye özel Street Fighter II rekabet gecesi.", day: 'CUMA', time: '21:30 TR' },
      en: { eyebrow: 'FRIDAY NIGHT · CROWN CLASH', title: 'CROWN CLASH', desc: 'A Street Fighter II competition night exclusive to Turkey.', day: 'FRIDAY', time: '21:30 TRT' },
    },
  },
]

const CARD_CSS = `
.tc-box{max-width:1180px;margin:30px auto 6px;position:relative;z-index:3;padding:16px;border:1px solid var(--line);background:rgba(4,9,22,.78)}
.tc-head{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:14px}
.tc-logo{width:42px;height:42px;display:grid;place-items:center;flex:none;background:#05060d;border:1px solid #f5b63a;color:#f5b63a;font:900 15px 'Barlow Condensed';letter-spacing:.06em}
.tc-logo-img{display:block;height:46px;width:auto;max-width:120px;object-fit:contain;flex:none}
.tc-copy{flex:1;min-width:180px}
.tc-title{margin:0;font:800 23px/1.1 'Barlow Condensed';letter-spacing:.02em;color:#fff}
.tc-title span{color:#f5b63a}
.tc-btn{display:inline-flex;align-items:center;gap:8px;flex:none;padding:10px 14px;border-radius:4px;text-decoration:none;font:500 11px 'DM Mono',monospace;letter-spacing:.08em}
.tc-btn svg{width:16px;height:16px;flex:none}
.tc-btn-site{background:#f5b63a;color:#1a1200}
.tc-btn-yt{background:#e0241f;color:#fff}
.tc-btn:hover{filter:brightness(1.08)}
.tc-btn:focus-visible,.tc-card:focus-visible{outline:2px solid #f5b63a;outline-offset:3px}
.tc-cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
.tc-card{position:relative;display:flex;flex-direction:column;overflow:hidden;border:1px solid rgba(255,255,255,.16);border-radius:12px;background:#0a0c1a;color:inherit;text-decoration:none;transition:border-color .2s}
.tc-card:hover{border-color:#f5b63a}
.tc-art{position:relative;height:150px}
.tc-art img{display:block;width:100%;height:100%;object-fit:cover}
.tc-art:after{content:'';position:absolute;inset:0;background:linear-gradient(to bottom,rgba(10,12,26,.15) 0%,rgba(10,12,26,.55) 60%,#0a0c1a 100%)}
.tc-body{position:relative;z-index:1;margin-top:-50px;padding:0 15px 15px}
.tc-eyebrow{font:500 10px 'DM Mono',monospace;letter-spacing:.14em;color:#f5b63a;margin-bottom:7px}
.tc-name{font:900 28px/1 'Barlow Condensed';letter-spacing:.01em;color:#fff;margin:0 0 7px}
.tc-name.sm{font-size:22px}
.tc-desc{font:500 15px/1.3 'Barlow Condensed';color:#cfd6ee;margin:0 0 11px}
.tc-chips{display:flex;gap:6px;flex-wrap:wrap}
.tc-chips span{font:500 10px 'DM Mono',monospace;letter-spacing:.08em;color:#fff;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.25);border-radius:999px;padding:3px 10px}
@media(max-width:760px){
.tc-box{padding:14px}
.tc-cards{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:12px;padding-bottom:6px;-webkit-overflow-scrolling:touch}
.tc-card{flex:0 0 78%;scroll-snap-align:start}
.tc-art{height:130px}
.tc-title{font-size:20px}
}
`

function SiteLogo() {
  const [failed, setFailed] = useState(false)
  if (failed) return <div className="tc-logo" aria-hidden="true">ASL</div>
  return <img className="tc-logo-img" src="/turnuva/logo.png" alt="Arcade Stick Longplays" onError={() => setFailed(true)} />
}

export default function TurnuvaKartlari({ lang = 'tr' }: { lang?: Lang }) {
  return (
    <section className="tc-box" aria-label="Arcade Stick Longplays">
      <style>{CARD_CSS}</style>
      <div className="tc-head">
        <SiteLogo />
        <div className="tc-copy">
          <h2 className="tc-title">
            {lang === 'tr' ? <>Fightcade'in <span>rekabet geceleri.</span></> : <>Fightcade's <span>competition nights.</span></>}
          </h2>
        </div>
        <a className="tc-btn tc-btn-site" href={SITE_URL} target="_blank" rel="noopener">epassiones.net</a>
        <a className="tc-btn tc-btn-yt" href={YOUTUBE_URL} target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2C.5 9.1.5 12 .5 12s0 2.9.5 4.8a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-4.8.5-4.8s0-2.9-.5-4.8zM9.7 15.1V8.9l5.8 3.1-5.8 3.1z"/></svg>
          YouTube
        </a>
      </div>
      <div className="tc-cards">
        {CARDS.map(card => {
          const x = card.text[lang]
          return (
            <a className="tc-card" key={card.href} href={card.href} target="_blank" rel="noopener">
              <div className="tc-art">
                <img src={card.image} alt="" loading="lazy" style={{ objectPosition: card.position }} />
              </div>
              <div className="tc-body">
                <div className="tc-eyebrow">{x.eyebrow}</div>
                <h3 className={card.small ? 'tc-name sm' : 'tc-name'}>{x.title}</h3>
                <p className="tc-desc">{x.desc}</p>
                <div className="tc-chips"><span>{x.day}</span><span>{x.time}</span></div>
              </div>
            </a>
          )
        })}
      </div>
    </section>
  )
}
