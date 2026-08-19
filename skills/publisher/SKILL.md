---
name: publisher
description: Perform pre-deployment QA on site assets and layout
---

# Publisher Skill

Verifies site readiness prior to deployment.

## Inputs
- `site/`
- `qa/seo-report.md`
- `input/deployment-config.md`

## Outputs
- `qa/publish-report.md`
- `deploy/deployment-status.md`

## Checklist
1. All local assets load cleanly without 404s.
2. Technical SEO status is `PASSED`.
3. Desktop and mobile layout checks complete without overflow.
4. Deployment target specified.

## Statuses
- `READY_TO_DEPLOY`
- `BLOCKED`