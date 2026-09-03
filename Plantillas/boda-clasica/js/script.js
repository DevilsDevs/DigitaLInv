document.addEventListener("DOMContentLoaded", () => {
    // Plantilla boda-clasica — Laura & Daniel — demo, sin backend
    // Countdown objetivo: 2026-09-14T17:00:00 (ficticio)

    /* 1. IntersectionObserver reveal */
    const fadeElements = document.querySelectorAll("h1, h2, p, img, .box, .container-img");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduceMotion) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.transition = "opacity 0.4s ease, transform 0.4s ease";
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = "translateY(0)";
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        fadeElements.forEach(el => {
            el.style.opacity = 0;
            el.style.transform = "translateY(30px)";
            observer.observe(el);
        });
    }

    /* 2. Música — solo tras interacción */
    const music = document.getElementById("bg-music");
    if (music) {
        document.addEventListener("click", () => {
            if (music.paused) music.play().catch(() => {});
        }, { once: true });
    }

    /* 3. Countdown */
    const weddingDate = new Date("2026-09-14T17:00:00");
    function updateOverlayCountdown() {
        const diff = weddingDate - new Date();
        if (diff <= 0) return;
        const d = Math.floor(diff / 86400000);
        const h = Math.floor(diff / 3600000) % 24;
        const m = Math.floor(diff / 60000) % 60;
        const s = Math.floor(diff / 1000) % 60;
        const map = { days: d, hours: h, minutes: m, seconds: s };
        Object.entries(map).forEach(([id, val]) => {
            const el = document.getElementById(id);
            if (el && el.firstChild) el.firstChild.textContent = val.toString().padStart(2, "0");
        });
    }
    setInterval(updateOverlayCountdown, 1000);
    updateOverlayCountdown();

    /* 4. Navegación lateral activa */
    const menuLinks = document.querySelectorAll(".panel-navegacion ul li a");
    if (menuLinks.length) {
        function activarMenu(id) {
            menuLinks.forEach(link => {
                link.parentElement.classList.toggle("activo", link.getAttribute("href") === `#${id}`);
            });
        }
        function getSectionInView() {
            return ["itinerario", "galeria", "fotos", "qr-demo", "regalos"]
                .map(id => ({ id, el: document.getElementById(id) }))
                .filter(s => s.el)
                .reduce((best, sec) => {
                    const r = sec.el.getBoundingClientRect();
                    const visible = Math.max(0, Math.min(innerHeight, r.bottom) - Math.max(0, r.top));
                    return visible > best.visible ? { id: sec.id, visible } : best;
                }, { id: null, visible: 0 }).id;
        }
        window.addEventListener("scroll", () => {
            const current = getSectionInView();
            if (current) activarMenu(current);
        }, { passive: true });
        menuLinks.forEach(link => {
            link.addEventListener("click", e => {
                e.preventDefault();
                document.querySelector(link.getAttribute("href"))?.scrollIntoView({ behavior: "smooth" });
            });
        });
    }

    /* 5. Lightbox galería */
    const galleryImages = document.querySelectorAll('.container-img .box-img img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    let currentImageIndex = 0;
    const imageSources = Array.from(galleryImages).map(img => img.src);
    function openLightbox(index) {
        currentImageIndex = index;
        lightboxImg.src = imageSources[currentImageIndex];
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + imageSources.length) % imageSources.length;
        lightboxImg.src = imageSources[currentImageIndex];
    }
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % imageSources.length;
        lightboxImg.src = imageSources[currentImageIndex];
    }
    galleryImages.forEach((img, index) => {
        img.addEventListener('click', () => openLightbox(index));
        img.setAttribute('loading', 'lazy');
        img.setAttribute('decoding', 'async');
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImage);
    if (lightboxNext) lightboxNext.addEventListener('click', showNextImage);
    if (lightbox) lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => {
        if (!lightbox || !lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'ArrowRight') showNextImage();
    });

    /* 6. Modal regalos (demo, sin CLABE real) */
    const modal = document.getElementById('cuenta-modal');
    if (modal) {
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.style.display='none'; });
    }

    /* 7. QR DEMO interactivo — ejemplo con qrcodejs, sin backend */
    const qrDemo = document.getElementById('qrcode-demo');
    const qrLarge = document.getElementById('qrcode-large');
    const qrFrame = document.getElementById('qr-frame');
    const qrLightbox = document.getElementById('qr-lightbox');
    const qrLightboxClose = document.getElementById('qr-lightbox-close');
    const btnConfirm = document.getElementById('btn-confirm');
    const btnDecline = document.getElementById('btn-decline');
    const qrEstado = document.getElementById('qr-estado');
    const cfg = window.QR_DEMO_CONFIG || { text: 'DEMO-DIGITALINV', guest: 'Demo', personas: 2, mesa: 5 };

    if (qrDemo && window.QRCode) {
        // QR pequeño 200x200
        new QRCode(qrDemo, {
            text: cfg.text,
            width: 200,
            height: 200,
            colorDark: "#1a1a1a",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.M
        });
        // QR grande para lightbox 280x280
        if (qrLarge) {
            new QRCode(qrLarge, {
                text: cfg.text,
                width: 280,
                height: 280,
                colorDark: "#1a1a1a",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.M
            });
        }
        // Interacción: click en frame abre lightbox
        function openQrLightbox() {
            qrLightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        function closeQrLightbox() {
            qrLightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
        if (qrFrame) {
            qrFrame.addEventListener('click', openQrLightbox);
            qrFrame.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openQrLightbox(); }});
        }
        if (qrLightbox) {
            qrLightbox.addEventListener('click', (e) => { if (e.target === qrLightbox) closeQrLightbox(); });
        }
        if (qrLightboxClose) qrLightboxClose.addEventListener('click', closeQrLightbox);
        document.addEventListener('keydown', (e) => {
            if (qrLightbox && qrLightbox.classList.contains('active') && e.key === 'Escape') closeQrLightbox();
        });

        // Botones RSVP demo — actualizan estado localmente
        function setEstado(tipo) {
            if (!qrEstado) return;
            qrEstado.classList.remove('pendiente','confirmado','declinado');
            if (tipo === 'confirmado') {
                qrEstado.textContent = 'Confirmado ✓';
                qrEstado.classList.add('confirmado');
                // feedback visual
                btnConfirm.textContent = '¡Confirmado!';
                btnConfirm.disabled = true;
                btnDecline.disabled = false;
                btnDecline.textContent = '✕ No podré';
            } else if (tipo === 'declinado') {
                qrEstado.textContent = 'No asistirá';
                qrEstado.classList.add('declinado');
                btnDecline.textContent = 'Registrado';
                btnDecline.disabled = true;
                btnConfirm.disabled = false;
                btnConfirm.textContent = '✓ Confirmar';
            }
            // pequeña animación
            qrEstado.animate([{ transform: 'scale(0.9)' }, { transform: 'scale(1)' }], { duration: 200 });
        }
        if (btnConfirm) btnConfirm.addEventListener('click', () => setEstado('confirmado'));
        if (btnDecline) btnDecline.addEventListener('click', () => {
            if (confirm('¿Confirmas que no podrás asistir? (demo)')) setEstado('declinado');
        });
    }

    /* 8. Paleta interactiva — click copia hex y feedback */
    document.querySelectorAll('.color-circle').forEach(circle => {
        circle.style.cursor = 'pointer';
        circle.title = 'Click para copiar color';
        circle.addEventListener('click', () => {
            const bg = circle.style.backgroundColor;
            // Convertir rgb a hex si es necesario — fallback usa computed style hex via estilo inline
            let hex = circle.getAttribute('style').match(/#[0-9a-fA-F]{6}/);
            hex = hex ? hex[0] : bg;
            if (navigator.clipboard) navigator.clipboard.writeText(hex).catch(()=>{});
            // feedback visual
            circle.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.25)' }, { transform: 'scale(1)' }], { duration: 280 });
            const tip = document.createElement('span');
            tip.textContent = hex + ' copiado';
            tip.style.cssText = 'position:absolute; background:#1a1a1a; color:white; font-size:0.7rem; padding:4px 8px; border-radius:6px; transform:translate(-50%, -36px); white-space:nowrap; pointer-events:none;';
            circle.style.position = 'relative';
            circle.appendChild(tip);
            setTimeout(()=> tip.remove(), 1200);
        });
    });

    /* 9. Details box interacción — click expande */
    document.querySelectorAll('.details .box').forEach(box => {
        box.style.cursor = 'pointer';
        box.addEventListener('click', (e) => {
            if (e.target.closest('button') || e.target.closest('a')) return;
            box.classList.toggle('box-expanded');
        });
    });

});
