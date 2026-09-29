import { useEffect, useId, useMemo, useState } from 'react'
import { Search, Swords, Clock3, MapPin, Zap, ChevronRight, Shield } from 'lucide-react'

type Player = { name: string; elo: number; rank: number; fightcadeRank: number; totalMatches: number; timePlayed: number; country: string }
type Rankings = { gameName: string; players: Player[]; lastUpdated: string; totalPlayers: number }
type Tier = { name: string; short: string; level: number }

const number = new Intl.NumberFormat('tr-TR')
const playTime = (seconds: number) => `${number.format(Math.round(seconds / 3600))} saat`
const getTier = (elo: number): Tier => {
  if (elo >= 2000) return { name: 'S Klasmanı', short: 'S', level: 5 }
  if (elo >= 1800) return { name: 'A Klasmanı', short: 'A', level: 4 }
  if (elo >= 1600) return { name: 'B Klasmanı', short: 'B', level: 3 }
  if (elo >= 1400) return { name: 'C Klasmanı', short: 'C', level: 2 }
  return { name: 'D Klasmanı', short: 'D', level: 1 }
}
const TIER_ORDER = ['S', 'A', 'B', 'C', 'D'] as const

function FighterArt({ side }: { side: 'ryu' | 'ken' }) {
  return <div className={`fighter fighter-${side}`} aria-hidden="true"><span className="fighter-name">{side.toUpperCase()}</span><div className="head"><i /></div><div className="torso"/><div className="arm arm-one"/><div className="arm arm-two"/><div className="belt"/></div>
}

