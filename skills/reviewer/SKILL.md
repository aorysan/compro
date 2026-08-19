---
name: reviewer
description: Review company profile draft for factual accuracy, storytelling, and tone
---

# Reviewer Skill

Verify the draft company profile against business facts and brand guidelines.

## Inputs
- `artifacts/01-company-profile-draft.md`
- `input/business-knowledge-base.md`
- `input/brand-story-guide.md`

## Outputs
- `artifacts/02-review-report.md`
- `artifacts/02-company-profile-final.md` (if APPROVED)

## Checklist
1. Factual consistency (pricing, stats, claims).
2. Storytelling flow across slides.
3. Hook quality and tone of voice.
4. No sensitive information or placeholders left unflagged.

## Statuses
- `APPROVED`: Draft is ready for SEO & building. Copy to `02-company-profile-final.md`.
- `REVISION_REQUIRED`: Detailed list of fixes required in `02-review-report.md`.
- `BLOCKED`: Critical missing business context.