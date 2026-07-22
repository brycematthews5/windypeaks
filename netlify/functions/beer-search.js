/* Server-side proxy for the catalog.beer API. Keeps CATALOG_BEER_API_KEY
   on the server (Netlify environment variable) — it must never reach the
   browser, per catalog.beer's own terms. The CMS widget calls this
   function instead of catalog.beer directly. */

exports.handler = async (event) => {
  const apiKey = process.env.CATALOG_BEER_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "CATALOG_BEER_API_KEY is not set in this site's Netlify environment variables.",
      }),
    };
  }

  const q = (event.queryStringParameters && event.queryStringParameters.q) || "";
  if (!q.trim()) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Missing required query parameter 'q'." }),
    };
  }

  const url = `https://api.catalog.beer/beer/search?q=${encodeURIComponent(q)}&count=15`;
  const auth = Buffer.from(`${apiKey}:`).toString("base64");

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
      },
    });

    const text = await res.text();

    if (!res.ok) {
      return {
        statusCode: res.status,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: `catalog.beer API returned ${res.status}`, details: text }),
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: text,
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Failed to reach catalog.beer.", details: String(err) }),
    };
  }
};