export default function PlayerSearch() {
  const [data, setData] = useState<Rankings | null>(null)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Player | null>(null)
  const [error, setError] = useState(false)
  const listId = useId()
  useEffect(() => { fetch('/data/sf2ce-rankings.json').then(r => { if (!r.ok) throw new Error(); return r.json() }).then(setData).catch(() => setError(true)) }, [])
  const matches = useMemo(() => { const needle = query.trim().toLocaleLowerCase('tr-TR'); if (!data || needle.length < 2) return []; return data.players.filter(p => p.name.toLocaleLowerCase('tr-TR').includes(needle)).slice(0, 8) }, [data, query])
  const choose = (player: Player) => { setSelected(player); setQuery(player.name) }
  const tier = selected ? getTier(selected.elo) : null
  const classCounts = useMemo(() => data ? ['S', 'A', 'B', 'C', 'D'].map(short => ({ short, count: data.players.filter(player => getTier(player.elo).short === short).length })) : [], [data])

  // Klasman içindeki konum: bar = oyuncunun klasmanındaki bütün oyuncular.
  // Sol uç = klasmanın en iyisi (üst klasmana yakın), sağ uç = en kötüsü (alt klasmana yakın).
  const tierProgress = useMemo(() => {
    if (!data || !selected || !tier) return null
    const tierIndex = TIER_ORDER.indexOf(tier.short as typeof TIER_ORDER[number])
    const upperShort = tierIndex > 0 ? TIER_ORDER[tierIndex - 1] : null
    const lowerShort = tierIndex < TIER_ORDER.length - 1 ? TIER_ORDER[tierIndex + 1] : null
    const topRank = data.players.find(p => getTier(p.elo).short === tier.short)?.rank ?? selected.rank
    const lowerFirst = lowerShort ? data.players.find(p => getTier(p.elo).short === lowerShort)?.rank : undefined
    const bottomRank = lowerFirst ? lowerFirst - 1 : data.players.length
    const size = Math.max(1, bottomRank - topRank + 1)
    const position = size > 1 ? Math.min(1, Math.max(0, (selected.rank - topRank) / (size - 1))) : 0.5
    return {
      upperShort,
      lowerShort,
      size,
      position,
      up: upperShort ? selected.rank - topRank + 1 : null,       // üst klasmana geçmek için geçilmesi gereken kişi
      down: lowerShort ? bottomRank - selected.rank + 1 : null,  // alt klasmana düşmek için seni geçmesi gereken kişi
    }
  }, [data, selected, tier])

  return <main className="site-shell">
    <div className="halftone" aria-hidden="true" />
    <header className="masthead"><a className="brand" href="/" aria-label="rank.sf2blacklist.fun ana sayfa"><span className="brand-mark">R</span><span><b>rank.</b>sf2blacklist.fun</span></a><div className="game-tag"><span>SF II</span> CHAMPION EDITION</div><div className="live-status"><span /> CANLI SIRALAMA</div></header>
    <section className="hero">
      <FighterArt side="ryu"/><FighterArt side="ken"/>
      <div className="hero-copy">
        <div className="kicker"><span>FIGHTCADE</span> DÜNYA SIRALAMASI</div>
        <p className="lede">Tam ya da kısmi isim yazabilirsin, büyük/küçük harf fark etmez.</p>
        <div className="search-wrap">
          <label htmlFor="nick">OYUNCU NİCKİ</label>
          <div className="search-box"><Search aria-hidden="true"/><input id="nick" value={query} onChange={e => { setQuery(e.target.value); setSelected(null) }} onKeyDown={e => { if (e.key === 'Enter' && matches[0]) choose(matches[0]) }} placeholder="Nickini yaz..." autoComplete="off" disabled={!data || error} role="combobox" aria-controls={listId} aria-expanded={matches.length > 0 && !selected}/><span className="keycap">ENTER ↵</span></div>
          {!data && !error && <div className="loading"><span/><span/><span/> Oyuncular arenaya çağrılıyor</div>}
          {error && <div className="notice error">Sıralama verisi yüklenemedi. Sayfayı yenileyip tekrar dene.</div>}
          {data && query.trim().length === 1 && <div className="notice">Aramak için en az 2 karakter yaz.</div>}
          {data && query.trim().length >= 2 && matches.length === 0 && !selected && <div className="notice">"{query}" ile eşleşen bir dövüşçü bulunamadı.</div>}
          {matches.length > 0 && !selected && <div className="results" id={listId} role="listbox" aria-label="Oyuncu sonuçları">{matches.map(p => { const itemTier = getTier(p.elo); return <button role="option" aria-selected="false" key={`${p.rank}-${p.name}`} onClick={() => choose(p)}><span className="mini-tier">{itemTier.short}</span><span className="result-rank">#{number.format(p.rank)}</span><strong>{p.name}</strong><span className="country">{p.country}</span><ChevronRight/></button> })}</div>}
        </div>
      </div>
      <div className="round-stamp" aria-hidden="true"><span>ROUND</span><strong>1</strong><i>FIGHT!</i></div>
    </section>

    {selected && tier ? <section className="player-card" aria-live="polite">
      <div className="rank-panel"><span className="panel-label">LİG RÜTBESİ</span><div className="tier-emblem"><Shield/><strong>{tier.short}</strong></div><h3>{tier.name}</h3><div className="tier-pips" aria-label={`5 üzerinden ${tier.level} seviye`}>{[1,2,3,4,5].map(i => <i className={i <= tier.level ? 'active' : ''} key={i}/>)}</div></div>
      <div className="player-data">
        <div className="player-heading"><div><span className="eyebrow">OYUNCU KARTI / {tier.short}</span><h2>{selected.name}</h2><p><MapPin/> {selected.country}</p></div><div className="rank-badge"><span>DÜNYA SIRASI</span><strong>#{number.format(selected.rank)}</strong></div></div>
        <div className="stat-grid"><article><Shield/><span>KLASMAN</span><strong>{tier.short}</strong></article><article><Zap/><span>FIGHTCADE RÜTBESİ</span><strong>{selected.fightcadeRank}</strong></article><article><Swords/><span>TOPLAM MAÇ</span><strong>{number.format(selected.totalMatches)}</strong></article><article><Clock3/><span>OYUN SÜRESİ</span><strong>{playTime(selected.timePlayed)}</strong></article></div>
        {tierProgress && (() => {
          const { up, down, upperShort, lowerShort, size, position } = tierProgress
          const edge = position < 0.08 ? 'start' : position > 0.92 ? 'end' : 'mid'
          return <div className="rank-progress tier-meter">
            <div className="meter-ends">
              <div className="meter-end">
                <span>{up != null ? `${upperShort} KLASMANINA GEÇİŞ` : 'ZİRVEDESİN'}</span>
                <b>{up != null ? `${number.format(up)} kişi kaldı` : 'Üstte klasman yok'}</b>
              </div>
              <div className="meter-mid">{tier.short} KLASMANI · {number.format(size)} OYUNCU</div>
              <div className="meter-end meter-end-right">
                <span>{down != null ? `${lowerShort} KLASMANINA DÜŞÜŞ` : 'EN ALT KLASMAN'}</span>
                <b>{down != null ? `${number.format(down)} kişi geçerse düşer` : 'Altta klasman yok'}</b>
              </div>
            </div>
            <div className="meter-track" role="img" aria-label={`${tier.short} klasmanındaki ${number.format(size)} oyuncu arasında ${number.format(selected.rank)}. sıradasın`}>
              <i className="meter-fill" style={{ width: `${position * 100}%` }} />
              <span className="meter-marker" data-edge={edge} style={{ left: `${position * 100}%` }}><em>#{number.format(selected.rank)}</em></span>
            </div>
          </div>
        })()}
      </div>
    </section> : data ? <section className="rank-system">
      <div className="rank-intro"><span className="eyebrow">KLASMANLAR</span><h2>Agahbey</h2></div>
      <div className="rank-ladder">{classCounts.map((item, i) => <div className={`rank-row rank-${i}`} key={item.short}><b>{item.short}</b><span>KLASMANI</span><i/><small>{number.format(item.count)} OYUNCU</small></div>)}</div>
    </section> : null}
    <section className="data-strip"><div><span>ARENA</span><strong>SF2CE</strong></div><div><span>KAYITLI OYUNCU</span><strong>{data ? number.format(data.totalPlayers) : '—'}</strong></div><p>HADOUKEN! <i>勝負</i></p><div><span>SON GÜNCELLEME</span><strong>{data ? new Date(data.lastUpdated).toLocaleDateString('tr-TR') : '—'}</strong></div></section>
    <footer><span>rank.sf2blacklist.fun / FIGHTCADE ARŞİVİ</span><p>Veriler Fightcade sıralama arşivinden derlenmiştir.</p><b>© 2026</b></footer>
  </main>
}
