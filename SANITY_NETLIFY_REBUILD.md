## Sanity publish -> Netlify rebuild (Astro SSG)

## New workflow (manual website publish only)

Content publishing and website deployment are now intentionally separated:

1. In Studio go to **Panel treści -> Akcje**.
2. Click **Opublikuj wszystkie wersje robocze** (publishes drafts only, no website build).
3. Then click **Opublikuj na stronę** (triggers exactly one Netlify build hook call).

Important: normal single-document publish in Sanity should not trigger Netlify. Only **Opublikuj na stronę** should do that.

## 1) Netlify setup

### A. Enable branch deploys

In Netlify site settings:

- Enable branch deploys.
- Make sure both branches are included:
  - `main`
  - `develop`

### B. Create a build hook locked to `main`

1. Go to **Site settings -> Build & deploy -> Build hooks**.
2. Click **Add build hook**.
3. Choose branch: **main**.
4. Name it for example: `sanity-publish-main`.
5. Copy the generated URL.

## 2) Sanity Studio env setup (required)

Set this in Studio env files:

```bash
SANITY_STUDIO_NETLIFY_BUILD_HOOK=https://api.netlify.com/build_hooks/...
```

Suggested files:

- `sanity/.env.development`
- `sanity/.env.production`

## 3) Disable old per-document publish triggers (critical)

In **Sanity Manage -> API -> Webhooks**, disable or remove all webhooks that call Netlify for document publish events.

If these remain enabled, old behavior returns (automatic build after normal publish).

### What exactly to remove/disable

- Any webhook URL pointing to Netlify Build Hook endpoints (`https://api.netlify.com/build_hooks/...`)
- Any webhook configured for create/update/publish of documents and intended for frontend rebuild
- Any duplicate/legacy "Sanity -> Netlify rebuild" webhook entries

Keep only integrations unrelated to website build (if you use any).

## 4) Verify

### A. Draft publish test (no build expected)

1. Open Studio and click **Akcje -> Opublikuj wszystkie wersje robocze**.
2. Confirm drafts are published.
3. In Netlify Deploys, confirm that no new build starts.

### B. Website publish test (single build expected)

1. Ensure draft count is 0 in **Akcje**.
2. Click **Opublikuj na stronę** and confirm popup.
3. In Netlify Deploys, confirm exactly one new build starts.

### C. Code push test

1. Push commit to `develop`.
2. Confirm Netlify builds `develop` branch deploy.
3. Push commit to `main` and confirm `main` build.

## Notes

- Keep the Netlify build hook URL secret.
- "Opublikuj na stronę" is blocked when drafts exist.
- The single-trigger model depends on disabling legacy Sanity publish webhooks.
