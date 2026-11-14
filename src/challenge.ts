/** Check a deliberately narrow x402 v2 exact/Base EIP-3009 challenge; never echo server data. */
type Expected = { network?: string; asset?: string; payTo?: string; amount?: string; scheme?: string };

export function expectedTerms(env: NodeJS.ProcessEnv = process.env): Expected {
  const fields = { network: env.X402_EXPECT_NETWORK, asset: env.X402_EXPECT_ASSET,
    payTo: env.X402_EXPECT_PAY_TO, amount: env.X402_EXPECT_AMOUNT, scheme: env.X402_EXPECT_SCHEME };
  if (Object.values(fields).some(v => v !== undefined && !v.trim())) throw new Error("Invalid expected terms configuration");
  return fields;
}

const object = (v: unknown): v is Record<string, any> => v !== null && typeof v === "object" && !Array.isArray(v);
const text = (v: unknown): v is string => typeof v === "string" && v.trim().length > 0;
const uint256 = (v: unknown): boolean => {
  if (typeof v !== "string" || !/^\d{1,78}$/.test(v)) return false;
  return BigInt(v) <= (1n << 256n) - 1n;
};
const address = (v: unknown): boolean => typeof v === "string" && /^0x[0-9a-fA-F]{40}$/.test(v);
function httpUrl(v: unknown): boolean {
  if (typeof v !== "string" || v !== v.trim() || /[\s\u0000-\u001f\u007f]/.test(v)) return false;
  try { const url = new URL(v); return (url.protocol === "http:" || url.protocol === "https:") && !!url.hostname && !url.username && !url.password; }
  catch { return false; }
}
function validResource(v: unknown): boolean {
  if (!object(v) || !httpUrl(v.url)) return false;
  if (["description", "mimeType"].some(k => k in v && typeof v[k] !== "string")) return false;
  const printable = (s: unknown) => typeof s === "string" && /^[\x20-\x7e]{0,32}$/.test(s);
  return (!("serviceName" in v) || printable(v.serviceName)) &&
    (!("tags" in v) || (Array.isArray(v.tags) && v.tags.length <= 5 && v.tags.every(printable))) &&
    (!("iconUrl" in v) || (typeof v.iconUrl === "string" && v.iconUrl.length <= 2048 && httpUrl(v.iconUrl)));
}
function validExtensions(v: unknown): boolean {
  // Extension semantics are not implemented; fail closed rather than certify them.
  return object(v) && Object.keys(v).length === 0;
}
function supportedTerm(term: unknown): term is Record<string, any> {
  if (!object(term) || term.scheme !== "exact" || !["eip155:8453", "eip155:84532"].includes(term.network) ||
      !address(term.asset) || !address(term.payTo) || !uint256(term.amount) ||
      !Number.isSafeInteger(term.maxTimeoutSeconds) || term.maxTimeoutSeconds <= 0 || !object(term.extra)) return false;
  const extra = term.extra;
  return text(extra.name) && text(extra.version) &&
    (extra.assetTransferMethod === undefined || extra.assetTransferMethod === "eip3009") &&
    (extra.paymentFlow === undefined || extra.paymentFlow === "authorization");
}
export async function validateChallenge(response: Response, expected: Expected = expectedTerms()): Promise<void> {
  if (response.status !== 402) throw new Error("Unpaid extraction did not return HTTP 402");
  let challenge: unknown;
  try {
    const header = response.headers.get("payment-required");
    challenge = header ? JSON.parse(Buffer.from(header, "base64").toString("utf8")) : await response.json();
  } catch { throw new Error("Invalid x402 challenge"); }
  if (!object(challenge) || challenge.x402Version !== 2 || !Array.isArray(challenge.accepts) || !challenge.accepts.length ||
      !validResource(challenge.resource) || ("error" in challenge && typeof challenge.error !== "string") ||
      ("extensions" in challenge && !validExtensions(challenge.extensions))) throw new Error("Invalid x402 challenge");
  const acceptable = challenge.accepts.some((term: unknown) => supportedTerm(term) &&
    Object.entries(expected).every(([field, value]) => value === undefined || term[field] === value));
  if (!acceptable) throw new Error("Invalid or unexpected x402 payment terms");
}
