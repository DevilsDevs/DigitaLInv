// Mobile Navigation Toggle
const navToggle = document.querySelector(".nav-toggle")
const navMenu = document.querySelector(".nav-menu")

navToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active")

  // Animate hamburger icon
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

// Close menu when clicking on a link
document.querySelectorAll(".nav-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active")
    const spans = navToggle.querySelectorAll("span")
    spans[0].style.transform = "none"
    spans[1].style.opacity = "1"
    spans[2].style.transform = "none"
  })
})

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      const headerOffset = 60
      const elementPosition = target.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  })
})

// Carousel Functionality
const carouselTrack = document.querySelector(".carousel-track")
const slides = document.querySelectorAll(".carousel-slide")
const prevBtn = document.querySelector(".carousel-prev")
const nextBtn = document.querySelector(".carousel-next")
const dotsContainer = document.querySelector(".carousel-dots")

let currentSlide = 0
const totalSlides = slides.length

// Create dots
for (let i = 0; i < totalSlides; i++) {
  const dot = document.createElement("div")
  dot.classList.add("carousel-dot")
  if (i === 0) dot.classList.add("active")
  dot.addEventListener("click", () => goToSlide(i))
  dotsContainer.appendChild(dot)
}

const dots = document.querySelectorAll(".carousel-dot")

function updateCarousel() {
  slides.forEach((slide, index) => {
    slide.classList.remove("active")
    if (index === currentSlide) {
      slide.classList.add("active")
    }
  })

  dots.forEach((dot, index) => {
    dot.classList.remove("active")
    if (index === currentSlide) {
      dot.classList.add("active")
    }
  })
}

function goToSlide(index) {
  currentSlide = index
  updateCarousel()
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides
  updateCarousel()
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides
  updateCarousel()
}

nextBtn.addEventListener("click", nextSlide)
prevBtn.addEventListener("click", prevSlide)

// Auto-advance carousel
let carouselInterval = setInterval(nextSlide, 5000)

// Pause auto-advance on hover
carouselTrack.addEventListener("mouseenter", () => {
  clearInterval(carouselInterval)
})

carouselTrack.addEventListener("mouseleave", () => {
  carouselInterval = setInterval(nextSlide, 5000)
})

// Countdown Timer
function updateCountdown() {
  const countdownElement = document.getElementById("countdown-timer")

  // Get current time
  const now = new Date()

  // Set target time to end of day
  const endOfDay = new Date()
  endOfDay.setHours(23, 59, 59, 999)

  // Calculate difference
  const diff = endOfDay - now

  // Calculate hours, minutes, seconds
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  // Format with leading zeros
  const formattedTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`

  countdownElement.textContent = formattedTime
}

// Update countdown every second
updateCountdown()
setInterval(updateCountdown, 1000)

// Form Submission
const contactForm = document.querySelector(".contact-form")

contactForm.addEventListener("submit", (e) => {
  e.preventDefault()

  // Get form data
  const formData = new FormData(contactForm)
  const data = Object.fromEntries(formData)

  // Here you would typically send the data to a server
  console.log("Form submitted:", data)

  // Show success message
  alert("¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.")

  // Reset form
  contactForm.reset()
})

// Scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1"
      entry.target.style.transform = "translateY(0)"
    }
  })
}, observerOptions)

// Observe elements for animation
document.querySelectorAll(".pricing-card, .gallery-item, .event-card").forEach((el) => {
  el.style.opacity = "0"
  el.style.transform = "translateY(20px)"
  el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
  observer.observe(el)
})

// Header scroll effect
let lastScroll = 0
const header = document.querySelector(".header")

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset

  if (currentScroll > lastScroll && currentScroll > 100) {
    header.style.transform = "translateY(-100%)"
  } else {
    header.style.transform = "translateY(0)"
  }

  lastScroll = currentScroll
})
