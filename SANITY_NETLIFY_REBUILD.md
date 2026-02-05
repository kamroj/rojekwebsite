## Sanity -> Netlify rebuild (Astro SSG)

This project is deployed on Netlify as a static site (Astro `output: static`).
To make content updates from Sanity visible on the website, Netlify must rebuild the site.

### 1) Create a Netlify Build Hook

1. Go to **Netlify Dashboard → Site settings → Build & deploy → Build hooks**.
2. Click **Add build hook**.
3. Name it e.g. `sanity-publish`.
4. Copy the generated hook URL.

Keep it secret (treat it like a token).

### 2) Create a Webhook in Sanity Studio

1. Go to **Sanity Manage → API → Webhooks** for the correct project/dataset.
2. Click **Create webhook**.
3. URL: paste the Netlify build hook URL.
4. Triggers: enable **Create**, **Update**, **Delete** (at minimum publish-related events).
5. Filter (optional): you can limit to specific document types if needed.

### 3) Verify

1. Publish/update a document in Sanity.
2. In Netlify → **Deploys** you should see a new deploy triggered by the build hook.

### Notes

- For local development, the site fetches content directly from Sanity and does not require Netlify rebuilds.
- For production (SSG), the rebuild is required to regenerate static HTML.
