"""Static checks for the NovaCraft site. Lead-owned: do not edit.

Usage: python tools/check_site.py
Exits 0 when the page is whole, 1 with a list of defects otherwise.
"""
from __future__ import annotations

import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
HTML = ROOT / "index.html"
CSS = ROOT / "assets" / "styles.css"
JS = ROOT / "assets" / "main.js"

REQUIRED_SECTIONS = [
    "hero",
    "services",
    "process",
    "about",
    "tech",
    "contact",
]

# Every marker must be gone after integration.
MARKERS = [
    "@@SOLAR_HEADER@@",
    "@@LONGCAT_HERO@@",
    "@@STEPFUN_SERVICES@@",
    "@@STEPFUN_PROCESS@@",
    "@@HY4_ABOUT@@",
    "@@HY4_TECH@@",
    "@@LONGCAT_CONTACT@@",
    "@@SOLAR_FOOTER@@",
]

# Only the four builders may introduce <section> blocks; the lead adds none.
MAX_SECTIONS = len(REQUIRED_SECTIONS)


def main() -> int:
    defects: list[str] = []

    if not HTML.exists():
        print(f"FAIL missing {HTML}")
        return 1

    html = HTML.read_text(encoding="utf-8")

    for marker in MARKERS:
        if marker in html:
            defects.append(f"unreplaced marker {marker}")

    for sid in REQUIRED_SECTIONS:
        if f'id="{sid}"' not in html:
            defects.append(f"missing section id={sid}")

    found = re.findall(r"<section\b[^>]*id=\"([^\"]+)\"", html)
    if len(found) != MAX_SECTIONS:
        defects.append(f"expected {MAX_SECTIONS} sections, found {len(found)}: {found}")

    if 'href="assets/styles.css"' not in html:
        defects.append("stylesheet not linked")
    if 'src="assets/main.js"' not in html:
        defects.append("main.js not linked")

    for asset in ("assets/styles.css", "assets/main.js"):
        if not (ROOT / asset).exists():
            defects.append(f"missing asset {asset}")

    # Form contract that assets/main.js depends on.
    for needle in ('id="contact-form"', 'id="form-status"', 'id="cf-name"'):
        if needle not in html:
            defects.append(f"form contract broken: missing {needle}")

    # No inline styles, no external resources.
    if re.search(r"\sstyle=\"", html):
        defects.append("inline style attribute found")
    if re.search(r'(src|href)="https?://', html):
        defects.append("external resource referenced")

    if not CSS.exists() or not JS.exists():
        defects.append("asset missing on disk")

    if defects:
        print("FAIL")
        for d in defects:
            print("  -", d)
        return 1

    print(f"ok: {len(found)} sections {found}")
    print("ok: all markers replaced, assets present, no inline/external refs")
    return 0


if __name__ == "__main__":
    sys.exit(main())
