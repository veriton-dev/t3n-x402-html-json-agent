import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const secret = 'private-sensitive-token';
const valid = { x402Version: 2, resource: { url: 'https://example.test/v1/html-to-json' }, accepts: [{ scheme: 'exact', network: 'eip155:8453', asset: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', payTo: '0x209693Bc6afc0C5328bA36FaF03C514EF312287C', amount: '100', maxTimeoutSeconds: 60, extra: { name: 'USD Coin', version: '2' } }] };
function run(script, status, body, extra = {}, header = false) {
  const dir = mkdtempSync(join(tmpdir(), 'x402-test-'));
  const mock = join(dir, 'mock.mjs');
  writeFileSync(mock, `globalThis.fetch = async (url) => { if (String(url).endsWith('/health')) return Response.json({ok:true}); if (String(url).endsWith('/.well-known/x402')) return Response.json({name:'test'}); return ${header ? `new Response('', {status: ${status}, headers: {'payment-required': ${JSON.stringify(Buffer.from(JSON.stringify(body)).toString('base64'))}}})` : `new Response(${JSON.stringify(typeof body === 'string' ? body : JSON.stringify(body))}, {status: ${status}})`}; };`);
  const env = { ...process.env, NODE_OPTIONS: `--import=${mock}`, T3N_API_KEY: '', ...extra };
  for (const key of Object.keys(env)) if (key.startsWith('X402_EXPECT_') && !(key in extra)) delete env[key];
  return spawnSync(process.execPath, ['--import', 'tsx', script], { encoding: 'utf8', env });
}
for (const script of ['src/smoke_x402.ts', 'src/agent_demo.ts']) {
  test(`${script}: non-402 fails closed`, () => assert.notEqual(run(script, 200, { secret }).status, 0));
  test(`${script}: malformed challenge fails closed without leaking body`, () => {
    const r = run(script, 402, secret); assert.notEqual(r.status, 0); assert.ok(!(r.stdout + r.stderr).includes(secret));
  });
  test(`${script}: configured mismatch fails without leaking configured values`, () => {
    const r = run(script, 402, valid, { X402_EXPECT_PAY_TO: secret }); assert.notEqual(r.status, 0); assert.ok(!(r.stdout + r.stderr).includes(secret));
  });
  test(`${script}: valid challenge succeeds with matching terms`, () => {
    const r = run(script, 402, valid, { X402_EXPECT_NETWORK: 'eip155:8453', X402_EXPECT_ASSET: valid.accepts[0].asset, X402_EXPECT_PAY_TO: valid.accepts[0].payTo, X402_EXPECT_AMOUNT: '100', X402_EXPECT_SCHEME: 'exact' }); assert.equal(r.status, 0, r.stderr);
  });
  test(`${script}: valid payment-required header succeeds`, () => assert.equal(run(script, 402, valid, {}, true).status, 0));
  test(`${script}: malformed terms fail`, () => assert.notEqual(run(script, 402, { ...valid, accepts: [{ ...valid.accepts[0], amount: '-1' }] }).status, 0));
}

const invalidCases = {
  'invented network': { ...valid, accepts: [{ ...valid.accepts[0], network: 'eip155:123456789' }] },
  'invented scheme': { ...valid, accepts: [{ ...valid.accepts[0], scheme: 'invented' }] },
  'non-Base EVM network': { ...valid, accepts: [{ ...valid.accepts[0], network: 'eip155:1' }] },
  'invalid URL': { ...valid, resource: { url: 'not-a-url' } },
  'non-http URL': { ...valid, resource: { url: 'file:///etc/passwd' } },
  'malformed extra': { ...valid, accepts: [{ ...valid.accepts[0], extra: [] }] },
  'missing extra': { ...valid, accepts: [{ ...valid.accepts[0], extra: undefined }] },
  'missing extra name': { ...valid, accepts: [{ ...valid.accepts[0], extra: { version: '2' } }] },
  'missing extra version': { ...valid, accepts: [{ ...valid.accepts[0], extra: { name: 'USDC' } }] },
  'unsupported transfer method': { ...valid, accepts: [{ ...valid.accepts[0], extra: { name: 'USDC', version: '2', assetTransferMethod: 'permit2' } }] },
  'bogus asset': { ...valid, accepts: [{ ...valid.accepts[0], asset: '0xasset' }] },
  'bogus recipient': { ...valid, accepts: [{ ...valid.accepts[0], payTo: '0xrecipient' }] },
  'amount above uint256': { ...valid, accepts: [{ ...valid.accepts[0], amount: (2n ** 256n).toString() }] },
  'missing amount': { ...valid, accepts: [{ ...valid.accepts[0], amount: undefined }] },
  'missing resource': { ...valid, resource: undefined },
  'unsupported extension': { ...valid, extensions: { example: { info: {}, schema: {} } } },
  'malformed extensions': { ...valid, extensions: [] },
};
for (const [name, challenge] of Object.entries(invalidCases)) {
  test(`unsupported or invalid ${name} fails closed`, () => assert.notEqual(run('src/smoke_x402.ts', 402, challenge).status, 0));
}
test('Base Sepolia and explicit eip3009 are accepted', () => {
  const term = { ...valid.accepts[0], network: 'eip155:84532', extra: { name: 'USDC', version: '2', assetTransferMethod: 'eip3009' } };
  assert.equal(run('src/smoke_x402.ts', 402, { ...valid, accepts: [term] }).status, 0);
});

test('maximum uint256 amount is accepted structurally', () => {
  const term = { ...valid.accepts[0], amount: ((2n ** 256n) - 1n).toString() };
  assert.equal(run('src/smoke_x402.ts', 402, { ...valid, accepts: [term] }).status, 0);
});
