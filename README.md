# rojekwebsite

## Sanity (CMS) — konfiguracja frontendu

Frontend pobiera dane z Sanity przez publiczne API (bez tokena) i pokazuje globalny `LoadingScreen` **tylko** wtedy, gdy:
- trwa pobieranie danych z Sanity (`pendingTasks`), lub
- trwa preload zasobów (obrazów / wideo) wynikających z odpowiedzi z Sanity.

### Zmienne środowiskowe

Skopiuj `.env.example` do `.env` i uzupełnij wartości:

```bash
VITE_SANITY_PROJECT_ID=6sp9tyie
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2025-01-01
```

## Sanity auto-translation (PL -> EN/DE/FR)

Sanity Studio includes an auto-translation button for localized fields with `pl/en/de/fr` values.

### Netlify env

```bash
OPENAI_API_KEY=xxxx
# optional
OPENAI_MODEL=gpt-5-mini

# required secret for Studio -> Netlify auth
TRANSLATE_SHARED_SECRET=your-long-random-secret

# CORS for production Sanity Studio (comma-separated list)
# preferred (dedicated only for translation function)
TRANSLATE_ALLOWED_ORIGINS=https://your-studio.sanity.studio,http://localhost:3333
# when Studio has random subdomain, wildcard is supported:
# TRANSLATE_ALLOWED_ORIGINS=https://*.sanity.studio,http://localhost:3333
# optional single value variant
TRANSLATE_ALLOWED_ORIGIN=https://your-studio.sanity.studio

# fallback (global variables, still supported)
ALLOWED_ORIGINS=https://your-studio.sanity.studio,http://localhost:3333
ALLOWED_ORIGIN=https://your-studio.sanity.studio
```

### Local run

```bash
netlify dev
```

This enables `POST /.netlify/functions/translate`, used by the custom Sanity input.

### Production Sanity Studio (important)

If your Studio is hosted on `*.sanity.studio`, `/.netlify/functions/translate` will not work as a relative URL there.
Set a full endpoint URL in Studio env:

```bash
SANITY_STUDIO_TRANSLATE_ENDPOINT=https://your-netlify-site.netlify.app/.netlify/functions/translate
SANITY_STUDIO_TRANSLATE_SECRET=your-long-random-secret
```

And make sure Netlify function CORS allows your Studio origin via `ALLOWED_ORIGINS`.

### File-based Studio env setup (your case)

If your Studio reads env from files in `sanity/`, use:

- `sanity/.env.production`

```bash
SANITY_STUDIO_TRANSLATE_ENDPOINT=https://rojekokna.pl/.netlify/functions/translate
SANITY_STUDIO_TRANSLATE_SECRET=CHANGE_ME_SAME_AS_NETLIFY_TRANSLATE_SHARED_SECRET
```

- `sanity/.env.development`

```bash
SANITY_STUDIO_TRANSLATE_ENDPOINT=http://localhost:8888/.netlify/functions/translate
SANITY_STUDIO_TRANSLATE_SECRET=CHANGE_ME_SAME_AS_NETLIFY_TRANSLATE_SHARED_SECRET
```

Then rebuild/redeploy Studio after env changes.

If you still see CORS mismatch, check the exact browser origin in DevTools error.
For example, if origin is `https://rojekoid.sanity.studio`, allow that exact host
or use wildcard `https://*.sanity.studio` in `TRANSLATE_ALLOWED_ORIGINS`.