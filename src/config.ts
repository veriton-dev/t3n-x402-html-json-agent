/** Public, non-secret runtime config for the Veriton x402 enterprise agent. */
export const X402 = {
  origin: "https://veriton-x402-proxy.vercel.app",
  health: "https://veriton-x402-proxy.vercel.app/health",
  discovery: "https://veriton-x402-proxy.vercel.app/.well-known/x402",
  openapi: "https://veriton-x402-proxy.vercel.app/openapi.json",
  htmlToJsonPath: "/v1/html-to-json",
} as const;

export const AGENT = {
  name: "veriton-x402-html-json",
  displayName: "Veriton HTML→JSON (T3N enterprise)",
  description:
    "Client demo for probing an external x402 HTML-to-JSON service and optionally authenticating with T3N.",
  capabilities: ["html-to-json", "x402", "structured-extraction"],
  repo: "https://github.com/veriton-dev/t3n-x402-html-json-agent",
} as const;
