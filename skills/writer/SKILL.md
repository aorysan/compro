---
name: writer
description: Generate draft content for company profile slides based on intake data
---

# Writer Skill

Generate draft content for the company profile slide deck based on facts provided in the business knowledge base.

## Inputs
- `input/business-knowledge-base.md`
- `input/brand-story-guide.md`
- `input/brand-assets/`

## Outputs
- `artifacts/01-company-profile-draft.md`

## Rules
1. Never hallucinate claims, stats, or facts not in `business-knowledge-base.md`.
2. Ensure 1 main message per slide following the arc: Attention -> Problem -> Solution -> Proof -> Offer -> CTA.
3. Every slide must contain:
   - Slide Number & Title
   - Headline (punchy hook + cyan accent word)
   - Subheadline & Body copy
   - Visual direction (suggested archetype: Split-hero, Grid, Full-bleed, etc.)
   - Source reference for stats/claims