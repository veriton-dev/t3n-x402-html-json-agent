/** Read-only demo: no payment is sent. */
import { X402, AGENT } from "./config.js";
import { validateChallenge } from "./challenge.js";

async function main() {
  const out: { agent: typeof AGENT; x402: { health_ok: boolean; discovery_ok: boolean; paywall_ok: boolean }; t3n: { connected: boolean; tenantDid?: string; error?: string } } = {
    agent: AGENT, x402: { health_ok: false, discovery_ok: false, paywall_ok: false },
    t3n: { connected: false, error: "T3N_API_KEY not set" },
  };
  try {
    const h = await fetch(X402.health);
    const body: any = await h.json();
    out.x402.health_ok = h.ok && body.ok === true;
  } catch {}
  try {
    const d = await fetch(X402.discovery);
    if (d.ok) { await d.json(); out.x402.discovery_ok = true; }
  } catch {}
  try {
    const p = await fetch(new URL(X402.htmlToJsonPath, X402.origin), {
      method: "POST", headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({ html: "<html><body><h1>demo</h1></body></html>" }),
    });
    await validateChallenge(p);
    out.x402.paywall_ok = true;
  } catch {}
  if (process.env.T3N_API_KEY) {
    try {
      const { T3nClient, setEnvironment, loadWasmComponent, fetchTrustedManifest, eth_get_address, metamask_sign, createEthAuthInput } = await import("@terminal3/t3n-sdk");
      setEnvironment("testnet");
      const wasmComponent = await loadWasmComponent();
      const address = eth_get_address(process.env.T3N_API_KEY);
      const t3n = new T3nClient({ trustAnchor: await fetchTrustedManifest("testnet"), wasmComponent,
        handlers: { EthSign: metamask_sign(address, undefined, process.env.T3N_API_KEY) } });
      await t3n.handshake();
      const did = await t3n.authenticate(createEthAuthInput(address));
      out.t3n = { connected: true, tenantDid: did.value };
    } catch { out.t3n = { connected: false, error: "T3N authentication failed" }; }
  }
  console.log(JSON.stringify(out, null, 2));
  if (!out.x402.health_ok || !out.x402.discovery_ok || !out.x402.paywall_ok) process.exitCode = 2;
}
main().catch(() => { console.error("Demo failed"); process.exitCode = 1; });
