---
name: frontend-wedding-design
description: Use ONLY when editing HTML/CSS/JS for wedding invitation templates or the DigitaLInv landing — covers mobile-first, CSS variables theming, typography, performance, a11y, and reusable wedding components.
---

# Frontend Wedding Design

Expert frontend system for wedding invitation templates (bodas, XV, cumpleaños) and the DigitaLInv showcase landing. Applies to `DigitaLInv/Principal/**` and `LogicaRSVP_Plantillas/*.html|css/*.css|js/*.js`.

## 1. Architecture principles

- **No build step** — plain HTML/CSS/JS, no bundler. Each `boda-*` is self-contained (`index.html` + `css/` + `js/` + `img/`). No Next.js, no Tailwind build, no npm `dev` script.
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
- Details: `display: grid; gap: 24px;` 1 col mobile, 3 cols @1024px.
- Collage: `columns: 2` mobile, `columns: 3` desktop + `break-inside: avoid`.
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

- Hero/gallery in landing: **stock Unsplash generic** (venue, floral, ring) — no real couple EXIF. Icons keep neutral PNGs (`Anillo.png`, `camera.png`, `iglesia_icon.png`, etc.).
- Use absolute sizes: hero 3600×2400 is too big — serve `w=1200` via Unsplash `?w=1200&q=80&auto=format`.
- Never commit `*.mp3` >5MB unless needed; defer music.

## 6. Checklist before commit

- [ ] No real names (Karen & Erick), maps, CLABE, wishlist hardcodeados en landing.
- [ ] `html lang="es"`, meta viewport, og/twitter canonical.
- [ ] Fonts with `display=swap` + `preconnect`.
- [ ] Hero `eager`/`fetchpriority`, gallery `lazy`, video `poster`.
- [ ] `prefers-reduced-motion` respected, `aria-label` on lightbox/nav, contrast ok.
- [ ] `@media` only `min-width:600px` / `1024px`, no duplicates.
- [ ] Countdown date is future fictitious matching plantilla header.
- [ ] Lightbox + nav + observer work at 320px/1024px (`python3 -m http.server`).

## 7. Anti-patterns

- No `<a hr` unmatched tags.
- No JS commented blocks 50+ lines — delete or feature-flag.
- No `index_naranja.html → index.css` mismatch — themes link their own css.
- No `placeHolder.svg` with capital P — verify file exists.
- No `package.json` Next.js when project is static HTML.
