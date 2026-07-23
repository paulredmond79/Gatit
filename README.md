# Gatit

"Days since Galen was at it" — a shared counter that anyone visiting the page can reset.

## Running

```
docker build -t gatit .
docker run -p 8080:80 -v gatit-data:/data gatit
```

The `/data` volume persists the counter's reset timestamp across container restarts. Without it, the count resets to 0 whenever the container restarts.

## How it works

- `server.js` is a small Express app that serves the static page from `public/` and exposes two endpoints:
  - `GET /api/status` — returns the timestamp the counter last reset from
  - `POST /api/reset` — resets the counter to now (shared across all visitors)
- The page computes "days since" client-side from that timestamp, ticking over at local midnight.
- Clicking the reset button shows a random sarcastic confirmation before it commits the reset.