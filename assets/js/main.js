/* Windy Peaks Brewery & Steakhouse — shared site behaviour
   Nav toggle, scroll-aware header, GSAP scroll reveals, tabs, lightbox,
   back-to-top. Everything degrades gracefully with GSAP absent or
   prefers-reduced-motion set. */

(function () {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.remove("no-js");

  /* ---------------- Mobile nav drawer ---------------- */
  function initNav() {
    const toggleBtns = document.querySelectorAll(".nav-toggle");
    const drawer = document.getElementById("nav-drawer");
    if (!drawer) return;

    function openDrawer() {
      drawer.classList.add("is-open");
      document.body.classList.add("nav-open");
      toggleBtns.forEach((b) => b.setAttribute("aria-expanded", "true"));
      const firstLink = drawer.querySelector("a");
      if (firstLink) firstLink.focus({ preventScroll: true });
    }
    function closeDrawer() {
      drawer.classList.remove("is-open");
      document.body.classList.remove("nav-open");
      toggleBtns.forEach((b) => b.setAttribute("aria-expanded", "false"));
    }

    toggleBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        drawer.classList.contains("is-open") ? closeDrawer() : openDrawer();
      });
    });
    drawer.querySelectorAll("a, [data-nav-close]").forEach((el) =>
      el.addEventListener("click", closeDrawer)
    );
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && drawer.classList.contains("is-open")) closeDrawer();
    });
  }

  /* ---------------- Scroll-aware header ---------------- */
  function initHeaderScroll() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------------- Back to top ---------------- */
  function initBackToTop() {
    const btn = document.querySelector(".back-to-top");
    if (!btn) return;
    window.addEventListener(
      "scroll",
      () => btn.classList.toggle("is-visible", window.scrollY > 600),
      { passive: true }
    );
    btn.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" })
    );
  }

  /* ---------------- Tabs (menu categories, etc.) ---------------- */
  function initTabs() {
    document.querySelectorAll("[data-tabs]").forEach((group) => {
      const buttons = group.querySelectorAll("[data-tab-target]");
      const panels = group.querySelectorAll("[data-tab-panel]");
      function activate(id, updateHash) {
        buttons.forEach((b) => {
          const on = b.dataset.tabTarget === id;
          b.classList.toggle("is-active", on);
          b.setAttribute("aria-selected", on ? "true" : "false");
        });
        panels.forEach((p) => (p.hidden = p.dataset.tabPanel !== id));
        if (updateHash && history.replaceState) {
          history.replaceState(null, "", `#${id}`);
        }
      }
      buttons.forEach((b) =>
        b.addEventListener("click", () => activate(b.dataset.tabTarget, true))
      );
      const fromHash = window.location.hash.replace("#", "");
      const initial = [...buttons].some((b) => b.dataset.tabTarget === fromHash)
        ? fromHash
        : buttons[0] && buttons[0].dataset.tabTarget;
      if (initial) activate(initial, false);
    });
  }

  /* ---------------- Lightbox (gallery) ---------------- */
  function initLightbox() {
    const triggers = document.querySelectorAll("[data-lightbox]");
    if (!triggers.length) return;
    const overlay = document.createElement("div");
    overlay.className = "lightbox";
    overlay.innerHTML = `
      <button type="button" class="lightbox__close" aria-label="Close">&times;</button>
      <button type="button" class="lightbox__prev" aria-label="Previous image">&larr;</button>
      <div class="lightbox__stage"></div>
      <p class="lightbox__caption"></p>
      <button type="button" class="lightbox__next" aria-label="Next image">&rarr;</button>`;
    document.body.appendChild(overlay);
    const stage = overlay.querySelector(".lightbox__stage");
    const captionEl = overlay.querySelector(".lightbox__caption");
    const items = [...triggers];
    let idx = 0;

    function render() {
      const source = items[idx].matches("figure") ? items[idx] : items[idx].querySelector("figure");
      const el = source || items[idx];
      const visual = el.querySelector(":scope > :not(figcaption)");
      const caption = el.querySelector("figcaption");
      stage.innerHTML = (visual || el).innerHTML;
      captionEl.textContent = caption ? caption.textContent : "";
    }
    function open(i) {
      idx = i;
      render();
      overlay.classList.add("is-open");
      document.body.classList.add("nav-open");
    }
    function close() {
      overlay.classList.remove("is-open");
      document.body.classList.remove("nav-open");
    }
    function step(dir) {
      idx = (idx + dir + items.length) % items.length;
      render();
    }

    items.forEach((el, i) => el.addEventListener("click", () => open(i)));
    overlay.querySelector(".lightbox__close").addEventListener("click", close);
    overlay.querySelector(".lightbox__prev").addEventListener("click", () => step(-1));
    overlay.querySelector(".lightbox__next").addEventListener("click", () => step(1));
    overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
    document.addEventListener("keydown", (e) => {
      if (!overlay.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    });
  }

  /* ---------------- GSAP scroll reveals ---------------- */
  function initReveals() {
    document.body.classList.add("js-ready");
    if (typeof gsap === "undefined") {
      document.querySelectorAll("[data-reveal]").forEach((el) => (el.style.opacity = 1));
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    if (prefersReduced) {
      gsap.set("[data-reveal]", { opacity: 1, y: 0, x: 0 });
    } else {
      document.querySelectorAll("[data-reveal-group]").forEach((group) => {
        const targets = group.querySelectorAll("[data-reveal]");
        gsap.fromTo(
          targets,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.09,
            scrollTrigger: { trigger: group, start: "top 82%", once: true },
          }
        );
      });
      document.querySelectorAll("[data-reveal]:not([data-reveal-group] [data-reveal])").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          }
        );
      });

      /* Hero entrance */
      const hero = document.querySelector("[data-hero-anim]");
      if (hero) {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.fromTo(hero.querySelectorAll(".word"), { opacity: 0, y: "100%" }, { opacity: 1, y: "0%", duration: 0.9, stagger: 0.05 })
          .fromTo(hero.querySelectorAll("[data-hero-fade]"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7 }, "-=0.5");
      }

      /* Subtle hero parallax */
      document.querySelectorAll("[data-parallax]").forEach((el) => {
        gsap.to(el, {
          yPercent: parseFloat(el.dataset.parallax) || 12,
          ease: "none",
          scrollTrigger: { trigger: el.closest("[data-parallax-wrap]") || el, start: "top bottom", end: "bottom top", scrub: true },
        });
      });

      /* Number counters */
      document.querySelectorAll("[data-count]").forEach((el) => {
        const end = parseFloat(el.dataset.count);
        const decimals = (el.dataset.count.split(".")[1] || "").length;
        const counter = { val: 0 };
        gsap.to(counter, {
          val: end,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          onUpdate: () => (el.textContent = counter.val.toFixed(decimals)),
        });
      });
    }
  }

  /* Split hero heading into word spans for line-reveal animation */
  function splitHeroWords() {
    document.querySelectorAll("[data-hero-anim] [data-split]").forEach((el) => {
      const words = el.textContent.trim().split(/\s+/);
      el.innerHTML = words
        .map((w) => `<span class="word-wrap"><span class="word">${w}</span></span>`)
        .join(" ");
    });
  }

  /* ---------------- Contact / reservation fallback form ---------------- */
  function initForms() {
    document.querySelectorAll("form[data-static-form]").forEach((form) => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const status = form.querySelector("[data-form-status]");
        const btn = form.querySelector('[type="submit"]');
        if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = "Sending..."; }
        window.setTimeout(() => {
          form.hidden = true;
          const confirmEl = form.parentElement.querySelector("[data-form-confirm]");
          if (confirmEl) confirmEl.hidden = false;
          if (status) status.textContent = "";
        }, 700);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initNav();
    initHeaderScroll();
    initBackToTop();
    initTabs();
    initLightbox();
    splitHeroWords();
    initReveals();
    initForms();
  });
})();
