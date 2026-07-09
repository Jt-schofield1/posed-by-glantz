# Posed By Glantz

One-page marketing site for **Posed By Glantz** — the bodybuilding posing-coaching business of Jake Glantzman (NJ). Sells 1-on-1 posing sessions and drives conversion to WhatsApp.

Visual direction: *"The Great Wave"* — dark ink-navy backgrounds, gold/champagne metallic accents, cream serif type, Japanese wave artwork, kanji accents (波 = wave).

## Stack

Zero-dependency static site — plain HTML, CSS, and vanilla JS. No build step.

- `index.html` — all six sections, nav, and lightbox markup
- `styles.css` — base tokens, keyframes, responsive breakpoint (≤900px = mobile)
- `app.js` — hover states, mobile menu, scroll reveals, active-section nav, parallax, lightbox
- `images/` — client photos + gold-on-dark wave art

The desktop and mobile hero are two entirely different layouts; the ≤900px breakpoint swaps them (and all other responsive layout) via CSS, matching the original design 1:1.

## Run locally

Any static server, e.g.:

```bash
python -m http.server 5050
# open http://localhost:5050
```

## Deploy

Static — deploys to Vercel with zero config (framework preset: **Other**, no build command, output = repo root).

## Contact targets

- WhatsApp: `https://wa.me/17329620576` (732-962-0576)
- Instagram: `https://instagram.com/imglantz` (@imglantz)
