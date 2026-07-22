/* WPBeers — fetches content/beers/*.json straight from GitHub (no build
   step, no server) and renders it into the same card markup the Beer tab
   already used. Editing happens through Decap CMS at /admin, which commits
   directly to these files; this script just reads whatever is currently
   in the repo. */

const WPBeers = (function () {
  const DIR = "content/beers";

  const CATEGORY_ORDER = [
    "Pilsners & Pale Lagers",
    "Blonde & Pale Ales",
    "IPAs",
    "Amber, Red & Brown Ales",
    "Porters & Stouts",
    "Sour & Fruit Beers",
  ];

  const escapeHtml = WPContent.escapeHtml;

  async function fetchAll() {
    const beers = await WPContent.fetchFolder(DIR);
    return beers.filter((b) => b.onTap !== false);
  }

  function renderBeerCard(beer) {
    const info = beer.beerInfo || {};
    const nitroSuffix = beer.nitro
      ? ` <span class="text-dim" style="font-weight:400;">(Nitro)</span>`
      : "";
    const abv = Number.isFinite(Number(info.abv)) ? `${Number(info.abv).toFixed(1)}% ABV` : "";
    return `
      <article class="card">
        <div class="cluster" style="justify-content:space-between;">
          <h4 style="font-family:var(--font-display); font-size:var(--fs-md); font-weight:500;">${escapeHtml(info.name)}${nitroSuffix}</h4>
          <span class="badge badge--copper">${abv}</span>
        </div>
        <p class="text-dim" style="margin-top:6px;">${escapeHtml(info.brewery)} &middot; ${escapeHtml(beer.location)}. ${escapeHtml(info.description)}</p>
      </article>`;
  }

  function renderList(container, beers) {
    if (!beers.length) {
      container.innerHTML = `<p class="text-dim">Ask your server what's currently pouring &mdash; our tap list is being updated.</p>`;
      return;
    }

    const byCategory = {};
    beers.forEach((b) => {
      const cat = b.category || "Other";
      (byCategory[cat] = byCategory[cat] || []).push(b);
    });
    Object.values(byCategory).forEach((list) =>
      list.sort((a, b) => (a.order || 0) - (b.order || 0))
    );

    const categories = [
      ...CATEGORY_ORDER.filter((c) => byCategory[c]),
      ...Object.keys(byCategory).filter((c) => !CATEGORY_ORDER.includes(c)),
    ];

    container.innerHTML = categories
      .map(
        (cat, i) => `
      <h3 class="h-3" style="margin-bottom: var(--sp-3);">${escapeHtml(cat)}</h3>
      <div class="grid grid--2" style="gap: var(--sp-4); margin-bottom: ${i === categories.length - 1 ? "0" : "var(--sp-6)"};">
        ${byCategory[cat].map(renderBeerCard).join("")}
      </div>`
      )
      .join("");
  }

  async function init(selector) {
    const container = document.querySelector(selector);
    if (!container) return;
    container.innerHTML = `<p class="text-dim">Loading the tap list&hellip;</p>`;
    try {
      const beers = await fetchAll();
      renderList(container, beers);
    } catch (err) {
      console.error("WPBeers:", err);
      container.innerHTML = `<p class="text-dim">Couldn't load the live tap list right now &mdash; ask your server what's currently pouring.</p>`;
    }
  }

  return { init, fetchAll };
})();
