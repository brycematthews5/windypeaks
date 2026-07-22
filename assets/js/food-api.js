/* WPFood — fetches content/food/*.json and renders it into the same
   menu-list markup the Food tab already used. Editing happens through
   Decap CMS at /admin. */

const WPFood = (function () {
  const DIR = "content/food";

  const CATEGORY_ORDER = ["Appetizers", "Entrees", "Salads", "Sandwiches", "Desserts", "Kids"];

  const CATEGORY_SUBTITLE = {
    Entrees: "steaks hand-cut in-house",
    Sandwiches: "served with house-cut fries",
  };

  const CATEGORY_AFTER_HTML = {
    Entrees: `<p class="field-hint" style="margin-bottom: var(--sp-7);">Ask about add-ons for steaks and entrees &mdash; saut&eacute;ed onions or mushrooms, blue cheese crumbles, and our brandy cream sauce.</p>`,
  };

  const escapeHtml = WPContent.escapeHtml;

  function renderItem(item) {
    const name = (item.undercookedRisk ? "*" : "") + escapeHtml(item.name);
    const desc = item.description
      ? `<p class="menu-item__desc">${escapeHtml(item.description)}</p>`
      : "";
    return `
      <div class="menu-item__row"><span class="menu-item__name">${name}</span><span class="menu-item__leader"></span><span class="menu-item__price">${escapeHtml(item.price)}</span></div>
      ${desc}`;
  }

  function renderList(container, items) {
    if (!items.length) {
      container.innerHTML = `<p class="text-dim">Menu is being updated &mdash; ask your server for today's offerings.</p>`;
      return;
    }

    const byCategory = {};
    items.forEach((i) => (byCategory[i.category] = byCategory[i.category] || []).push(i));
    Object.values(byCategory).forEach((list) =>
      list.sort((a, b) => (a.order || 0) - (b.order || 0))
    );

    const categories = [
      ...CATEGORY_ORDER.filter((c) => byCategory[c]),
      ...Object.keys(byCategory).filter((c) => !CATEGORY_ORDER.includes(c)),
    ];

    container.innerHTML = categories
      .map((cat, i) => {
        const subtitle = CATEGORY_SUBTITLE[cat]
          ? ` <span class="text-dim" style="font-family:var(--font-body); font-size:var(--fs-sm); font-weight:400;">&mdash; ${escapeHtml(CATEGORY_SUBTITLE[cat])}</span>`
          : "";
        const afterHtml = CATEGORY_AFTER_HTML[cat] || "";
        const marginBottom = afterHtml ? "var(--sp-3)" : i === categories.length - 1 ? "0" : "var(--sp-7)";
        return `
      <h2 class="h-3" style="margin-bottom: var(--sp-4);">${escapeHtml(cat)}${subtitle}</h2>
      <div class="menu-list" style="margin-bottom: ${marginBottom};">
        ${byCategory[cat].map(renderItem).join("")}
      </div>
      ${afterHtml}`;
      })
      .join("");
  }

  async function init(selector) {
    const container = document.querySelector(selector);
    if (!container) return;
    container.innerHTML = `<p class="text-dim">Loading the menu&hellip;</p>`;
    try {
      const items = await WPContent.fetchFolder(DIR);
      renderList(container, items);
    } catch (err) {
      console.error("WPFood:", err);
      container.innerHTML = `<p class="text-dim">Couldn't load the menu right now &mdash; ask your server for today's offerings.</p>`;
    }
  }

  return { init };
})();
