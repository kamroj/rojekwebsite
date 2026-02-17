## Sanity publish -> Netlify rebuild (Astro SSG)

Target workflow:

1. When content is published in Sanity, Netlify rebuilds the frontend from branch `develop`.
2. When code is pushed to Git, Netlify rebuilds the branch that was pushed (for example `develop` or `develop-astro`).

This keeps CMS content refresh predictable (always `develop`) and code deploys branch-aware.

## 1) Netlify setup

### A. Enable branch deploys

In Netlify site settings:

- Enable branch deploys.
- Make sure both branches are included:
  - `develop`
  - `develop-astro`

### B. Create a build hook locked to `develop`

1. Go to **Site settings -> Build & deploy -> Build hooks**.
2. Click **Add build hook**.
3. Choose branch: **develop**.
4. Name it for example: `sanity-publish-develop`.
5. Copy the generated URL.

## 2) Sanity setup

1. Go to **Sanity Manage -> API -> Webhooks**.
2. Click **Create webhook**.
3. URL: paste the Netlify build hook URL created in step 1B.
4. Triggers: enable publish-related events (at least create/update/delete).
5. Save.

Optional: add a GROQ filter if only selected document types should trigger a rebuild.

## 3) Verify

### A. CMS change test

1. Publish a document in Sanity.
2. In Netlify Deploys, confirm a new build starts from `develop`.

### B. Code push test

1. Push commit to `develop-astro`.
2. Confirm Netlify builds `develop-astro` branch deploy.
3. Push commit to `develop` and confirm `develop` build.

## Notes

- No custom script is required in this repository for this flow.
- Keep the Netlify build hook URL secret.
