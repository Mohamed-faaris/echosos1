# EchoSOS Admin

Dedicated administration console for the EchoSOS emergency alert platform.

## Workspace

This application lives at `apps/admin` in the EchoSOS Turborepo. The existing mobile/web application and shared Convex backend remain at the repository root during this incremental migration.

- Next.js 16, React 19 and TypeScript
- Better Auth through the shared Convex Better Auth component
- Convex queries in the repository's root `convex/admin.ts`
- Leaflet and OpenStreetMap for incident coordinates
- Development port: `3001`

## Local development

From the repository root:

```bash
pnpm install
cp apps/admin/.env.example apps/admin/.env.local
pnpm admin:dev
```

The admin app uses `http://localhost:3001`. Configure the shared development Convex deployment's server-side `SITE_URL` to the same origin. Keep the production deployment isolated. The first `pnpm install` must refresh `pnpm-lock.yaml` with the new workspace importer and Turbo dependency before using `--frozen-lockfile` in CI.

## Environment

`apps/admin/.env.local`:

- `NEXT_PUBLIC_CONVEX_URL`: shared development Convex cloud URL
- `NEXT_PUBLIC_CONVEX_SITE_URL`: matching Convex HTTP actions URL
- `NEXT_PUBLIC_SITE_URL`: local admin origin

The shared Convex deployment also needs server-side `SITE_URL`, `ADMIN_EMAIL`, and `BETTER_AUTH_SECRET`. Never put those server-side secrets in this frontend env file or commit local env files.

## Access control

Public registration is disabled. The backend verifies the authenticated identity against the server-side `ADMIN_EMAIL` allowlist for every admin query. Browser route protection is only a convenience; it is not the security boundary.

## Data and safety boundaries

- Admin reads come from the existing EchoSOS tables. This app does not create a second Convex project or duplicate user/beacon/alert data.
- The first increment is read-only.
- Admin case resolution must remain separate from the beacon-originated SOS lifecycle. The admin console must never cancel a user's active SOS event.
- The map displays stored incident coordinates. It is not a continuous user-location tracker.

## Current limitations

- Dashboard totals are bounded samples until a proper count/index strategy is added.
- Beacon status does not yet have a reliable last-seen timestamp; offline/stale labels need backend heartbeat fields.
- Alert history is limited to the latest 100 records in the current UI.
- Delivery analytics and acknowledgement-time metrics need explicit backend event records.
