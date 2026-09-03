---
name: frontend-wedding-design
description: Use ONLY when editing HTML/CSS/JS for wedding invitation templates or the DigitaLInv landing — covers mobile-first, CSS variables theming, typography, performance, a11y, and reusable wedding components.
---

# Frontend Wedding Design

Expert frontend system for wedding invitation templates (bodas, XV, cumpleaños) and the DigitaLInv showcase landing. Applies to `DigitaLInv/Principal/**` and `LogicaRSVP_Plantillas/*.html|css/*.css|js/*.js`.

## 1. Architecture principles

- **Build allowed IF GitHub Pages compatible** — libraries/frameworks are permitted **only** when the final artifact is static (`index.html`+`css`+`js` deployable on GitHub Pages): Astro/Eleventy/Vite build, Next.js `output:'export'`, Tailwind via CDN without build, client-side libs via CDN (qrcodejs, lightbox). **Forbidden** anything needing persistente SSR/server runtime or ports (Next.js API routes in static deploy, Node in prod). Default to plain HTML/CSS/JS for the 3 `boda-*` while <10 themes; migrate to static Astro if >5 themes (see `docs/FRONTEND.md` §4).
- Each `boda-*` is self-contained (`index.html` + `css/` + `js/` + `img/`).
- **One layout, N themes** — single HTML structure per plantilla; theming is ONLY via `:root` CSS variables. Never duplicate 1700 lines per theme. Each theme file overrides ` --color-*`.
- **Mobile-first**: base styles target 320px. Breakpoints: `@media (min-width: 600px)` tablet, `@media (min-width: 1024px)` desktop. Never use `max-width` chains; consolidate.
- **Separate concerns**: `index.html` (semántico), `css/index.css` (layout + variables + responsive), `js/script.js` (progressive enhancement). No inline `style` salvo fallback.

## 2. HTML semantics

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Boda de Laura & Daniel</title>
  <meta name="description" content="Acompáñanos — Laura & Daniel, 14 de septiembre.">
  <link rel="canonical" href="https://example.com/plantillas/boda-clasica/">
  <!-- og/twitter with absolute urls, no real client domain -->
</head>
```

- Sections in order: `hero` (countdown + names), `wedding-section` (blessing/parents, details 3-box, itinerario timeline), `#galeria` collage, `#fotos`, `#regalos`, `nav.panel-navegacion`, `.lightbox`.
- Use `<section>` for top-level, `<div role="dialog" aria-modal="true">` for modal/lightbox, `<nav aria-label="Secciones">` for lateral nav.
- Always `lang="es"` for bodas.

## 3. CSS system

### Variables (define once in :root)

```css
:root {
  --color-primary: #486547;   /* theme accent */
  --color-primary-dark: #354d34;
  --color-bg: #f5f5f0;
  --color-surface: rgba(255,255,255,0.92);
  --color-text: #2d2d2d;
  --color-muted: #777;
  --font-display: 'Miama', cursive;
  --font-heading: 'Cormorant Garamond', serif;
  --font-body: 'DM Sans', system-ui, sans-serif;
  --radius-card: 20px;
  --shadow-card: 0 20px 60px rgba(72,101,71,0.15);
}
```

Themes override only variables: `boda-clasica` (salvia #486547), `boda-dorada` (oro #d4a373 / crema #fdf6e3), `boda-romantica` (rosa #c7728a / mauve #8b5a6b).

### Fonts

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://fonts.cdnfonts.com">
<link href="https://fonts.cdnfonts.com/css/miama" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=DM+Sans:wght@300;400&display=swap" rel="stylesheet">
```

### Layout patterns

- Hero: `position: relative; height: 100dvh;` image `object-fit: cover; width:100%; height:100%`.
- **Countdown hero must stay centered at 320px**: `.countdown-container{display:flex;flex-wrap:nowrap;justify-content:center;align-items:center;margin:0 auto}`, `.overlay-content{justify-content:center;gap:12px}`, `.countdown-unit span{white-space:nowrap}`. `flex-wrap:wrap` splits blocks and throws off-center — check at 320px.
- Details: `display: grid; gap: 24px;` 1 col mobile, 3 cols @1024px.
- Collage: `columns: 2` mobile, `columns: 3` desktop + `break-inside: avoid` (a dead image URL = ugly gap → validate all externals first).
- Timeline: vertical line `::before` centered, eventos alternados.

### Responsive (only min-width)

```css
/* base: 320px */
.details { grid-template-columns: 1fr; }
@media (min-width: 600px) { .collage { columns: 2; } }
@media (min-width: 1024px) { .details { grid-template-columns: repeat(3,1fr); } .collage { columns: 3; } }
```

### Performance / a11y in CSS

- Hero `img`: `loading="eager"` + `fetchpriority="high"`; gallery `loading="lazy"` `decoding="async"`.
- Video hero: always `poster="./resources/poster.png"` fallback; `preload="metadata"`.
- Respect `prefers-reduced-motion`:
```css
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
```
- Contrast ≥4.5:1, never pure white on cream without check.

## 4. JavaScript components

All in single `js/script.js`, guarded by feature detection.

### Countdown (fictitious date per plantilla)

```js
const weddingDate = new Date("2026-09-14T17:00:00"); // per boda
function updateOverlayCountdown() {
  const diff = weddingDate - new Date();
  if (diff <= 0) return;
  const d = Math.floor(diff/86400000), h = Math.floor(diff/3600000)%24, m = Math.floor(diff/60000)%60, s = Math.floor(diff/1000)%60;
  ({days:d,hours:h,minutes:m,seconds:s}); // update #days etc
}
setInterval(updateOverlayCountdown, 1000); updateOverlayCountdown();
```

### IntersectionObserver reveal

```js
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.style.opacity=1; e.target.style.transform='translateY(0)'; observer.unobserve(e.target);} });
}, {threshold: 0.2});
// init with opacity 0 + translateY(30px), then observe h1,h2,p,img,.box,.container-img
// wrap in `if(!matchMedia('(prefers-reduced-motion: reduce)').matches)`
```

### Lightbox gallery

- `querySelectorAll('.container-img .box-img img')` → `openLightbox(index)` → `classList.add('active')` + `body overflow hidden`.
- Controls: `#lightbox-close`, `#lightbox-prev`, `#lightbox-next`, backdrop click, `Esc/ArrowLeft/ArrowRight`.
- `alt` descriptivo por imagen, `aria-label` en botones.

