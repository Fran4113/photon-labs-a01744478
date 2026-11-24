const rotatingWord = document.querySelector("#heroWord");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (rotatingWord && !reducedMotion) {
  const words = ["solar.", "limpia.", "inteligente."];
  let activeWord = 0;
  window.setInterval(() => {
    rotatingWord.classList.add("is-changing");
    window.setTimeout(() => {
      activeWord = (activeWord + 1) % words.length;
      rotatingWord.textContent = words[activeWord];
      rotatingWord.classList.remove("is-changing");
    }, 220);
  }, 2800);
}

const carousel = document.querySelector("#heroCarousel");
if (carousel) {
  const slides = [...carousel.querySelectorAll(".hero-slide")];
  const count = carousel.querySelector(".carousel-count");
  const caption = carousel.querySelector(".carousel-caption");
  const labels = [
    "Energía limpia para un futuro brillante",
    "La luz del sol se convierte en electricidad",
    "Tecnología solar para espacios cotidianos"
  ];
  let activeSlide = 0;
  let timer;

  const showSlide = (nextIndex) => {
    activeSlide = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, index) => slide.classList.toggle("is-active", index === activeSlide));
    if (count) count.innerHTML = `${String(activeSlide + 1).padStart(2, "0")} <span>/ ${String(slides.length).padStart(2, "0")}</span>`;
    if (caption) caption.textContent = labels[activeSlide];
  };
  const stopCarousel = () => window.clearInterval(timer);
  const startCarousel = () => {
    stopCarousel();
    if (!reducedMotion) timer = window.setInterval(() => showSlide(activeSlide + 1), 5600);
  };

  carousel.querySelectorAll(".carousel-arrow").forEach((button) => {
    button.addEventListener("click", () => {
      showSlide(activeSlide + (button.dataset.direction === "next" ? 1 : -1));
      startCarousel();
    });
  });
  carousel.addEventListener("pointerenter", stopCarousel);
  carousel.addEventListener("pointerleave", startCarousel);
  carousel.addEventListener("focusin", stopCarousel);
  carousel.addEventListener("focusout", (event) => {
    if (!carousel.contains(event.relatedTarget)) startCarousel();
  });
  showSlide(0);
  startCarousel();
}

if ("IntersectionObserver" in window && !reducedMotion) {
  const revealItems = document.querySelectorAll(".section-heading, .feature, .steps > div, .coming");
  document.body.classList.add("scroll-effects");
  revealItems.forEach((item, index) => {
    item.classList.add("scroll-reveal");
    item.style.setProperty("--reveal-delay", `${(index % 3) * 90}ms`);
  });
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => observer.observe(item));
}
