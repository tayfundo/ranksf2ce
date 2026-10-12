import { useEffect, useId, useMemo, useState } from 'react'
import { Search, Swords, Clock3, MapPin, Zap, ChevronRight, Shield } from 'lucide-react'
import TurnuvaKartlari from './TurnuvaKartlari'
import LangSwitch from './LangSwitch'
import { STR, LOCALES, getStoredLang, type Lang } from './i18n'

type Player = { name: string; elo: number; rank: number; fightcadeRank: number; totalMatches: number; timePlayed: number; country: string }
type Rankings = { gameName: string; players: Player[]; lastUpdated: string; totalPlayers: number }
type Tier = { name: string; short: string; level: number }

const numberFormats = { tr: new Intl.NumberFormat(LOCALES.tr.num), en: new Intl.NumberFormat(LOCALES.en.num) }
const getTier = (elo: number): Tier => {
  if (elo >= 2000) return { name: 'S Klasmanı', short: 'S', level: 6 }
  if (elo >= 1800) return { name: 'A Klasmanı', short: 'A', level: 5 }
  if (elo >= 1600) return { name: 'B Klasmanı', short: 'B', level: 4 }
  if (elo >= 1400) return { name: 'C Klasmanı', short: 'C', level: 3 }
  if (elo >= 1200) return { name: 'D Klasmanı', short: 'D', level: 2 }
  return { name: 'E Klasmanı', short: 'E', level: 1 }
}
const TIER_ORDER = ['S', 'A', 'B', 'C', 'D', 'E'] as const

const TIER_BAR_CSS = `
.tp-wrap{padding:18px 24px 22px;border-top:1px solid rgba(120,170,255,.25)}
.tp-labels,.tp-nums{display:flex;justify-content:space-between;gap:12px}
.tp-labels span{font-size:11px;letter-spacing:.14em;color:#a9c4ee;font-family:ui-monospace,monospace}
.tp-nums{margin-top:10px}
.tp-nums b{font-size:13px;color:#59a5ff;font-family:ui-monospace,monospace}
.tp-bar{position:relative;height:8px;margin-top:10px;border-radius:99px;background:rgba(120,170,255,.16)}
.tp-fill{position:absolute;left:0;top:0;bottom:0;border-radius:99px;background:linear-gradient(90deg,#1768d8,#5aa8ff)}
.tp-marker{position:absolute;top:50%;width:16px;height:16px;border-radius:50%;background:#fff;border:3px solid #1f7aff;transform:translate(-50%,-50%);box-shadow:0 0 0 4px rgba(31,122,255,.25)}
@media (max-width:560px){.tp-wrap{padding:16px}.tp-labels span{font-size:10px;letter-spacing:.08em}.tp-nums b{font-size:12px}}
`

// Aramaları arka planda, gizli kayıt fonksiyonuna gönderir. Site ziyaretçisi
// için görünmez, başarısız olursa da sessizce yutulur (arama akışını bozmaz).
function logSearch(query: string, matched: string | null) {
  fetch('/api/log-search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, matched }),
  }).catch(() => {})
}

// Ziyaretçi sayacı: oturum başına bir kez sayacı artırır, sonrasında sadece okur.
// Fonksiyon ulaşılamazsa rozet hiç gösterilmez (kırık görsel kalmaz).
function VisitorCounter({ lang }: { lang: Lang }) {
  const t = STR[lang]
  const number = numberFormats[lang]
  const [count, setCount] = useState<number | null>(null)
  const [failure, setFailure] = useState<string | null>(null)
  useEffect(() => {
    let counted = false
    try { counted = sessionStorage.getItem('visit-counted') === '1' } catch {}
    fetch('/api/visit-counter', { method: counted ? 'GET' : 'POST' })
      .then(async r => {
        const text = await r.text()
        let d: { count?: number; error?: string } = {}
        try { d = JSON.parse(text) } catch {}
        if (!r.ok || typeof d.count !== 'number') throw new Error(`HTTP ${r.status} ${d.error ?? text.slice(0, 80)}`)
        setCount(d.count)
        try { sessionStorage.setItem('visit-counted', '1') } catch {}
      })
      .catch(e => setFailure(String(e?.message ?? e)))
  }, [])
  if (count === null && failure === null) return null
  return <div className="visitor-badge" title={failure ?? undefined} aria-label={count === null ? t.counterOff : t.counterAria(number.format(count))}><span>{t.visitors}</span><b>{count === null ? '?' : number.format(count)}</b></div>
}

function FighterArt({ side }: { side: 'ryu' | 'ken' }) {
  return <div className={`fighter fighter-${side}`} aria-hidden="true"><span className="fighter-name">{side.toUpperCase()}</span><div className="head"><i /></div><div className="torso"/><div className="arm arm-one"/><div className="arm arm-two"/><div className="belt"/></div>
}

