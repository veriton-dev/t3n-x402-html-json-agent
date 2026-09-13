/**
 * Enterprise agent demo surface:
 * - Always: live x402 health + discovery (no secrets)
 * - Optional: T3N tenant DID when T3N_API_KEY present
 * This is the "useful + easy to maintain" core for Superteam T3N judging.
 */
import { X402, AGENT } from "./config.js";

type DemoResult = {
  agent: typeof AGENT;
  x402: {
    health_ok: boolean;
    version?: string;
    discovery_name?: string;
    paywall_status?: number;
  };
  t3n?: { connected: boolean; tenantDid?: string; error?: string };
  maintenance: string[];
};

async function main() {
  const out: DemoResult = {
    agent: AGENT,
    x402: { health_ok: false },
    maintenance: [
      "Single origin proxy on Vercel (no tunnel)",
      "Prices in /.well-known/x402",
      "stdlib-friendly clients; no custom chain code required for buyers",
      "Optional T3N wrap: identity + audit without rewriting extraction core",
    ],
  };

  try {
    const h = await fetch(X402.health);
    const hj: any = await h.json();
    out.x402.health_ok = !!hj.ok;
    out.x402.version = hj.version;
  } catch (e: any) {
    out.x402.health_ok = false;
  }

  try {
    const d = await fetch(X402.discovery);
    const dj: any = await d.json();
    out.x402.discovery_name = dj.name || dj.service;
  } catch {}

  try {
    const p = await fetch(new URL(X402.htmlToJsonPath, X402.origin), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ html: "<html><body><h1>demo</h1></body></html>" }),
    });
    out.x402.paywall_status = p.status;
  } catch {}

  if (process.env.T3N_API_KEY) {
    try {
      const {
        T3nClient,
        setEnvironment,
        loadWasmComponent,
        fetchTrustedManifest,
        eth_get_address,
        metamask_sign,
        createEthAuthInput,
      } = await import("@terminal3/t3n-sdk");
      setEnvironment("testnet");
      const wasmComponent = await loadWasmComponent();
      const address = eth_get_address(process.env.T3N_API_KEY);
      const t3n = new T3nClient({
        trustAnchor: await fetchTrustedManifest("testnet"),
        wasmComponent,
        handlers: { EthSign: metamask_sign(address, undefined, process.env.T3N_API_KEY) },
      });
      await t3n.handshake();
      const did = await t3n.authenticate(createEthAuthInput(address));
      out.t3n = { connected: true, tenantDid: did.value };
    } catch (e: any) {
      out.t3n = { connected: false, error: String(e?.message || e).slice(0, 300) };
    }
  } else {
    out.t3n = { connected: false, error: "T3N_API_KEY not set (claim-page required)" };
  }

  console.log(JSON.stringify(out, null, 2));
  if (!out.x402.health_ok) process.exit(2);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
