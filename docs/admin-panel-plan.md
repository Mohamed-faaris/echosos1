# EchoSOS Admin Panel Plan

## Goal

Build a secure emergency-operations console for administrators. Keep the admin frontend inside `apps/admin` and use the existing Convex deployment and schema as the single source of operational truth.

## Repository and architecture decisions

- Monorepo orchestration: Turborepo 2.x.
- Package manager: pnpm workspaces.
- Existing EchoSOS mobile/web app: repository root for this first migration.
- Admin frontend: `apps/admin`.
- Shared backend: existing root `convex/` directory.
- Authentication: Better Auth through the existing Convex Better Auth component.
- Map: Leaflet with OpenStreetMap attribution.
- Development only: use the dedicated EchoSOS development Convex deployment.
- Do not create another Convex project or duplicate users, beacons, contacts, alerts, or preferences.

The existing mobile app contains Capacitor-generated web assets in its Android project. Moving the root Next.js project in the same change would risk breaking the native asset sync/build path. A later migration can move the current app into `apps/mobile` after Capacitor paths, Android asset generation, and Convex CLI working-directory behavior are validated.

## Current repository baseline

| Area | Existing baseline | Next improvement |
|---|---|---|
| Overview | Active alert map, sampled user/beacon counts, recent events | Accurate counts, health indicators, time filters |
| SOS monitoring | Active alert list and incident coordinates | Incident detail view, event timeline, case workflow |
| Users | Latest 100 user records | Search, pagination, profile and related records |
| Beacons | Latest 100 beacon records | Last seen, firmware, device health and owner drill-down |
| Emergency contacts | Latest 100 contacts | Search, owner profile link, privacy controls |
| Alert history | Latest 100 events | Filters, cursor pagination, export |
| Analytics | Not implemented | Trends, delivery and device health metrics |
| Admin security | One allowlisted administrator | Auditable role/access lifecycle |

## Navigation

### Operations
- Overview
- SOS Monitoring
- Incident History

### Management
- Users
- Beacons
- Emergency Contacts

### Insights
- Analytics
- Reports

### System
- Admin Access
- Audit Logs
- Settings

Only routes that exist should be enabled in the sidebar. Planned modules must not appear as dead navigation links.

## Module requirements

### 1. Overview
- Accurate total users, registered beacons, active SOS incidents, and recent event counts.
- Active incident map using stored latitude/longitude.
- Recent event feed with event type and timestamp.
- Backend and telemetry freshness indicators.
- Clearly label samples, stale records, or unavailable metrics. Never present a bounded sample as a true total.

### 2. SOS monitoring
- List active incidents with user, beacon, time, location, and contact-dispatch information.
- Incident detail view with stored coordinates and chronological event history.
- Administrative acknowledgement, assignment, internal notes, and case resolution.
- Real-time updates through Convex subscriptions where appropriate.

**Safety invariant:** administrative case status is separate from `active_alert.is_active`. Admins cannot cancel, close, or mutate the beacon-originated SOS lifecycle. Only the existing user/beacon cancellation flow can do that.

### 3. User management
- Searchable and paginated user directory.
- User detail view with profile, registered beacon, emergency contacts, preferences, and alert history.
- Read-only access in the first release.
- Account restriction/deactivation, if introduced later, requires an explicit product policy, confirmation, and audit record.

### 4. Beacon management
- Inventory with device owner, MAC/hardware identifier, battery, signal, and status.
- Add `last_seen_at` and update it on every accepted telemetry event.
- Add firmware version and hardware identifier when firmware reports them.
- Use a defined heartbeat threshold for `ONLINE`, `STALE`, and `OFFLINE`; do not infer current connectivity from an old `CONNECTED` value.
- Preserve the existing user-facing beacon pairing flow.

### 5. Emergency contacts
- Searchable contact directory with associated EchoSOS user.
- Primary contact indicator.
- Restrict access to contact PII to authorized admins and avoid exposing it in unnecessary tables/logs.
- Keep contact management read-only for the first release.

