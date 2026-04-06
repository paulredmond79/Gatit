# Copilot Instructions

## Project Overview

This repository serves a static HTML page (`index.html`) via an **nginx** container.
The nginx configuration lives in `nginx.conf` and the container is defined in `Dockerfile`.
A `docker-compose.yml` is provided for local development.

## Keeping Docker Files in Sync

Whenever changes are made to the repository that affect how the application is built or
served, **both `Dockerfile` and `docker-compose.yml` must be updated** to reflect those
changes.

### When to update the `Dockerfile`

- A new static file (HTML, CSS, JS, image, font, etc.) is added that needs to be served —
  add a corresponding `COPY` instruction.
- The nginx base image version should be bumped when security patches are required.
- If the nginx configuration file is renamed or moved, update the `COPY` path.
- If a different port is used, update the `EXPOSE` instruction.

### When to update `docker-compose.yml`

- If the host port mapping needs to change, update the `ports` section.
- If environment variables, volumes, or additional services (e.g. a reverse proxy) are
  needed, add them as new entries.
- If the build context or Dockerfile location changes, update the `build` section.
- Keep the compose file compatible with the `Dockerfile`; if the exposed port in the
  Dockerfile changes, reflect that in the compose `ports` mapping.

### When to update `nginx.conf`

- If new URL paths or virtual hosts are required.
- If the trusted proxy IP ranges (used for `real_ip_from`) change.

## Local Development

Build and run the site locally with:

```bash
docker compose up --build
```

The site will be available at <http://localhost:8080>.

To stop the containers:

```bash
docker compose down
```

## CI/CD

The GitHub Actions workflow (`.github/workflows/docker-publish.yml`) builds a
multi-platform image (`linux/amd64`, `linux/arm64`) and pushes it to the GitHub Container
Registry (`ghcr.io`) on every push to `main`. Ensure the workflow remains consistent with
any structural changes to the `Dockerfile`.
