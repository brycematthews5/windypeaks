/* WPWine — fetches content/wines/*.json and renders it into the same
   two-column Red/White markup the Wine tab already used. Editing happens
   through Decap CMS at /admin. */

const WPWine = (function () {
  const DIR = "content/wines";
  const escapeHtml = WPContent.escapeHtml;

  function renderItem(wine) {
    return `<div class="menu-item__row"><span class="menu-item__name">${escapeHtml(wine.name)} <span class="text-dim" style="font-weight:400;">&middot; ${escapeHtml(wine.varietal)}</span></span><span class="menu-item__leader"></span><span class="menu-item__price">${escapeHtml(wine.price)}</span></div>`;
  }

  function renderColumn(container, list, emptyLabel) {
    container.innerHTML = list.length
      ? list.map(renderItem).join("")
      : `<p class="text-dim">${emptyLabel}</p>`;
  }

  async function init(redSelector, whiteSelector) {
    const redEl = document.querySelector(redSelector);
    const whiteEl = document.querySelector(whiteSelector);
    if (!redEl || !whiteEl) return;
    redEl.innerHTML = `<p class="text-dim">Loading&hellip;</p>`;
    whiteEl.innerHTML = `<p class="text-dim">Loading&hellip;</p>`;
    try {
      const wines = await WPContent.fetchFolder(DIR);
      const reds = wines.filter((w) => w.type === "Red").sort((a, b) => (a.order || 0) - (b.order || 0));
      const whites = wines.filter((w) => w.type === "White").sort((a, b) => (a.order || 0) - (b.order || 0));
      renderColumn(redEl, reds, "List being updated.");
      renderColumn(whiteEl, whites, "List being updated.");
    } catch (err) {
      console.error("WPWine:", err);
      redEl.innerHTML = `<p class="text-dim">Couldn't load the wine list right now.</p>`;
      whiteEl.innerHTML = `<p class="text-dim">Couldn't load the wine list right now.</p>`;
    }
  }

  return { init };
})();
