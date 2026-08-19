---
name: deploy-to-vercel
description: Deploy site/ directory to Vercel using Vercel CLI
---

# Deploy to Vercel Skill

Deploys the static site to Vercel via CLI.

## Inputs
- `site/`
- `input/deployment-config.md`

## Outputs
- `deploy/vercel-preview-url.txt`
- `deploy/vercel-production-url.txt`
- `deploy/deployment-status.md`

## Execution Steps
1. Run `vercel` command via Bash tool for preview deployment.
2. Capture deployment output and extract Preview URL.
3. Save Preview URL to `deploy/vercel-preview-url.txt`.
4. Production deploy (`vercel --prod`) MUST be explicitly requested by user.