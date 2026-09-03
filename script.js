// ========================================================
// DigitalInv Landing — interactivo (AOS, Swiper, GLightbox)
// ========================================================

document.addEventListener("DOMContentLoaded", () => {
  /* 1. Mobile Navigation Toggle */
  const navToggle = document.querySelector(".nav-toggle")
  const navMenu = document.querySelector(".nav-menu")
  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active")
    const spans = navToggle.querySelectorAll("span")
    if (navMenu.classList.contains("active")) {
      spans[0].style.transform = "rotate(45deg) translateY(8px)"
      spans[1].style.opacity = "0"
      spans[2].style.transform = "rotate(-45deg) translateY(-8px)"
    } else {
      spans[0].style.transform = "none"
      spans[1].style.opacity = "1"
      spans[2].style.transform = "none"
    }
  })
  document.querySelectorAll(".nav-menu a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active")
      const spans = navToggle.querySelectorAll("span")
      spans[0].style.transform = "none"
      spans[1].style.opacity = "1"
      spans[2].style.transform = "none"
    })
  })

  /* 2. Smooth Scrolling (offset por header sticky) */
  const HEADER_OFFSET = 70
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"))
      if (!target) return
      e.preventDefault()
      const elementPosition = target.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET
      window.scrollTo({ top: elementPosition, behavior: "smooth" })
    })
  })

  /* 3. AOS animations (respeta prefers-reduced-motion) */
  if (window.AOS && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    AOS.init({ duration: 700, easing: "ease-out-cubic", once: true, offset: 40 })
  }

  /* 4. Carousel de eventos — Swiper (táctil, autoplay) */
  if (window.Swiper) {
    new Swiper("#eventos-carousel", {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      autoplay: { delay: 4500, disableOnInteraction: false },
      speed: 600,
      grabCursor: true,
      pagination: { el: ".swiper-pagination", clickable: true },
      navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
      breakpoints: {
        560: { slidesPerView: 2, spaceBetween: 20 },
        900: { slidesPerView: 3, spaceBetween: 24 }
      }
    })
  }

  /* 5. Countdown a fin de día (oferta) */
  const countdownElement = document.getElementById("countdown-timer")
  function pad(n) { return String(n).padStart(2, "0") }
  function updateCountdown() {
    if (!countdownElement) return
    const endOfDay = new Date()
    endOfDay.setHours(23, 59, 59, 999)
    const diff = endOfDay - new Date()
    const hours = Math.floor(diff / 3600000)
    const minutes = Math.floor((diff % 3600000) / 60000)
    const seconds = Math.floor((diff % 60000) / 1000)
    countdownElement.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
  }
  updateCountdown()
  setInterval(updateCountdown, 1000)

  /* 6. Header sticky con blur */
  const header = document.querySelector(".header")
  const backToTop = document.getElementById("back-to-top")
  function onScroll() {
    const scrolled = window.pageYOffset > 10
    header.classList.toggle("scrolled", scrolled)
    const showTop = window.pageYOffset > 400
    backToTop.classList.toggle("visible", showTop)
    backToTop.setAttribute("aria-hidden", showTop ? "false" : "true")
  }
  window.addEventListener("scroll", onScroll, { passive: true })
  onScroll()
  if (backToTop) backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  })

  /* 7. Galería — GLightbox preview */
  if (window.GLightbox) {
    GLightbox({ selector: ".glightbox-img", touchNavigation: true, loop: true, zoomable: true })
  }

  /* 8. Formulario — toast en vez de alert */
  const contactForm = document.querySelector(".contact-form")
  function showToast(msg) {
    let toast = document.querySelector(".toast")
    if (!toast) {
      toast = document.createElement("div")
      toast.className = "toast"
      document.body.appendChild(toast)
    }
    toast.textContent = msg
    toast.classList.add("show")
    setTimeout(() => toast.classList.remove("show"), 3200)
  }
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const data = Object.fromEntries(new FormData(contactForm))
      console.log("Form submitted:", data)
      showToast("¡Gracias! Nos pondremos en contacto contigo pronto.")
      contactForm.reset()
    })
  }
})
