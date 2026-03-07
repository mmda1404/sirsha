---
description: The full pause -> test -> deploy -> verify cycle for Railway
---

# Deployment Workflow

This workflow automates the transition from local development to a live Railway deployment.

1. Stop the current production bot to prevent bot-fighting.
// turbo
`railway down`

2. Verify the project is type-safe and error-free.
// turbo
`npx tsc --noEmit`

3. Deploy the latest changes to Railway in detached mode.
// turbo
`railway up --detach`

4. Monitor the live logs for 60 seconds to ensure a successful restart.
// turbo
`railway logs --lines 40`
