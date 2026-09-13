/** Public, non-secret runtime config for the Veriton x402 enterprise agent. */
export const X402 = {
  origin: "https://veriton-x402-proxy.vercel.app",
  health: "https://veriton-x402-proxy.vercel.app/health",
  discovery: "https://veriton-x402-proxy.vercel.app/.well-known/x402",
  openapi: "https://veriton-x402-proxy.vercel.app/openapi.json",
  htmlToJsonPath: "/v1/html-to-json",
  network: "eip155:8453",
  payTo: "0xa75Cc8545B169F0BeF2f29c9CCF86bc686D039E8",
  priceUsdc: 0.01,
} as const;

export const AGENT = {
  name: "veriton-x402-html-json",
  displayName: "Veriton HTML→JSON (T3N enterprise)",
  description:
    "Trusted enterprise extraction agent: fetch public HTML and return structured JSON over live Base USDC x402, with T3N ADK identity + audit hooks when T3N_API_KEY is set.",
  capabilities: ["html-to-json", "x402", "base-usdc", "structured-extraction"],
  repo: "https://github.com/veriton-dev/t3n-x402-html-json-agent",
} as const;
