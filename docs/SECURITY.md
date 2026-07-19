# Security & Supply-Chain Notes

This is a fully static single-page app (Vite + React). It ships no backend,
reads no user data, and makes no third-party network requests at runtime. The
notes below document the hardening that lives in the repository and the
settings that must be applied by a repository owner because they cannot be
expressed in code.

## Content-Security-Policy

CSP is delivered two ways because a `<meta>` CSP tag cannot express every
directive (notably `frame-ancestors`, which browsers ignore in meta form):

1. **Build-time `<meta>` tag** — injected by the `inject-csp-meta` Vite plugin
   in `vite.config.js`. This applies only to the production build, so the dev
   server (which needs `'unsafe-inline'`/`'unsafe-eval'` for HMR) is untouched.
2. **`public/_headers`** — real HTTP response headers for hosts that read a
   `_headers` file (Netlify, Cloudflare Pages). This carries the full policy
   including `frame-ancestors 'none'` plus `X-Content-Type-Options`,
   `Referrer-Policy`, `X-Frame-Options`, and `Permissions-Policy`.

Policy:

```
default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';
img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none';
base-uri 'self'; form-action 'none'; frame-ancestors 'none'
```

Notes and limitations:

- `style-src` allows `'unsafe-inline'` because framer-motion writes inline
  `style` attributes on animated elements. Scripts do **not** allow inline or
  eval in the production bundle. This is a known, scoped trade-off.
- If your host does **not** consume `public/_headers`, replicate the same
  header block in that host's configuration so `frame-ancestors` and the other
  response-only headers take effect. The meta tag alone cannot enforce them.

## Subresource Integrity (SRI)

No SRI hashes are declared. All scripts, styles, and fonts are first-party and
same-origin, served under a `'self'`-only CSP; there are no cross-origin
subresources for SRI to protect. Vite's content-hashed filenames provide
cache-busting integrity for first-party assets but are **not** cryptographic
SRI, and are not represented as such.

## Self-hosted fonts

Inter and JetBrains Mono are self-hosted under `public/fonts/` — there are no
Google Fonts requests. License files are included alongside the font binaries:

- `public/fonts/Inter-LICENSE.txt` (SIL Open Font License 1.1)
- `public/fonts/JetBrainsMono-OFL.txt` (SIL Open Font License 1.1)

## Continuous Integration (`.github/workflows/ci.yml`)

- Runs on push to `main` and on every pull request.
- `permissions: contents: read` only — no write scopes are granted, so
  untrusted `pull_request` code cannot obtain a writable token.
- Every third-party action is pinned to an immutable full commit SHA with a
  version comment.
- `concurrency` cancels superseded runs; each job has a `timeout-minutes`.
- Steps: `npm ci`, `npm run lint`, `npm test`, `npm run build`.

## Release provenance & signing (`.github/workflows/release.yml`)

Triggered only by `v*` tags. Produces:

- A packaged `dist` tarball plus `SHA256SUMS`.
- A CycloneDX SBOM (`anchore/sbom-action`).
- A **keyless** SLSA build-provenance attestation via
  `actions/attest-build-provenance`, signed through GitHub's OIDC identity and
  the Sigstore public-good infrastructure. No long-lived signing keys or
  secrets are stored in the repository.

The provenance job elevates only `id-token: write` and `attestations: write`
(plus `contents: read`), which are the minimum scopes required for keyless
attestation.

## Owner-side actions required (cannot be done in code)

These require repository/organization settings or admin access:

1. **Branch protection on `main`** — require the CI check to pass and require
   pull-request review before merge.
2. **Restrict Actions permissions** — Settings → Actions → General: set the
   default `GITHUB_TOKEN` to read-only and disallow Actions from creating or
   approving pull requests.
3. **Enable Dependabot alerts / security updates** — the config in
   `.github/dependabot.yml` schedules version PRs, but alerting is a repo
   setting.
4. **Attest verification** — after the first tagged release, verify provenance
   with `gh attestation verify <artifact> --repo <owner>/<repo>`.
5. **Hosting headers** — if the deploy target does not read `public/_headers`,
   configure the equivalent response headers on that platform.
