# DigitaLInv — Landing Principal

Landing showcase estático (HTML/CSS/JS sin build) que presenta los servicios de invitaciones digitales de **DigitalInv**.

## Estructura

```
Principal/
├── index.html          ← homepage (hero, eventos, planes, galería, contacto)
├── styles.css          ← estilos landing
├── script.js           ← carousel, countdown oferta, forms, observer
├── 404.html            ← 404 de ejemplo (sin datos reales)
├── Plantillas/
│   ├── boda-clasica/   ← Laura & Daniel — verde salvia (stock Unsplash)
│   ├── boda-dorada/    ← Ana & Luis — dorado/crema
│   └── boda-romantica/ ← Sofía & Mateo — rosa/mauve
└── README.md           ← este archivo
```

Cada `Plantilla/boda-*/` es autocontenida: `index.html` + `css/index.css` + `js/script.js` + `img/` (iconos neutros). Hero y galería usan **stock Unsplash externo** (no fotos reales de pareja). Todos los datos (nombres, fechas, direcciones, CLABE) son **ficticios**.

## Ver localmente

```bash
# desde Principal
python3 -m http.server 8000
# o
npx serve .
# homepage: http://localhost:8000/
# plantilla: http://localhost:8000/Plantillas/boda-clasica/
```

No requiere `npm install` ni build — es HTML plano. `package.json` anterior (Next.js 16) fue eliminado por ser código muerto.

## Plantillas — datos ficticios

| Plantilla | Pareja | Fecha ficticia | Lugar ficticio | Paleta |
|-----------|--------|----------------|----------------|--------|
| boda-clasica | Laura & Daniel | 14 septiembre 2026 17:00 | Jardín Los Olivos, Querétaro | verde salvia #486547 |
| boda-dorada | Ana & Luis | 18 octubre 2026 19:00 | Hacienda del Sol, Guanajuato | dorado #b89f5a / crema |
| boda-romantica | Sofía & Mateo | 07 noviembre 2026 18:30 | Villa Rosé, Puebla | rosa #c97b84 / mauve |

Hereda estructura funcional de `LogicaRSVP_Plantillas` (countdown, observer, lightbox, nav lateral) pero sin lógica backend/QR.

## Tecnologías

- HTML semántico, CSS variables para theming, JS vanilla (`IntersectionObserver`, lightbox, countdown).
- Tipografía: `Miama` (nombres), `Cormorant Garamond` (títulos), `DM Sans` (body) con `display=swap`.
- Imágenes: `loading="lazy"`/`eager` + `fetchpriority`, `prefers-reduced-motion` respetado.

## Notas

- No copiar datos reales (CLABE, maps, wishlist) de `LogicaRSVP_Plantillas` al landing.
- Para editar landing: cambia `index.html`/`styles.css`/`script.js`. Para plantilla: edita su `index.html`/`css/index.css`/`js/script.js`.
