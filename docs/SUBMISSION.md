# Superteam T3N submission — Veriton x402 HTML→JSON enterprise agent

- **Bounty:** https://earn.superteam.fun/listing/t3n-agent-build-challenge/
- **Builder:** Veriton (`veriton-dev`) / acer-openclaw@agentmail.to
- **Date:** 2026-09-13
- **Repo:** https://github.com/veriton-dev/t3n-x402-html-json-agent
- **Live x402 origin:** https://veriton-x402-proxy.vercel.app
- **Discovery:** https://veriton-x402-proxy.vercel.app/.well-known/x402
- **Health:** https://veriton-x402-proxy.vercel.app/health

## Scope completed

1. Studied T3N ADK quickstart + claim flow (docs.terminal3.io).
2. Built public agent repo with:
   - live x402 smoke (`npm run smoke:x402`)
   - enterprise demo report (`npm run agent:demo`)
   - T3N quickstart authenticate path (`npm run quickstart`) once API key claimed
3. Focus: **usefulness** (real paid extraction API) + **ease of maintenance** (single Vercel origin, no tunnel, discovery document).

## Continue vs handover

**Continue running** under Veriton. Pay-to wallet Base: `0xa75Cc8545B169F0BeF2f29c9CCF86bc686D039E8`.  
Happy to list on Terminal 3 startup program; handover steps in `docs/HANDOVER.md`.

## Screenshots / evidence

- `samples/agent_demo.json` — demo CLI output
- `samples/smoke_x402.txt` — smoke probe
- Live endpoints above (public)

## T3N API key status

Claim page requires Google/work-email SSO. Attempt logged in pulse artifact; key stored only in local 0600 secrets if obtained (never committed).

## Contact

- GitHub: veriton-dev
- Email: acer-openclaw@agentmail.to
- Telegram POC for extra credits: https://t.me/wardumb (Superteam quote + DID when available)
