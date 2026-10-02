/* Renders the gift-certificate images uploaded to the Stripe Payment Links
   (Stripe dashboard ▸ Product catalogue ▸ each certificate ▸ Image).
   Stripe keeps its own copy, so after changing a tier or the terms here,
   run this and upload the new PNGs again:

     node scripts/stripe-product-images.mjs [out-dir]

   Writes <out-dir>/cert-<amount>.png (and cert-custom.png); out-dir
   defaults to stripe-product-images. */

import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { tmpdir } from 'node:os'
import { pathToFileURL } from 'node:url'
import { giftCertificates } from '../src/data/giftsData.js'

const OUT  = resolve(process.argv[2] || 'stripe-product-images')
const SIZE = 1000
const CHROME = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
].find(p => p && existsSync(p))
if (!CHROME) throw new Error('No Chrome/Edge found; set CHROME_PATH')

/* The Spa Rivier logo, inlined so the headless browser needs no file access */
const LOGO = 'data:image/svg+xml;base64,' + readFileSync(resolve('public/logo-cert.svg')).toString('base64')

const ink   = c => (c.dark ? c.goldColor : c.accentColor)
const title = c => !c.label ? 'Spa Rivier' : c.label.startsWith('Spa Rivier') ? c.label : `Spa Rivier ${c.label}`

/* lucide "gift", as on the site */
const giftIcon = color => `<svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg>`

function page(c, amountText) {
  const muted = c.dark ? 'rgba(255,255,255,0.6)' : c.accentColor
  const bars = Array.from({ length: 34 }, (_, i) =>
    `<i style="width:${i % 5 === 0 ? 5 : i % 3 === 0 ? 3 : 2}px"></i>`).join('')
  return `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,200;0,300;0,400;0,600;0,700;1,300;1,400&display=swap" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:${SIZE}px;height:${SIZE}px;background:${c.bg};font-family:Poppins,sans-serif}
  .card{position:absolute;inset:0;background:${c.gradient};display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:84px 100px 84px;text-align:center;color:${c.textColor}}
  .frame{position:absolute;inset:40px;border:1.5px solid ${c.borderColor};border-radius:10px}
  .k{position:absolute;width:90px;height:90px;border-color:${c.borderColor};border-style:solid;border-width:0}
  .logo{width:150px;height:150px;border-radius:50%;background:#fff;border:1.5px solid ${c.borderColor};display:flex;align-items:center;justify-content:center;margin:0 auto 18px}
  .logo img{height:70%;width:auto;display:block}
  .medal{width:72px;height:72px;border-radius:50%;border:2px solid ${ink(c)};display:flex;align-items:center;justify-content:center;margin:0 auto 18px}
  .medal svg{width:38px;height:38px}
  .label{font-weight:700;font-size:30px;letter-spacing:.16em;text-transform:uppercase;color:${ink(c)}}
  .title{font-weight:300;font-style:italic;font-size:44px;margin-top:8px;color:${c.dark ? '#fff' : c.textColor}}
  .rule{width:100%;height:2px;background:linear-gradient(to right,transparent,${c.borderColor},transparent)}
  .amount{font-weight:300;font-size:${amountText.length > 5 ? 150 : 190}px;line-height:1;letter-spacing:-.02em;color:${c.accentColor};${c.dark ? `text-shadow:0 0 60px ${c.shimmer}` : ''}}
  .sub{font-style:italic;font-weight:300;font-size:34px;margin-top:18px;color:${muted}}
  .bars{display:flex;gap:4px;justify-content:center;opacity:.4}
  .bars i{display:block;height:44px;background:${c.dark ? c.accentColor : c.textColor}}
  .terms{font-weight:600;font-size:27px;letter-spacing:.14em;text-transform:uppercase;color:${ink(c)};line-height:1.6}
  .site{font-weight:600;font-size:22px;letter-spacing:.24em;text-transform:uppercase;color:${muted};margin-top:14px;opacity:.85}
</style></head><body><div class="card">
  <div class="frame"></div>
  <div class="k" style="top:24px;left:24px;border-top-width:2px;border-left-width:2px"></div>
  <div class="k" style="top:24px;right:24px;border-top-width:2px;border-right-width:2px"></div>
  <div class="k" style="bottom:24px;left:24px;border-bottom-width:2px;border-left-width:2px"></div>
  <div class="k" style="bottom:24px;right:24px;border-bottom-width:2px;border-right-width:2px"></div>
  <div><div class="logo"><img src="${LOGO}" alt="Spa Rivier"></div><div class="medal">${giftIcon(ink(c))}</div><p class="label">Gift Certificate</p><p class="title">${title(c)}</p></div>
  <div class="rule"></div>
  <div><p class="amount">${amountText}</p>${c.subtitle ? `<p class="sub">${c.subtitle}</p>` : ''}</div>
  <div class="bars">${bars}</div>
  <div class="rule"></div>
  <div><p class="terms">Never expires<br>Services &amp; boutique</p><p class="site">sparivier.ca</p></div>
</div></body></html>`
}

function shoot(name, html) {
  const htmlPath = resolve(tmpdir(), `${name}.html`)
  writeFileSync(htmlPath, html)
  execFileSync(CHROME, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
    `--window-size=${SIZE},${SIZE}`, '--virtual-time-budget=4000',
    `--screenshot=${resolve(OUT, `${name}.png`)}`, pathToFileURL(htmlPath).href,
  ], { stdio: 'ignore' })
  console.log(resolve(OUT, `${name}.png`))
}

mkdirSync(OUT, { recursive: true })
for (const c of giftCertificates) shoot(`cert-${c.amount}`, page(c, '$' + c.amount.toLocaleString('en-CA')))
shoot('cert-custom', page({ ...giftCertificates[0], label: null, subtitle: 'Any amount you choose' }, 'Gift'))
