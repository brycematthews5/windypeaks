/* WPArt — a small illustrated brand-motif system standing in for on-site
   photography until the client supplies real shots (food, interior, pours).
   Each scene is a duotone gradient panel + line-art illustration so the
   site reads as art-directed rather than "missing image" in the meantime.
   Usage: <div class="art-panel grain">${WPArt.mountains()}</div> */

const WPArt = (function () {
  function wrap(id, bg1, bg2, inner) {
    return `
    <svg viewBox="0 0 600 750" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
      <defs>
        <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${bg1}"/>
          <stop offset="100%" stop-color="${bg2}"/>
        </linearGradient>
      </defs>
      <rect width="600" height="750" fill="url(#${id})"/>
      ${inner}
    </svg>`;
  }

  function mountains(tone) {
    const id = "g-mtn-" + Math.floor(Math.random() * 99999);
    return wrap(id, tone === "light" ? "#f3eee7" : "#2f2417", tone === "light" ? "#e4d3b8" : "#231a10", `
      <g opacity="0.9" fill="none" stroke="#c08329" stroke-width="2">
        <path d="M-20 480 L120 300 L200 400 L320 220 L430 400 L520 300 L640 480" />
        <path d="M-20 560 L160 380 L260 470 L380 300 L470 460 L620 380" opacity="0.55" />
      </g>
      <g fill="#c08329" opacity="0.85">
        <path d="M120 300 l-10 24h20z"/><path d="M320 220 l-11 26h22z"/><path d="M520 300 l-10 24h20z"/>
      </g>
      <circle cx="90" cy="520" r="30" fill="#ffffff" opacity="0.35"/>
    `);
  }

  function steak() {
    const id = "g-steak-" + Math.floor(Math.random() * 99999);
    return wrap(id, "#2f2011", "#150f08", `
      <ellipse cx="300" cy="420" rx="190" ry="130" fill="#683e1f" opacity="0.9"/>
      <ellipse cx="300" cy="420" rx="190" ry="130" fill="none" stroke="#c08329" stroke-width="3" opacity="0.7"/>
      <g stroke="#231a10" stroke-width="6" stroke-linecap="round" opacity="0.55">
        <line x1="150" y1="360" x2="440" y2="360"/>
        <line x1="140" y1="400" x2="450" y2="400"/>
        <line x1="150" y1="440" x2="440" y2="440"/>
        <line x1="170" y1="480" x2="420" y2="480"/>
      </g>
      <g stroke="#ffffff" stroke-width="2.5" fill="none" opacity="0.5">
        <path d="M220 280 q10 -40 0 -70" stroke-linecap="round"/>
        <path d="M300 270 q12 -46 -4 -80" stroke-linecap="round"/>
        <path d="M380 280 q10 -40 -4 -70" stroke-linecap="round"/>
      </g>
    `);
  }

  function beerPour() {
    const id = "g-beer-" + Math.floor(Math.random() * 99999);
    return wrap(id, "#c08329", "#8a5f1e", `
      <path d="M210 200 h180 l-20 380 a20 20 0 0 1 -20 18 h-100 a20 20 0 0 1 -20 -18 z" fill="#ffffff" opacity="0.18" stroke="#ffffff" stroke-width="3"/>
      <path d="M228 260 h144 l-15 300 h-114 z" fill="#ffffff" opacity="0.35"/>
      <g fill="#ffffff" opacity="0.75">
        <circle cx="260" cy="290" r="10"/><circle cx="300" cy="270" r="14"/><circle cx="340" cy="295" r="9"/>
        <circle cx="280" cy="320" r="7"/><circle cx="320" cy="330" r="8"/>
      </g>
      <path d="M300 60 q30 60 0 120 q-30 -30 0 -120" fill="#ffffff" opacity="0.4"/>
    `);
  }

  function wheat() {
    const id = "g-wheat-" + Math.floor(Math.random() * 99999);
    return wrap(id, "#f3eee7", "#e4d3b8", `
      <g stroke="#6b4a22" stroke-width="2" fill="none" opacity="0.8">
        <path d="M150 620 C150 420 200 320 220 180"/>
        <path d="M300 640 C300 400 340 300 340 140"/>
        <path d="M450 620 C450 420 410 320 400 180"/>
      </g>
      <g fill="#a17f37" opacity="0.85">
        <ellipse cx="220" cy="180" rx="8" ry="16"/><ellipse cx="238" cy="205" rx="8" ry="16"/><ellipse cx="204" cy="205" rx="8" ry="16"/>
        <ellipse cx="340" cy="140" rx="8" ry="16"/><ellipse cx="358" cy="165" rx="8" ry="16"/><ellipse cx="322" cy="165" rx="8" ry="16"/>
        <ellipse cx="400" cy="180" rx="8" ry="16"/><ellipse cx="418" cy="205" rx="8" ry="16"/><ellipse cx="384" cy="205" rx="8" ry="16"/>
      </g>
    `);
  }

  function dining() {
    const id = "g-dine-" + Math.floor(Math.random() * 99999);
    return wrap(id, "#2f2417", "#231a10", `
      <g stroke="#c08329" stroke-width="2" fill="none" opacity="0.7">
        <ellipse cx="300" cy="500" rx="150" ry="34"/>
        <line x1="300" y1="500" x2="300" y2="620"/>
        <ellipse cx="300" cy="628" rx="46" ry="10"/>
      </g>
      <g fill="#c08329" opacity="0.75">
        <circle cx="230" cy="490" r="7"/><circle cx="370" cy="490" r="7"/>
        <rect x="210" y="470" width="10" height="30" rx="4"/><rect x="380" y="470" width="10" height="30" rx="4"/>
      </g>
      <g opacity="0.55" stroke="#ffffff" stroke-width="1.5">
        <path d="M120 180 q180 -60 360 0" fill="none"/>
        <circle cx="150" cy="170" r="3" fill="#ffffff"/>
        <circle cx="450" cy="170" r="3" fill="#ffffff"/>
      </g>
    `);
  }

  function tanks() {
    const id = "g-tank-" + Math.floor(Math.random() * 99999);
    return wrap(id, "#2f2417", "#231a10", `
      <g fill="none" stroke="#c08329" stroke-width="2.5">
        <rect x="140" y="220" width="110" height="320" rx="55"/>
        <rect x="290" y="180" width="110" height="360" rx="55"/>
        <rect x="440" y="240" width="90" height="300" rx="45"/>
      </g>
      <g fill="#c08329" opacity="0.6">
        <rect x="160" y="200" width="70" height="18" rx="9"/>
        <rect x="310" y="160" width="70" height="18" rx="9"/>
        <rect x="455" y="220" width="58" height="18" rx="9"/>
      </g>
    `);
  }

  return { mountains, steak, beerPour, wheat, dining, tanks };
})();
