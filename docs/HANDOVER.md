# Handover (if Terminal 3 hosts)

1. Transfer or fork `veriton-dev/t3n-x402-html-json-agent`.
2. Keep extraction core pointed at a stable HTTPS origin with `/.well-known/x402`.
3. Rotate `payTo` wallet if T3N receives funds; update discovery document.
4. Set `T3N_API_KEY` in host secrets; never bake into image.
5. Run `npm run agent:demo` in CI as health gate.
