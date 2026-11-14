# t3n-x402-html-json-agent

> **Status and safety notice (2026-11-14):** This repository contains a client/demo, not the extraction or payment server. The documented endpoint returned HTTP 502 when checked; current availability, pricing, payment enforcement, and settlement are **not verified**. Do not send a payment based on the historical claims below. The T3N demo shows separate testnet authentication, not a verified extraction-request audit integration. The existing smoke/demo commands can exit successfully even when the unpaid extraction probe returns HTTP 200, so they must **not** be used as a paywall security gate. The statements below describe historical intended or claimed behavior, not current verified service.

The notice above is preserved verbatim from public commit `3a335ca`. The HTTP 200 behavior describes that historical revision; the current probes reject non-402 responses. They still are not a comprehensive paywall security gate.

This repository contains a **client demo**, not the extraction service, x402 server, payment settlement implementation, or an integrated audit system. The configured external service's deployment, availability, pricing, recipient and behavior are currently **unverified**. Historical files under `samples/` and `docs/SUBMISSION.md` are not evidence of present operation; any claims there are historical and unverified. T3N authentication is optional and separate from extraction; it does not establish audited actions.

## Run

```bash
npm install
npm test                 # local mocks only, no payment
npm run smoke:x402       # unpaid network probes; nonzero on failed checks
npm run agent:demo       # unpaid probes, optionally attempts T3N testnet auth
npm run quickstart       # optional T3N testnet authentication
```

Both probes require successful health and discovery responses and an x402 v2 challenge containing at least one option matching the narrowly supported profile from an unpaid extraction request. A 200 or any other non-402 response fails. The validator accepts a JSON body or base64 `PAYMENT-REQUIRED` header, checks a narrow subset: exact EVM EIP-3009 on Base mainnet (`eip155:8453`) or Base Sepolia (`eip155:84532`), including EIP-712 name and version, and checks explicitly configured terms against a single accepted option. Set any independently verified expectations using `X402_EXPECT_NETWORK`, `X402_EXPECT_ASSET`, `X402_EXPECT_PAY_TO`, `X402_EXPECT_AMOUNT` (integer atomic units), and `X402_EXPECT_SCHEME`. Comparisons are exact, including case. Other schemes and transfer methods are rejected. This is not complete protocol, on-chain, checksum, signature, asset-capability, or extension semantics validation; nonempty extensions are rejected because their semantics are not implemented. It accepts one supported option even if other options are unsupported or malformed; it does not validate every option. Resource URLs are checked for syntax only, not matched to the requested endpoint. Zero amounts are structurally accepted and require an independently verified expectation if inappropriate. Based on the [x402 v2 core](https://github.com/coinbase/x402/blob/main/specs/x402-specification-v2.md) and [exact EVM](https://github.com/coinbase/x402/blob/main/specs/schemes/exact/scheme_exact_evm.md) specifications. No expected terms are assumed by default: without them a structurally valid challenge does **not** establish the intended price, asset, recipient, network or authenticity. Verify the service and terms independently; these scripts never make payments or test settlement. They do not prove that every endpoint or request is gated.

Set `T3N_API_KEY` only in a secure environment if trying optional authentication. Do not paste secrets into logs. See [handover](docs/HANDOVER.md).

## License
MIT
