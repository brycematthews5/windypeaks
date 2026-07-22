/* WPContent — shared low-level fetcher for any content/<folder>/*.json
   collection edited through Decap CMS. Reads straight from GitHub's public
   API (no server, no build step); used by beers-api.js, food-api.js, and
   wine-api.js. */

const WPContent = (function () {
  const REPO = "brycematthews5/windypeaks";
  const BRANCH = "main";

  async function fetchFolder(dir) {
    const listUrl = `https://api.github.com/repos/${REPO}/contents/${dir}?ref=${BRANCH}`;
    const listRes = await fetch(listUrl, { headers: { Accept: "application/vnd.github.v3+json" } });
    if (!listRes.ok) throw new Error(`Directory listing failed for ${dir}: ${listRes.status}`);
    const files = await listRes.json();
    const jsonFiles = files.filter((f) => f.type === "file" && f.name.endsWith(".json"));

    const items = await Promise.all(
      jsonFiles.map(async (f) => {
        const res = await fetch(f.download_url);
        if (!res.ok) return null;
        try {
          return await res.json();
        } catch {
          return null;
        }
      })
    );

    return items.filter(Boolean);
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    })[c]);
  }

  return { fetchFolder, escapeHtml };
})();
