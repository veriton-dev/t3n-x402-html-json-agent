# Handover

This source is a client demo only; it does not contain the extraction service or integrated audit functionality. The configured external deployment and its current availability, pricing and payment terms are unverified. A fork of this repository alone cannot host the service.

1. Independently identify and obtain the service source, deployment, ownership and authorization before attempting a transfer or deployment.
2. Verify the endpoint and current payment terms out of band. Configure the appropriate `X402_EXPECT_*` variables documented in the README; do not rely on defaults for price or recipient assurance.
3. Run `npm test` for offline mock coverage. `npm run agent:demo` and `npm run smoke:x402` issue unpaid network probes and fail if health, discovery or the expected x402 challenge fails. These checks do not verify payment settlement or comprehensive access control.
4. If using optional T3N authentication, keep `T3N_API_KEY` in host secrets. Authentication is separate from extraction and is not an integrated audit trail.