export default function PlayerSearch() {
  const [lang, setLang] = useState<Lang>('tr')
  useEffect(() => { setLang(getStoredLang()) }, [])
  useEffect(() => { document.documentElement.lang = lang }, [lang])
  const changeLang = (l: Lang) => { setLang(l); try { localStorage.setItem('lang', l) } catch {} }
  const t = STR[lang]
  const number = numberFormats[lang]
  const [data, setData] = useState<Rankings | null>(null)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Player | null>(null)
  const [error, setError] = useState(false)
  const listId = useId()
  useEffect(() => {
    // Veri sadece KV'den (/api/rankings) okunur; eski dosyaya düşme yok. Okunamazsa hata gösterilir.
    fetch('/api/rankings').then(r => { if (!r.ok) throw new Error(); return r.json() }).then(setData).catch(() => setError(true))
  }, [])
  const matches = useMemo(() => { const needle = query.trim().toLocaleLowerCase('tr-TR'); if (!data || needle.length < 2) return []; return data.players.filter(p => p.name.toLocaleLowerCase('tr-TR').includes(needle)).slice(0, 8) }, [data, query])
  const choose = (player: Player) => { setSelected(player); setQuery(player.name); logSearch(player.name, player.name) }
  const handleEnter = () => {
    if (matches[0]) { choose(matches[0]); return }
    const trimmed = query.trim()
    if (trimmed.length >= 2) logSearch(trimmed, null)
  }
  const tier = selected ? getTier(selected.elo) : null
  const classCounts = useMemo(() => data ? TIER_ORDER.map(short => ({ short, count: data.players.filter(player => getTier(player.elo).short === short).length })) : [], [data])

  // Bulunduğun klasmanın sınırlarını bul: üst klasmana kaç kişi kaldı,
  // alt klasmana düşmek için kaç kişinin seni geçmesi gerekiyor.
  const tierProgress = useMemo(() => {
    if (!data || !selected || !tier) return null
    const tierIndex = TIER_ORDER.indexOf(tier.short as typeof TIER_ORDER[number])
    const topRank = data.players.find(p => getTier(p.elo).short === tier.short)?.rank ?? selected.rank
    const lowerShort = TIER_ORDER[tierIndex + 1]
    const lowerFirst = lowerShort ? data.players.find(p => getTier(p.elo).short === lowerShort)?.rank : undefined
    const bottomRank = lowerFirst ? lowerFirst - 1 : data.players.length
    const span = Math.max(1, bottomRank - topRank)
    const fraction = Math.min(1, Math.max(0, (bottomRank - selected.rank) / span))

    const lastRank = data.players.length ? data.players[data.players.length - 1].rank : bottomRank
    // Çubukta sol uç = üst klasmana geçiş, sağ uç = alt klasmana düşüş (en alttaysa listenin sonu).
    // pos: 0 = klasmanın en tepesi, 1 = klasmanın en dibi.
    const pos = 1 - fraction

    let up: { short: string; need: number } | null = null
    if (tierIndex > 0) {
      const upperShort = TIER_ORDER[tierIndex - 1]
      const boundaryRank = topRank - 1
      const need = selected.rank - boundaryRank
      if (need > 0) up = { short: upperShort, need }
    }

    let down: { short: string; need: number } | null = null
    if (lowerShort) {
      down = { short: lowerShort, need: bottomRank - selected.rank }
    }
    const end = lowerShort ? null : { need: Math.max(0, lastRank - selected.rank) }

    return { up, down, end, pos }
  }, [data, selected, tier])

  return <main className="site-shell">
    <div className="halftone" aria-hidden="true" />
    <div className="top-tools"><LangSwitch lang={lang} onChange={changeLang} label={t.langAria} /><VisitorCounter lang={lang} /></div>
    <header className="masthead"><a className="brand" href="/" aria-label={t.homeAria}><span className="brand-mark">R</span><span><b>sf2blacklist</b>.fun</span></a><div className="game-tag"><span>SF II</span> CHAMPION EDITION</div><div className="live-status"><span /> {t.live}</div></header>
    <section className="hero">
      <FighterArt side="ryu"/><FighterArt side="ken"/>
      <div className="hero-copy">
        <div className="kicker"><span>FIGHTCADE</span> {t.kicker}</div>
        <p className="lede">{t.lede}</p>
        <div className="search-wrap">
          <label htmlFor="nick">{t.nickLabel}</label>
          <div className="search-box"><Search aria-hidden="true"/><input id="nick" value={query} onChange={e => { setQuery(e.target.value); setSelected(null) }} onKeyDown={e => { if (e.key === 'Enter') handleEnter() }} placeholder={t.placeholder} autoComplete="off" disabled={!data || error} role="combobox" aria-controls={listId} aria-expanded={matches.length > 0 && !selected}/><span className="keycap">ENTER ↵</span></div>
          {!data && !error && <div className="loading"><span/><span/><span/> {t.loading}</div>}
          {error && <div className="notice error">{t.loadError}</div>}
          {data && query.trim().length === 1 && <div className="notice">{t.minChars}</div>}
          {data && query.trim().length >= 2 && matches.length === 0 && !selected && <div className="notice">{t.noMatch(query)}</div>}
          {matches.length > 0 && !selected && <div className="results" id={listId} role="listbox" aria-label={t.listAria}>{matches.map(p => { const itemTier = getTier(p.elo); return <button role="option" aria-selected="false" key={`${p.rank}-${p.name}`} onClick={() => choose(p)}><span className="mini-tier">{itemTier.short}</span><span className="result-rank">#{number.format(p.rank)}</span><strong>{p.name}</strong><span className="country">{p.country}</span><ChevronRight/></button> })}</div>}
        </div>
      </div>
      <div className="round-stamp" aria-hidden="true"><span>ROUND</span><strong>1</strong><i>FIGHT!</i></div>
    </section>

    {selected && tier ? <section className="player-card" aria-live="polite">
      <div className="rank-panel"><span className="panel-label">{t.leagueRank}</span><div className="tier-emblem"><Shield/><strong>{tier.short}</strong></div><h3>{t.tierName(tier.short)}</h3><div className="tier-pips" aria-label={t.levelAria(tier.level)}>{[1,2,3,4,5,6].map(i => <i className={i <= tier.level ? 'active' : ''} key={i}/>)}</div></div>
      <div className="player-data">
        <div className="player-heading"><div><span className="eyebrow">{t.playerCard} / {tier.short}</span><h2>{selected.name}</h2><p><MapPin/> {selected.country}</p></div><div className="rank-badge"><span>{t.worldRank}</span><strong>#{number.format(selected.rank)}</strong></div></div>
        <div className="stat-grid"><article><Shield/><span>{t.tier}</span><strong>{tier.short}</strong></article><article><Zap/><span>{t.fcRank}</span><strong>{selected.fightcadeRank}</strong></article><article><Swords/><span>{t.totalMatches}</span><strong>{number.format(selected.totalMatches)}</strong></article><article><Clock3/><span>{t.playTime}</span><strong>{`${number.format(Math.round(selected.timePlayed / 3600))} ${t.hours}`}</strong></article></div>
        {tierProgress && <div className="tp-wrap">
          <style>{TIER_BAR_CSS}</style>
          <div className="tp-labels">
            <span>{tierProgress.up ? t.tpUp(tierProgress.up.short) : t.tpTop}</span>
            <span>{tierProgress.down ? t.tpDown(tierProgress.down.short) : t.tpEnd}</span>
          </div>
          <div className="tp-bar" role="img" aria-label={t.posAria}>
            <i className="tp-fill" style={{ width: `${tierProgress.pos * 100}%` }}/>
            <b className="tp-marker" style={{ left: `${tierProgress.pos * 100}%` }}/>
          </div>
          <div className="tp-nums">
            <b>{tierProgress.up ? t.tpNeed(number.format(tierProgress.up.need)) : t.tpAtTop}</b>
            <b>{tierProgress.down ? t.tpDropNeed(number.format(tierProgress.down.need)) : t.tpAfter(number.format(tierProgress.end?.need ?? 0))}</b>
          </div>
        </div>}
      </div>
    </section> : data ? <section className="rank-system">
      <div className="rank-intro"><span className="eyebrow">{t.tiersTitle}</span><h2>Agahbey</h2></div>
      <div className="rank-ladder">{classCounts.map((item, i) => <div className={`rank-row rank-${i}`} key={item.short}><b>{item.short}</b><span>{t.tierSuffix}</span><i/><small>{t.playersCount(number.format(item.count))}</small></div>)}</div>
    </section> : null}
    <section className="data-strip"><div><span>ARENA</span><strong>SF2CE</strong></div><div><span>{t.stripActive}</span><strong>{data ? number.format(data.totalPlayers) : '—'}</strong></div><p>HADOUKEN! <i>勝負</i></p><div><span>{t.stripUpdated}</span><strong>{data ? new Date(data.lastUpdated).toLocaleString(LOCALES[lang].date, { dateStyle: 'short', timeStyle: 'short' }) : '—'}</strong></div></section>
    <TurnuvaKartlari lang={lang} />
    <footer><span>{t.footerLeft}</span><p>{t.footerMid}</p><b>© 2026</b></footer>
  </main>
}
