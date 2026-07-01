# Catalog single-source-of-truth migration

**Goal:** every client reads the gear catalog from one canonical URL at runtime,
so the data can never drift between the app, the marketing site, and this Gear
Archive.

## Canonical endpoint

```
https://catalog.anglerbook.fun/catalog/gear.json
```

- Served by GitHub Pages from **this repo** (`GLYSK-OU/AnglerBook-catalog`).
- Response headers: `Access-Control-Allow-Origin: *` (safe for browser `fetch`)
  and `Cache-Control: max-age=600`.
- Top-level fields for change detection: `catalogVersion` and `generatedAt`.
- Current state at time of writing: `catalogVersion` `2026.07.01`,
  **1088 variants / 215 models** (includes the full Loop brand and the expanded
  Sage reel lineup).

## One-time infrastructure (owner action)

1. **DNS** — at the `anglerbook.fun` registrar, add:

   | Type | Name/Host | Value/Target |
   | --- | --- | --- |
   | `CNAME` | `catalog` | `glysk-ou.github.io` |

2. **Pages** — in `AnglerBook-catalog` → Settings → Pages, confirm the custom
   domain shows `catalog.anglerbook.fun` (it is set from the repo's `CNAME`
   file) and tick **Enforce HTTPS** once the certificate provisions.

   > Until the DNS record exists, `glysk-ou.github.io/AnglerBook-catalog`
   > redirects to `catalog.anglerbook.fun`, which will not resolve — so add the
   > DNS record promptly.

## Client changes

### `GLYSK-OU/AnglerBook-website` (the marketing site — serves anglerbook.fun)

This repo currently **bundles its own copy** of `catalog/gear.json`, which is
what went stale. Change it to fetch the canonical endpoint at runtime:

1. Wherever the site loads the catalog, replace the local path with:
   `https://catalog.anglerbook.fun/catalog/gear.json`
2. **Delete the bundled `catalog/gear.json`** from this repo so there is no
   second copy to maintain.
3. Optional: cache the response in the browser and re-fetch when
   `catalogVersion` changes.

### `GLYSK-OU/AnglerBook-iOS`

1. Set the catalog source URL to
   `https://catalog.anglerbook.fun/catalog/gear.json`.
2. Cache the last successful response on device.
3. Refresh when `catalogVersion` / `generatedAt` changes (or on a periodic
   check); keep any bundled copy strictly as an **offline fallback**.

## Editing the catalog going forward

`catalog/gear.json` in this repo is the **only** place to edit. Update it here,
push to `main`, and the GitHub Pages deploy publishes it to
`catalog.anglerbook.fun` for every client automatically. Do not re-introduce
per-client copies.
