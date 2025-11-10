# Frontend API & Auth Integration Guide

This short guide explains the edits made to wire the frontend to the backend and to add a resilient axios client with auth/refresh support.

Files added/changed
- `src/lib/api.ts` — axios instance with request/response interceptors. Exports default `api` and `setAuthToken(token?)` helper.
- `src/contexts/AuthContext.tsx` — React Context that stores the token in `localStorage` (key: `sasa_token`) and exposes `login(token, user, refreshToken?)` and `logout()` helpers. It calls `setAuthToken` to update axios headers.
- `src/components/AuthForms.tsx` — login form updated to call `/auth/login` and persist tokens (falls back to simulated flow if backend unavailable).
- `src/components/AuthDebug.tsx` — small debug component that shows current token and user and allows forcing logout.

Key behaviors
- Token storage:
  - Access token: `localStorage['sasa_token']`
  - Refresh token: `localStorage['sasa_refresh']` (optional — set by your login endpoint if used)

- Request interceptor:
  - Every request attaches `Authorization: Bearer <token>` if `sasa_token` is present.

- Response interceptor:
  - On a 401 response, the interceptor will attempt a single refresh by POSTing to `<API_BASE>/auth/refresh` with `{ token: <refreshToken> }`.
  - If refresh succeeds, it stores the new token in `sasa_token`, updates headers, and retries the original request.
  - If refresh fails, it clears stored tokens and redirects to `/login`.

Configuration
- API base URL can be configured with environment variables used by Vite:
  - `VITE_API_BASE_URL` (preferred)
  - `VITE_API_URL` (fallback)
  - Default: `http://localhost:4000/api`

How to use in components
- Wrap your app root with `<AuthProvider>` (done in `src/main.tsx`).
- In login flows, call your backend login endpoint, then call `login(token, user, refreshToken)` from `useAuth()` to persist the token and set axios headers. Example:

```ts
// pseudo-code inside a login handler
const { login } = useAuth();
const resp = await api.post('/auth/login', { email, password });
login(resp.data.token, resp.data.user, resp.data.refreshToken);
```

Notes & next steps
- Server endpoints: ensure your backend exposes `/api/auth/refresh` (or adjust `api.ts` to match your refresh path). The client expects `/auth/refresh` appended to API base.
- Consider adding server-side token expiry checks and a proper refresh token rotation policy for production.
- If you want stricter typing, add interfaces for auth responses and update the `AuthContext` accordingly. A small `src/types/auth.ts` file was added with basic interfaces.

If anything here conflicts with your backend endpoints or token names, I can adapt the client to match your API.
