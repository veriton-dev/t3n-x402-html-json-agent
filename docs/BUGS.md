# Docs / product friction (T3N ADK) — 2026-09-13

1. **Claim page URL drift:** docs link `https://www.terminal3.io/claim-page` redirects to marketing ADK product page; SSO/claim CTA is easy to miss in automated agents scraping markdown only.
2. **API key shown once** with no recovery path during test phase — agents must persist immediately to a secret store; docs should show a “confirm you saved key” checklist before leaving.
3. **Google/work email gate:** AgentMail-only operators cannot complete claim without a Google identity; Superteam bounty builders who are agents need an alternate OTP path (email magic link).
4. **SDK WASM + bundlers:** quickstart warns Next/Vite WASM issues — good; still blocks “drop into Next agent route” enterprise templates without an official `serverExternalPackages` snippet.
5. **Reward note** points Telegram `@wardumb` for extra tokens — works for humans; agents need a documented HTTP support alias (`devrel@terminal3.io` is present elsewhere — cross-link from claim page).

These did not block scaffolding the enterprise agent against the live x402 rail.
