/* Shared header/footer, injected on every page so markup isn't duplicated
   across the site's static HTML files. Runs before DOMContentLoaded paint via
   document.write-free synchronous DOM insertion at script-tag position. */

(function () {
  const NAV_LINKS = [
    { href: "index.html", label: "Home" },
    { href: "menu.html", label: "Menu" },
    { href: "gallery.html", label: "Gallery" },
    { href: "gift-cards.html", label: "Gift Cards" },
    { href: "employment.html", label: "Employment" },
    { href: "contact.html", label: "Contact" },
  ];

  const RESERVE_HREF = "reservations.html";

  const logoIcon = `<img src="assets/img/logo-icon-tight.png" alt="" class="brand__mark">`;
  const logoMain = `<img src="assets/img/logo-main-tight.png" alt="Windy Peaks Brewery &amp; Steakhouse" class="footer__logo">`;

  function currentFile() {
    const path = window.location.pathname.split("/").pop();
    return path === "" ? "index.html" : path;
  }

  function buildHeader() {
    const current = currentFile();
    const items = NAV_LINKS.map(
      (l) =>
        `<li><a href="${l.href}"${l.href === current ? ' aria-current="page"' : ""}>${l.label}</a></li>`
    ).join("");

    const header = document.createElement("header");
    header.className = "site-header";
    header.innerHTML = `
      <div class="container">
        <a href="index.html" class="brand">
          ${logoIcon}
          <span>Windy Peaks<small>Brewery &amp; Steakhouse</small></span>
        </a>
        <nav class="nav-primary" aria-label="Primary">
          <ul>${items}</ul>
        </nav>
        <div class="cluster">
          <a href="${RESERVE_HREF}" class="btn btn--primary btn--sm nav-cta">Reserve a Table</a>
          <button type="button" class="nav-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="nav-drawer">
            <svg width="20" height="14" viewBox="0 0 20 14" fill="none" aria-hidden="true">
              <path d="M0 1H20M0 7H20M0 13H20" stroke="currentColor" stroke-width="1.6"/>
            </svg>
          </button>
        </div>
      </div>`;

    const drawer = document.createElement("div");
    drawer.className = "nav-drawer";
    drawer.id = "nav-drawer";
    drawer.innerHTML = `
      <div class="nav-drawer__top">
        <a href="index.html" class="brand">${logoIcon}<span>Windy Peaks<small>Brewery &amp; Steakhouse</small></span></a>
        <button type="button" class="nav-toggle" data-nav-close aria-label="Close menu">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M1 1L17 17M17 1L1 17" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
      <nav aria-label="Mobile"><ul>${items}
        <li><a href="${RESERVE_HREF}" class="btn btn--primary" style="margin-top: 1rem;">Reserve a Table</a></li>
      </ul></nav>
      <div class="nav-drawer__footer">
        <p>715 9th St, Wheatland, WY 82201</p>
        <p><a href="tel:+13073310939">(307) 331-0939</a></p>
        <p>Tues&ndash;Sat, 5&ndash;9pm</p>
      </div>`;

    document.body.prepend(drawer);
    document.body.prepend(header);
  }

  function buildFooter() {
    const footer = document.createElement("footer");
    footer.className = "site-footer";
    footer.innerHTML = `
      <div class="container">
        <div class="footer-grid">
          <div>
            ${logoMain}
            <p style="max-width:32ch; margin-top: var(--sp-4);">Hand-cut steaks, house-brewed beer, and Wyoming hospitality &mdash; poured and plated in Wheatland since 2016.</p>
          </div>
          <div>
            <h4>Explore</h4>
            <ul>
              <li><a href="menu.html">Menu</a></li>
              <li><a href="gallery.html">Gallery</a></li>
              <li><a href="gift-cards.html">Gift Cards</a></li>
              <li><a href="employment.html">Employment</a></li>
            </ul>
          </div>
          <div>
            <h4>Visit</h4>
            <ul>
              <li><a href="https://maps.google.com/?q=715+9th+St+Wheatland+WY+82201" target="_blank" rel="noopener">715 9th St, Wheatland, WY</a></li>
              <li><a href="tel:+13073310939">(307) 331-0939</a></li>
              <li>Tues&ndash;Sat, 5&ndash;9pm</li>
              <li>Sun &amp; Mon, Closed</li>
            </ul>
          </div>
          <div>
            <h4>Reserve</h4>
            <ul>
              <li><a href="reservations.html">Book a table online</a></li>
              <li><a href="contact.html">Ask a question</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; <span data-year></span> Windy Peaks Brewery &amp; Steakhouse. All rights reserved.</p>
          <div class="footer-social">
            <a href="#" aria-label="Windy Peaks on Facebook"><svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 8.5h2.5V5.2c-.43-.06-1.9-.2-3.62-.2-3.58 0-6.03 2.24-6.03 6.36V15H4.5v3.7h3.35V29h3.9V18.7h3.22l.5-3.7h-3.72v-3.15c0-1.07.29-1.8 1.83-1.8Z" fill="currentColor"/></svg></a>
            <a href="#" aria-label="Windy Peaks on Instagram"><svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.6"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor"/></svg></a>
          </div>
        </div>
      </div>`;

    document.body.appendChild(footer);
    const yearEl = footer.querySelector("[data-year]");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  buildHeader();
  buildFooter();
})();
