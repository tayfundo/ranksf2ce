import type { Lang } from './i18n'

const LANG_CSS = `
.top-tools{position:fixed;top:10px;right:10px;z-index:50;display:flex;align-items:center;gap:8px}
.top-tools .visitor-badge{position:static}
.lang-switch{display:flex;height:22px;border-radius:3px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.35)}
.lang-switch button{border:0;cursor:pointer;padding:0 9px;font:500 10px/22px 'DM Mono',monospace;letter-spacing:.12em;background:#1b2b45;color:#cfe6ff}
.lang-switch button[aria-pressed='true']{background:#47a8ff;color:#061329;font-weight:700}
.lang-switch button:focus-visible{outline:2px solid #fff;outline-offset:-2px}
`

export default function LangSwitch({ lang, onChange, label }: { lang: Lang; onChange: (l: Lang) => void; label: string }) {
  return (
    <div className="lang-switch" role="group" aria-label={label}>
      <style>{LANG_CSS}</style>
      <button type="button" aria-pressed={lang === 'tr'} onClick={() => onChange('tr')}>TR</button>
      <button type="button" aria-pressed={lang === 'en'} onClick={() => onChange('en')}>EN</button>
    </div>
  )
}
