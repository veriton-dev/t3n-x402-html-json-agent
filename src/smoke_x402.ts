import { X402 } from "./config.js";

async function main() {
  const health = await fetch(X402.health);
  const hj = await health.json();
  console.log("health", health.status, hj.ok, hj.version);

  const disc = await fetch(X402.discovery);
  const dj = await disc.json();
  console.log("discovery", disc.status, dj.name || dj.service || Object.keys(dj).slice(0, 6));

  // Free/teaser or 402 challenge path — do not send payment in smoke.
  const probe = await fetch(new URL(X402.htmlToJsonPath, X402.origin), {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      html: "<html><body><h1>Veriton T3N smoke</h1><p>hello</p></body></html>",
      url: "https://example.com/t3n-smoke",
    }),
  });
  const bodyText = await probe.text();
  console.log("html-to-json probe", probe.status, bodyText.slice(0, 240).replace(/\s+/g, " "));
  if (probe.status === 402) {
    console.log("x402 paywall intact (expected without payment header)");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
