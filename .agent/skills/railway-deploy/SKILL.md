---
name: railway-deploy
description: Handle the full deployment cycle for Sirsha on Railway.
---

# Railway Deployment Skill

This skill allows the agent to manage the deployment lifecycle of Sirsha on Railway. 

## Capabilities
- Pause the live service to avoid Telegram polling conflicts.
- Execute local type-checks and tests.
- Manage environment variables on Railway.
- Trigger deployments and monitor logs.

## Core Rules
- **Pause Before Local**: Always run `railway down` before starting the local dev server (`npm run dev`) or running local tests.
- **Type-Check**: Always verify with `npx tsc --noEmit` before every deployment.
- **Detached Ups**: Use `railway up --detach` to trigger builds without blocking the terminal.
- **Verify Logs**: Always run `railway logs --lines 40` after a deploy to confirm the bot is online and the heartbeat is scheduled.
