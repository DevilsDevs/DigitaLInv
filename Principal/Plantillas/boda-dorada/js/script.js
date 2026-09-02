document.addEventListener("DOMContentLoaded", () => {
    // Plantilla boda-dorada — Ana & Luis — genérica, sin backend
    // Countdown objetivo: 2026-10-18T19:00:00 (ficticio)

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
    const weddingDate = new Date("2026-10-18T19:00:00");
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
            return ["galeria", "itinerario", "fotos", "regalos"]
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

    /* 6. Modal regalos (genérico, sin CLABE real) */
    const modal = document.getElementById('cuenta-modal');
    if (modal) {
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.style.display='none'; });
    }
});
