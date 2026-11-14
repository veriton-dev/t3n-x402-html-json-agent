import { X402 } from "./config.js";
import { validateChallenge } from "./challenge.js";

async function main() {
  const health = await fetch(X402.health);
  const hj: any = await health.json();
  if (!health.ok || hj.ok !== true) throw new Error("Health check failed");
  console.log("health OK");
  const disc = await fetch(X402.discovery);
  if (!disc.ok) throw new Error("Discovery check failed");
  await disc.json();
  console.log("discovery OK");
  const probe = await fetch(new URL(X402.htmlToJsonPath, X402.origin), {
    method: "POST", headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({ html: "<html><body><h1>Smoke</h1></body></html>" }),
  });
  await validateChallenge(probe);
  console.log("unpaid extraction returned a valid x402 challenge");
}
main().catch(() => { console.error("x402 smoke check failed"); process.exitCode = 1; });
