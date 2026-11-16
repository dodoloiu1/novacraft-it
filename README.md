# NovaCraft IT Services

A static one-page IT services site, built by four subagents in parallel — one
model per section owner — then integrated, verified, pushed and deployed by the
lead.

| builder | model | owns |
|---|---|---|
| longcat | `nous:meituan/longcat-2.5:free` | hero, contact |
| stepfun | `nous:stepfun/step-3.7-flash:free` | services, process |
| hy4 | `nous:tencent/hy4-flash:free` | about, tech stack |
| solar | `nous:upstage/solar-mini4:free` | navbar, footer |

Lead-owned: `index.html` skeleton, `assets/styles.css`, `assets/main.js`,
`SPEC.md`, `TECHNIQUES.md`, git history, GitHub Pages.

## Run locally

It is plain static HTML — open `index.html`, or:

```bash
python -m http.server 8000
```

## Verify

```bash
python tools/check_site.py
```

Checks that every builder's markers are gone, every required section id exists,
every asset referenced by the HTML is on disk, and the JS parses.

## Deploy

`gh-pages` branch is force-pushed from the repository root on every release
commit; GitHub Pages serves it at `https://<owner>.github.io/<repo>/`.
