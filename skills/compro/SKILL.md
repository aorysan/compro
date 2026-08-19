---
name: compro
description: Main orchestrator for generating company profile pitch decks
---

# Compro Orchestrator

Drives the company profile creation lifecycle across all specialized sub-skills.

## Pipeline State Machine

1. **Gate 0 - Intake Check**: Check `input/` folder for `business-knowledge-base.md`, `brand-story-guide.md`, and logo asset. Stop and request missing items if incomplete.
2. **Phase 1 - Drafting**: Invoke `/writer`.
3. **Phase 2 - Content Review**: Invoke `/reviewer`.
   - If `REVISION_REQUIRED`, re-invoke `/writer` (max 3 loops).
   - If `APPROVED`, proceed to Content SEO.
4. **Phase 3 - Content SEO**: Invoke `/seo` (content mode).
5. **Phase 4 - HTML Deck Build**: Invoke `/builder`.
6. **Phase 5 - Technical SEO**: Invoke `/seo` (technical mode).
   - If `FIX_REQUIRED`, re-invoke `/builder` (max 3 loops).
   - If `PASSED`, proceed to Publishing.
7. **Phase 6 - Pre-flight Publish**: Invoke `/publisher`.
8. **Phase 7 - Deployment**: If deployment target is Vercel and status is `READY_TO_DEPLOY`, invoke `/deploy-to-vercel`.