const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

if (!motionPreference.matches) {
  const transitionScreen = document.createElement("div");
  transitionScreen.className = "page-transition-screen";
  transitionScreen.setAttribute("aria-hidden", "true");
  transitionScreen.innerHTML = '<span class="transition-sun">☀</span><strong class="transition-message">La energía toma forma</strong>';
  document.body.append(transitionScreen);

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const destination = new URL(link.href, window.location.href);
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const nextPage = destination.pathname.split("/").pop() || "index.html";
    const isPageChange = destination.origin === window.location.origin && currentPage !== nextPage && ["index.html", "simulador.html"].includes(nextPage);
    if (!isPageChange) return;

    event.preventDefault();
    transitionScreen.querySelector(".transition-message").textContent = nextPage === "simulador.html"
      ? "La energía toma forma"
      : "Volviendo a Photon Labs";
    transitionScreen.classList.add("is-active");
    window.setTimeout(() => { window.location.href = destination.href; }, 520);
  });
}
