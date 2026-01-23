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
