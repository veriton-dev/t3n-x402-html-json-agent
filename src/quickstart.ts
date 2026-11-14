/**
 * T3N ADK quickstart (from Terminal 3 docs).
 * Requires env T3N_API_KEY from https://www.terminal3.io/claim-page (shown once).
 * Runs without key: prints setup instructions and exits 0 after documenting gap.
 */
import { X402, AGENT } from "./config.js";

async function main() {
  const key = process.env.T3N_API_KEY;
  if (!key) {
    console.log(JSON.stringify({
      ok: false,
      reason: "T3N_API_KEY missing",
      next: [
        "Sign in at https://www.terminal3.io/claim-page (Google/work email)",
        "Copy API key once; store in ~/.openclaw/secrets/t3n.json (0600)",
        "export T3N_API_KEY=... && npm run quickstart",
      ],
      agent: AGENT,
      x402_origin_unverified: X402.origin,
    }, null, 2));
    return;
  }

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
  const address = eth_get_address(key);
  const t3n = new T3nClient({
    trustAnchor: await fetchTrustedManifest("testnet"),
    wasmComponent,
    handlers: {
      EthSign: metamask_sign(address, undefined, key),
    },
  });
  await t3n.handshake();
  const did = await t3n.authenticate(createEthAuthInput(address));
  const tenantDid = did.value;
  console.log(JSON.stringify({ ok: true, tenantDid, address, agent: AGENT.name }, null, 2));
}

main().catch(() => {
  console.error("T3N quickstart failed");
  process.exit(1);
});