### 6. Alert history
- Filter by date range, event type, status, and user.
- Cursor pagination instead of a fixed latest-100 sample.
- Incident drill-down and location link where coordinates exist.
- Export only after access and PII policy are defined.

### 7. Analytics and reports
- Daily/weekly/monthly SOS volume.
- Active versus administratively resolved cases.
- Beacon battery and telemetry freshness.
- Emergency-contact dispatch and delivery success.
- Acknowledgement and resolution durations.
- Incident distribution based only on available location records.

Delivery success, acknowledgement time, and resolution duration require explicit backend events/timestamps. Do not derive them from UI state or assume that a dispatch attempt was delivered.

### 8. Admin and security
- Admin identity and role management.
- Server-side authorization on every privileged query and mutation.
- Audit trail for every mutation, and sensitive-data reads where policy requires it.
- Session revocation and secure sign-out.
- No public admin registration.
- Do not rely on Next.js proxy as the authorization boundary.

## Backend additions

Add these only when the corresponding feature is implemented:

| Area | Proposed fields/table | Reason |
|---|---|---|
| Beacon health | `last_seen_at`, `firmware_version`, `hardware_id` | Reliable device freshness/health |
| Incident case | `incident_cases` with independent case status, assignee, acknowledged/resolved timestamps | Admin workflow without changing SOS state |
| Audit trail | `admin_audit_logs` with actor, action, target, metadata, timestamp | Traceable administrative actions |
| Dispatch events | delivery provider, attempt, outcome, timestamp, error code | Accurate notification analytics |
| Incident timeline | structured event records / indexed timestamps | Reliable history and reporting |

Keep PII and authentication data out of audit metadata. Never log passwords, session tokens, secrets, or raw authentication headers.

## Turborepo workspace

Current incremental layout:

```text
.
├── apps/
│   └── admin/              # Next.js admin console (port 3001)
├── app/                    # Existing EchoSOS Next.js app (port 3000)
├── components/             # Existing mobile/web UI
├── convex/                 # Shared Convex backend and admin queries
├── android/                # Existing native Android project
├── firmware/               # ESP32 firmware
├── docs/
│   └── admin-panel-plan.md
├── package.json            # Existing app + workspace orchestration
├── pnpm-workspace.yaml
└── turbo.json
```

Commands from repository root:

```bash
pnpm install
pnpm dev                 # Existing EchoSOS app on port 3000
pnpm admin:dev           # Admin console on port 3001
pnpm dev:all             # Both apps through Turborepo
pnpm build:all           # Build both apps through Turborepo
pnpm lint:all
pnpm typecheck:all
```

## Delivery phases

| Phase | Scope | Exit criteria |
|---|---|---|
| 1. Monorepo foundation | pnpm workspace, Turbo tasks, admin app workspace, shared navigation | Both apps install and run on separate ports; no backend duplication |
| 2. Live operations | Overview, active SOS list, map, incident details | Data is server-authorized and clearly labelled as live/sample/stale |
| 3. Data management | Users, beacons, contacts, searchable history | Search, filters, pagination, no unsafe writes |
| 4. Case management | Acknowledge, assign, notes, resolve, audit logs | SOS lifecycle remains untouched; all mutations audited |
| 5. Analytics | Trends, device health, delivery metrics | Metrics backed by explicit indexed records |
| 6. Security hardening | Admin roles, sessions, PII controls, abuse limits | Negative authorization tests and audit coverage |
| 7. Production readiness | Deployment, monitoring, backups, recovery | Staging validation, operational runbook, rollback plan |

## Validation checklist

- Anonymous users cannot call any `admin.*` backend query.
- Authenticated non-admin users are rejected by the backend.
- Admin access requires the server-side allowlist.
- Admin development points only to the development Convex deployment.
- The normal EchoSOS login, BLE scanning, telemetry, and alert flows continue working.
- Admin workflows never mutate/cancel active beacon-originated SOS state.
- Every administrative mutation has an actor, timestamp, target, and audit event.
- `pnpm dev:all`, `pnpm build:all`, `pnpm lint:all`, and `pnpm typecheck:all` pass.
- No credentials or private environment files are committed.