### Navegación lateral

Active section = max visible area (`getBoundingClientRect` visibility). Smooth scroll on click, `scroll` passive listener, toggle `li.activo`.

### Música

```js
document.addEventListener('click', ()=>{ if(music.paused) music.play().catch(()=>{}); }, {once:true});
```
Never autoplay without interaction; never block render waiting for `ROSALIA.mp3`.

### QR (only LogicaRSVP)

- Parse `?datos=uuid`, fetch `/asistencia/qr/{uuid}` + `/wakeup` pig, `qrcodejs` via CDN `cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js`. Landing templates: no QR.

## 5. Assets

- Hero/gallery in landing: **stock Unsplash generic** (venue, floral, ring) — no real couple EXIF. Icons keep neutral PNGs (`anillo.png` lowercase!, `camera.png`, `iglesia_icon.png`, etc.).
- Use absolute sizes: hero 3600×2400 is too big — serve `w=1200` via Unsplash `?w=1200&q=80&auto=format`.
- Never commit `*.mp3` >5MB unless needed; defer music.
- **Local image paths are case-sensitive** (Linux/GitHub Pages). `src` must match the real file exactly (`./img/anillo.png`, NOT `./img/Anillo.png`) — a broken image breaks its whole container block, not just leaves a hole.
- **Do NOT reuse background/pattern assets as content photos**: `fondo.jpg` (repeat texture) must never stand in for a real reception/venue photo in details/gallery.
- **Validate every external URL → HTTP 200 before commit**, individually (batch Unsplash checks have flaky 404/200 from rate-limiting). Verified wedding IDs: `1519671482749-fd09be7ccebf`, `1519225421980-715cb0215aed`, `1519167758481-83f550bb49b3`, `1507679799987-c73779587ccf`, `1465495976277`, `1532712938310-34cb3982ef74`, `1511285560929-80b456fea0bc`, `1490481651871-ab68de25d43d`, `1495385794356`. Also reason that the image matches the section's concept (dress code = formal/elegant, reception = garden/banquet, ring = close-up).
- **Sidebar nav icons must be uniform**: same square canvas (512×512) + same color (gold silhouettes, RGB 160,128,64, ~66% scale, transparent bg). Normalize with PIL; `object-fit:contain` alone does NOT equalize different aspect ratios/colors. Keep distinct files for nav vs section (e.g. gold `nav-camera.png` for the side panel vs green `camera.png` for `#fotos`).

## 6. Checklist before commit

- [ ] No real names (Karen & Erick), maps, CLABE, wishlist hardcodeados en landing (`grep -R "Vellum\|Karen\|Erick\|012 225\|maps.app.goo.gl\|wishlist"`).
- [ ] `html lang="es"`, meta viewport, og/twitter canonical.
- [ ] Fonts with `display=swap` + `preconnect`.
- [ ] Hero `eager`/`fetchpriority`, gallery `lazy`, video `poster`.
- [ ] `prefers-reduced-motion` respected, `aria-label` on lightbox/nav, contrast ok.
- [ ] `@media` only `min-width:600px` / `1024px`, no duplicates.
- [ ] Countdown date is future fictitious matching plantilla header.
- [ ] Countdown centered + `nowrap` at 320px.
- [ ] **All local `src` resolve exactly (case-sensitive)** — verify file exists.
- [ ] **All external image URLs return 200** (checked individually); match section concept.
- [ ] **Sidebar icons uniform** 512×512 same-color; no dead gallery image gaps.
- [ ] Lightbox + nav + observer work at 320px/1024px (`python3 -m http.server`).
- [ ] `git fetch`/`pull --rebase` before `push` if `detrás N`.

## 7. Anti-patterns

- No `<a hr` unmatched tags.
- No JS commented blocks 50+ lines — delete or feature-flag.
- No `index_naranja.html → index.css` mismatch — themes link their own css.
- No `placeHolder.svg` with capital P — verify file exists.
- No `package.json` Next.js **when it can't build to static** — but frameworks ARE ok if they output static for GitHub Pages (`output:'export'`, Astro, CDN libs).
- No `./img/Anillo.png` (wrong case) — case-sensitive paths.
- No `fondo.jpg`/texture reused as a content photo.
- No dead Unsplash URL left in collapse (404 → 200 check first).
- No mismatch between CNAME domain and actual brand (e.g. `vellumdigitall.online` vs DigitalInv).
- No mixed-size/color sidebar icons in the same panel.

> Lessons source: `docs/ERRORES_APRENDIDOS.md` (2026-09-02).
