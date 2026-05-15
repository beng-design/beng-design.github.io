# Portfolio Site — Claude Code Instructions

Drop this file in the root of the repo. It tells you exactly what to fix and why.

## Project structure (expected)

```
/
├── index.html
├── css/
│   ├── main.css          ← imports all others
│   ├── tokens.css
│   ├── base.css
│   ├── layout.css
│   ├── hero.css
│   ├── cards.css
│   ├── about.css
│   └── responsive.css
├── js/
│   ├── config.js         ← all content lives here
│   ├── main.js
│   └── transitions.js
└── projects/
    ├── game-menu.html
    └── component-library.html
```

---

## Fixes required

Work through these in order. Do not refactor beyond what is described.

---

### 1. Remove duplicate `@view-transition` rule

**File:** `index.html` and both files in `projects/`

Remove this inline `<style>` block from all three HTML files:
```html
<style>@view-transition { navigation: auto; }</style>
```

It already exists in `css/base.css`. One location is enough.

---

### 2. Populate static meta tags in `index.html`

The `<title>`, og, and twitter tags are currently empty strings — filled by JS at runtime. Crawlers often won't execute JS.

Read `js/config.js` to get the real values, then hardcode them into `index.html`:

- `<title>` → `{CONFIG.name} — {CONFIG.role}`
- `<meta name="description">` → `CONFIG.statement`
- `og:title` → same as title
- `og:description` → same as description
- `twitter:title` → same as title
- `twitter:description` → same as description

JS can still override these at runtime (it already does) — this just ensures crawlers get real content.

---

### 3. Fix about links missing `href`

**File:** `index.html`

These three links have no `href` in the HTML — only set by JS. Links without `href` are not keyboard-focusable:

```html
<a id="link-github" class="about-link">GitHub</a>
<a id="link-linkedin" class="about-link">LinkedIn</a>
<a id="link-resume" class="about-link">Resume</a>
```

Add `href="#"` as a fallback to each until JS runs:
```html
<a id="link-github" class="about-link" href="#">GitHub</a>
```

---

### 4. Fix `hero-email` empty href

**File:** `index.html`

```html
<a id="hero-email" href=""></a>
```

`href=""` resolves to the current page. Change to `href="#"` as a safe fallback:
```html
<a id="hero-email" href="#"></a>
```

---

### 5. Fix back-to-top button

**File:** `index.html`

`href="#"` appends a bare `#` to the URL. Replace the `<a>` with a `<button>` and handle scrolling in JS:

Replace:
```html
<a href="#" class="back-to-top" aria-label="Back to top">
  ...svg...
</a>
```

With:
```html
<button class="back-to-top" aria-label="Back to top" onclick="window.scrollTo({top:0,behavior:'smooth'})">
  ...svg...
</button>
```

Add to `css/layout.css` — the `.back-to-top` rule already styles it visually; just ensure `background: none; border: 1px solid var(--border); cursor: pointer;` are present (the existing border rule should cover it, add the others if missing).

---

### 6. Accessibility — `status-dot` and nav

**File:** `index.html`

Add `aria-hidden="true"` to the decorative status dot:
```html
<span class="status-dot" aria-hidden="true"></span>
```

Add `aria-label` to the main nav:
```html
<nav class="site-nav" aria-label="Main">
```

---

### 7. Accessibility — card links

**File:** `js/main.js`, inside `buildCard()`

The entire card is a link (`<a class="card">`), which means screen readers announce the full card content as one link. The `card-link` span with "View case study →" is redundant and confusing.

In `buildCard()`:
1. Add `aria-label` to the card `<a>` tag: `aria-label="View case study: ${p.title}"`
2. Add `aria-hidden="true"` to the `.card-link` span so it isn't double-read

```js
card.setAttribute('aria-label', `View case study: ${p.title}`);
```

And in the innerHTML template:
```html
<span class="card-link" aria-hidden="true">View case study →</span>
```

---

### 8. Mobile navigation

**File:** `css/responsive.css`

At 860px, nav links are hidden (`display: none`) with no replacement. Add a simple hamburger.

**In `index.html`**, add a hamburger button inside `<nav class="site-nav">` after `.nav-links`:
```html
<button class="nav-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="nav-links">
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M2 4.5h14M2 9h14M2 13.5h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>
</button>
```

Give `.nav-links` an `id="nav-links"` to match `aria-controls`.

**In `css/layout.css`**, add:
```css
.nav-toggle {
  display: none;
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
}
```

**In `css/responsive.css`**, update the 860px block:
```css
@media (max-width: 860px) {
  .nav-toggle { display: flex; }

  .nav-links {
    display: none;
    flex-direction: column;
    position: fixed;
    inset: var(--nav-h) 0 0;
    background: var(--bg);
    padding: 2rem var(--page-pad);
    gap: 1.5rem;
    z-index: 98;
  }
  .nav-links.is-open { display: flex; }
  .nav-links a { font-size: 1.125rem; }
}
```

**In `js/main.js`**, after `populate()`, add:
```js
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.getElementById('nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', function () {
    const open = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      links.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
    });
  });
})();
```

---

### 9. Cap max content width

**File:** `css/tokens.css`

Change:
```css
--max-w: 1920px;
```
To:
```css
--max-w: 1280px;
```

1920px stretches content across the full display on wide monitors. 1280px is a reasonable cap for a portfolio.

---

### 10. Remove redundant scroll restoration

**File:** `js/transitions.js`

Remove this line — it's the browser default and does nothing:
```js
history.scrollRestoration = 'auto';
```

---

## Do not change

- The token system, color values, or visual design
- The config-driven architecture in `config.js` / `main.js`
- The View Transitions implementation (beyond removing the duplicate `@view-transition` rule)
- The case study page structure beyond the duplicate style block removal

## After making changes

Verify by opening `index.html` in a browser and:
1. Resizing to mobile width — hamburger should appear and open/close the nav
2. Tabbing through the page — all interactive elements should be reachable
3. Checking `<title>` in the browser tab — should show the name from config, not be blank
4. Running Lighthouse in Chrome DevTools — target 90+ on Accessibility
