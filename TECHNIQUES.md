# Techniques

How this site gets built and shipped. Written by the lead; builders do not need
it, but it is the record of the orchestration.

## 1. One model per file owner

Four subagents build four disjoint pieces concurrently, one model each:

| builder | model | owns |
|---|---|---|
| longcat | `nous:meituan/longcat-2.5:free` | hero, contact |
| stepfun | `nous:stepfun/step-3.7-flash:free` | services, process |
| hy4 | `nous:tencent/hy4-flash:free` | about, tech stack |
| solar | `nous:upstage/solar-mini4:free` | navbar, footer |

Every `delegate_task` carries an explicit `target: {providerInstanceId, model}`.
Omitting `target` silently inherits the parent model, and the spawn result's
`model` field is checked against the request before the wave is trusted.

## 2. Contract before fan-out

`SPEC.md` fixes the palette, the class vocabulary, the section ids, the HTML
shape and the JS contract before the first spawn. Parallel agents cannot read
each other's in-flight code, so an ambiguous spec becomes integration failures
debugged serially afterwards.

`index.html` ships as a baseline with `@@BUILDER@@` marker slots. Each builder
replaces only its own markers, so four agents editing one file never collide.
Comment guards (`<!-- @MODEL_START -->`) let the lead locate each block.

## 3. Waves

1. **Build** — four builders in one `delegate_task` call, `mode: async`. A
   `wait` batch of four exceeds the ~300 s MCP call cap; async results arrive
   between turns and a call timeout never cancels a child.
2. **Integrate** — the lead stitches the blocks, checks markers are gone, and
   runs `python tools/check_site.py`.
3. **Verify** — one verifier subagent re-reads the integrated page against
   `SPEC.md` and reports findings, not fixes.
4. **Fix** — the lead fixes small findings itself; only a structural failure
   earns a fixer child.

## 4. What is verified, not asserted

- `tools/check_site.py`: no marker left, exactly six section ids, both assets
  linked and on disk, the form contract intact, no inline styles, no external
  URLs. Exits non-zero on any defect.
- The page is opened in a real browser and screenshotted, and the mobile nav
  toggle is clicked — a static green check does not prove the menu works.
- Deployment is confirmed by fetching the live URL, not by reading the Actions log.

## 5. Shipping

```
git push origin main                 # the repo of record
git push origin main:gh-pages --force  # GitHub Pages serves this branch
```

GitHub Pages is enabled on `gh-pages` at the repository root. The live URL is
re-fetched after the Actions run goes green.

## 6. Stitch

The Stitch MCP server is configured in `HERMES_HOME/config.yaml`
(`mcp_servers.stitch`, enabled) and is reachable from the lead. Subagents in
this harness do not inherit the Stitch toolset, so a Stitch-generated screen is
integrated by the lead, not by a builder.
