---
name: builder
description: Build interactive HTML PPT-style deck from final approved content
---

# Builder Skill

Constructs the static HTML presentation deck adhering strictly to core visual identity.

## Inputs
- `artifacts/02-company-profile-final.md`
- `artifacts/03-seo-brief.md`
- `templates/deck/`

## Outputs
- `site/index.html`
- `site/core.css`
- `site/deck.css`
- `site/deck.js`
- `site/robots.txt`
- `site/sitemap.xml`
- `site/assets/`

## Technical Rules
1. Sample brand colors from logo to populate `:root` `--cyan`, `--blue`, `--navy`.
2. Link every slide to `core.css`.
3. Varied archetype per slide (Split-hero, Full-bleed, Grid cards, etc.).
4. PPT presentation style (no web cards/shadows/badges).
5. Hash navigation (`#1`, `#2`).