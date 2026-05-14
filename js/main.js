// Thumb markup keyed by project id. Add a new entry here when introducing
// a project with a novel visual thumbnail.
const THUMBS = {
  'clock': (
    '<div class="clock">' +
      '<div class="ch" id="clock-hour"></div>' +
      '<div class="cm" id="clock-min"></div>' +
      '<div class="cc"></div>' +
    '</div>'
  ),
  'game-menu': (
    '<div class="game-menu">' +
      '<div class="gmi active">New Game</div>' +
      '<div class="gmi">Continue</div>' +
      '<div class="gmi">Options</div>' +
      '<div class="gmi" style="opacity:.35">Exit</div>' +
    '</div>'
  ),
  'component-library': (
    '<div class="comp-stack">' +
      '<div class="c-btn">Button</div>' +
      '<div class="c-input"></div>' +
      '<div class="c-badge">Badge · v1.0</div>' +
    '</div>'
  )
};

function buildCard(p) {
  const card = document.createElement('a');
  card.className = 'card';
  card.href = p.url;
  card.innerHTML = `
    <div class="card-thumb ${p.thumbClass}" style="view-transition-name: thumb-${p.id}">${THUMBS[p.id] || ''}</div>
    <div class="card-body">
      <div class="card-row">
        <span class="card-num">${p.num}</span>
        <span class="card-tag">${p.tag}</span>
      </div>
      <h2 class="card-title">${p.title}</h2>
      <p class="card-desc">${p.desc}</p>
      <span class="card-link">View case study →</span>
    </div>
  `;
  return card;
}

function populate() {
  document.title = CONFIG.name + ' — ' + CONFIG.role;
  document.getElementById('meta-desc').setAttribute('content', CONFIG.statement);

  const ogTitle = CONFIG.name + ' — ' + CONFIG.role;
  document.querySelector('meta[property="og:title"]').setAttribute('content', ogTitle);
  document.querySelector('meta[property="og:description"]').setAttribute('content', CONFIG.statement);
  document.querySelector('meta[name="twitter:title"]').setAttribute('content', ogTitle);
  document.querySelector('meta[name="twitter:description"]').setAttribute('content', CONFIG.statement);

  document.getElementById('nav-wordmark').textContent    = CONFIG.handle;
  document.getElementById('hero-eyebrow').textContent   = CONFIG.role;
  document.getElementById('hero-name').textContent      = CONFIG.name;
  document.getElementById('hero-statement').textContent = CONFIG.statement;

  const emailEl = document.getElementById('hero-email');
  emailEl.textContent = CONFIG.email;
  emailEl.href        = 'mailto:' + CONFIG.email;

  if (!CONFIG.available) {
    document.querySelector('.hero-cta').style.display = 'none';
  }

  const container = document.querySelector('.projects');
  CONFIG.projects.forEach(function (p) {
    container.appendChild(buildCard(p));
  });

  document.getElementById('about-bio').textContent     = CONFIG.about.bio;
  document.getElementById('about-context').textContent = CONFIG.about.context;

  document.getElementById('link-github').href   = CONFIG.links.github;
  document.getElementById('link-linkedin').href = CONFIG.links.linkedin;
  document.getElementById('link-resume').href   = CONFIG.links.resume;

  document.getElementById('footer-name').textContent = CONFIG.name;
  document.getElementById('footer-year').textContent = new Date().getFullYear();
}

populate();

// Clock hands — runs after populate() so the elements exist in the DOM
(function () {
  const now = new Date();
  const h = now.getHours() % 12, m = now.getMinutes();
  document.getElementById('clock-hour').style.transform = 'rotate(' + (h * 30 + m * 0.5) + 'deg)';
  document.getElementById('clock-min').style.transform  = 'rotate(' + (m * 6) + 'deg)';
})();
