# NovaCraft IT Services — site spec

Multi-model build: four agents, one model each, four disjoint file owners.

- `longcat`  → `nous:meituan/longcat-2.5:free` — owns **hero + contact**
- `stepfun`  → `nous:stepfun/step-3.7-flash:free` — owns **services**
- `hy4`      → `nous:tencent/hy4-flash:free` — owns **about + tech stack**
- `solar`    → `nous:upstage/solar-mini4:free` — owns **navbar + footer**

Lead (orchestrator) owns: `index.html`, `assets/styles.css`, `assets/main.js`,
`README.md`, `TECHNIQUES.md`, git, push, deploy. Builders never touch those.

## Subject

A fictional IT services company, **NovaCraft IT Services**. Services: cloud
migration, managed security, custom software, data platforms. Brand: dark navy
(`#0b1220`), electric cyan accent (`#22d3ee`), off-white text (`#e5edf7`).
Modern, high-contrast, generous whitespace, system font stack. Fully static, no
build step, no CDN, no external fonts, no images.

## Tech constraints (hard)

- One page: `index.html` at the repository root.
- Plain HTML + CSS + a little vanilla JS. No frameworks, no bundler.
- CSS custom properties on `:root` for the palette; mobile-first; responsive at
  700px and 1100px.
- Each builder owns exactly two `.section` blocks inside the `<main>` element,
  each with a unique `id`, plus (navbar/footer owner) the header and footer.
- `assets/main.js` exposes one global: `window.NovaCraft`. It contains the
  mobile nav toggle, scroll-reveal via `IntersectionObserver`, and the contact
  form handler (client-side validation + a confirmation message; there is no
  backend, so the form must not POST anywhere).
- Every interactive element is reachable by keyboard and has a visible focus
  style.

## Section contract

Each builder writes TWO complete top-level blocks. Copy this shape exactly and
replace the bracketed parts:

```html
<section id="UNIQUE_ID" class="section" aria-labelledby="UNIQUE_ID-title">
  <div class="wrap">
    <p class="eyebrow">EYEBROW TEXT</p>
    <h2 id="UNIQUE_ID-title">HEADING</h2>
    <p class="lead">One or two sentences.</p>
    ... block-specific markup ...
  </div>
</section>
```

Allowed class vocabulary (already defined in `assets/styles.css` — use it, do
not invent new top-level layout classes): `wrap`, `section`, `eyebrow`, `lead`,
`grid`, `grid-2`, `grid-3`, `card`, `card h3`, `card p`, `pill`, `stack`,
`stats`, `stat`, `stat b`, `stat span`, `list-check`, `brand-row`, `field`,
`field label`, `field input`, `field textarea`, `btn`, `btn ghost`, `note`,
`tag`. Inline styles are forbidden.

### longcat — hero + contact
1. `<section id="hero">` — eyebrow "NovaCraft IT Services", H1, lead paragraph,
   two buttons (primary `a.btn` → `#contact`, secondary `a.btn ghost` → `#services`),
   and a `<div class="stats">` with three `<div class="stat"><b>NUMBER</b><span>LABEL</span></div>`.
   The hero sits directly under the navbar, before every other section.
2. `<section id="contact">` — a `<form id="contact-form" class="grid grid-2" novalidate>`
   with fields name / email / company / budget (select) / message (textarea),
   each wrapped in `<div class="field">`, plus `<button class="btn" type="submit">`
   and `<p class="note" id="form-status" role="status" aria-live="polite"></p>`.
   The form's markup must be exactly what `assets/main.js` expects.

### stepfun — services
1. `<section id="services">` — `<div class="grid grid-3">` of exactly four
   `<article class="card">`, each with `<h3>` + `<p>` + `<ul class="list-check">`
   of three items: Cloud Migration, Managed Security, Custom Software, Data Platforms.
2. `<section id="process">` — `<ol class="stack">` with four numbered steps
   (Discover, Design, Deliver, Operate), each step a `<li>` with a heading and text.

### hy4 — about + tech stack
1. `<section id="about">` — `<div class="grid grid-2">` with a text column
   (two paragraphs) and a `<div class="card">` containing a `<ul class="pill-list">`
   of company values rendered as `<span class="pill">`.
2. `<section id="tech">` — `<div class="brand-row">` of at least six
   `<span class="tag">` items (the stack), preceded by an H2 and a lead.

### solar — navbar + footer
1. `<header class="site-header">` — `<nav class="wrap nav">` containing
   `<a class="brand" href="#top">`, a `<button class="nav-toggle" aria-expanded="false" aria-controls="nav-links">`,
   and `<ul id="nav-links" class="nav-links">` with links to `#services`, `#process`,
   `#about`, `#tech`, `#contact`. The header is the very first element in `<body>`.
2. `<footer class="site-footer">` — `<div class="wrap footer-grid">` with three
   columns (brand + tagline, a `<ul>` of nav links, contact details) and a
   `<p class="note">` copyright line. The footer is the very last element in `<body>`.

## Definition of done for every builder

- `python -c "import ast,sys; ast.parse(open('index.html').read())"` is not
  applicable to HTML; instead validate the block parses as XML-ish HTML5 with:
  `python -m py_compile` on nothing — use this instead:
  `python -c "import html.parser,sys; p=html.parser.HTMLParser(); p.feed(open('index.html',encoding='utf-8').read()); print('parsed ok')"`
  plus `grep -c '<section' index.html` to prove both blocks landed.
- Only your two blocks differ from the baseline; everything else byte-identical.
- Report: model, section ids written, the exact commands run, real output.
