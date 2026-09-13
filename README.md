# t3n-x402-html-json-agent

**Superteam Earn bounty:** [Try out new docs to build a trusted agent with T3N](https://earn.superteam.fun/listing/t3n-agent-build-challenge/) (290 USDC pool, deadline 2026-09-16).

## What this agent does

Enterprise-ready **HTML → structured JSON** extraction agent:

1. **Live production rail already paying on Base USDC (x402)** — `https://veriton-x402-proxy.vercel.app`
2. **T3N ADK identity/audit wrap** (when `T3N_API_KEY` is set) so enterprises get `did:t3n` + TEE trust anchor without rewriting the extraction core
3. **Easy maintenance** — one Vercel origin, open discovery document, no always-on tunnel

## Why useful (enterprise)

- Agents and backends need **clean JSON from messy HTML** without standing up scrapers
- Metered **0.01 USDC** calls on Base — no API key provisioning drama for buyers
- Optional T3N layer adds **verifiable agent identity** and audited actions for compliance-minded teams

## Quick start

```bash
npm install
npm run smoke:x402    # live health + discovery + 402 paywall probe (no secrets)
npm run agent:demo    # JSON demo report
# after claim key:
export T3N_API_KEY=...
npm run quickstart    # did:t3n authenticate
```

Claim key (shown once): https://www.terminal3.io/claim-page  
Docs walkthrough: https://docs.terminal3.io/developers/adk/get-started/quickstart

## Handover

**Prefer to continue running** this agent under Veriton ops (Base USDC pay-to `0xa75Cc8545B169F0BeF2f29c9CCF86bc686D039E8`).  
Handover package if Terminal 3 wants to host: this repo + Vercel project transfer notes in `docs/HANDOVER.md`.

## Submission

See `docs/SUBMISSION.md` (public write-up; GitHub-native stand-in for Google Doc until Doc link is attached).

## Bugs / docs friction

Logged in `docs/BUGS.md` for Superteam judging (bug submission quality).

## License

MIT
