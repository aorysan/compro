---
name: seo
description: Perform content SEO planning or technical HTML SEO validation
---

# SEO Skill

Supports two modes depending on pipeline stage.

## Mode 1: Content SEO (Post-Review)
**Inputs**: `artifacts/02-company-profile-final.md`, `input/business-knowledge-base.md`  
**Outputs**: `artifacts/03-seo-brief.md`  
**Focus**: Keywords, SEO title, meta description, structured data recommendations (Organization/LocalBusiness), canonical URLs.

## Mode 2: Technical SEO (Post-Build)
**Inputs**: `site/`, `artifacts/03-seo-brief.md`  
**Outputs**: `qa/seo-report.md`  
**Focus**: Validate HTML semantics, meta tags in `site/index.html`, `robots.txt`, `sitemap.xml`, local asset optimization, image alt text.
**Statuses**: `PASSED` or `FIX_REQUIRED`.