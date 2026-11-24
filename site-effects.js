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
