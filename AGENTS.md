<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:autoparts-pro-codex-docs -->

## AutoParts Pro App Scope

App: `fleet_dashboard`  
Role: Fleet dashboard

### Responsibility

Fleet/vehicle management dashboard for vehicles, RFQs, orders, suppliers, reports, settings, and fleet auth.

### Important Folders and Files

- app/(dashboard)/vehicles, rfqs, rfqs/create, orders, suppliers, reports, settings
- app/api/auth, app/api/fleet, app/api/orders, app/api/rfqs
- `components/fleet-dashboard`
- `lib/auth, lib/routes.ts`

### Connected Apps and Services

- auto_parts_admin/backend APIs through ADMIN_API_BASE_URL or BACKEND_URL
- Firebase web authentication
- RFQ/order APIs shared with admin, supplier, and user flows

### Rules for Working Here

- Read the project root `AGENTS.md` and `docs/` files before cross-app work.
- Keep changes inside `fleet_dashboard` unless the task explicitly requires another app.
- Do not change API contracts, Prisma schema, auth cookies/JWTs, Firebase config, route base paths, or shared env behavior without listing affected apps first.
- Do not mix public website, admin, user, supplier, garage, and fleet business logic unless existing imports or APIs already connect them.
- Preserve existing Next.js version guidance and local architecture rules.
- Validate every new or changed user-editable input, textarea, select, file upload, and custom input before submission/API calls; trim whitespace, prevent clearly invalid values where practical, show required fields with a red `*`, and use the existing toast/notification system for success and error feedback.

### What Not to Touch Unless Explicitly Required

- Other app folders.
- Package manager files and lockfiles.
- `.env` files and secrets.
- Generated folders such as `.next` and `node_modules`.
- Backend/API or Prisma code outside this app's scope.

### Check After Changes

- Vehicle, RFQ creation, RFQ list, order, supplier, report, and settings pages render
- Auth routes exchange backend cookies correctly
- RFQ/order API changes are checked against supplier and admin apps
- Preferred validation: `pnpm lint`, `pnpm exec tsc --noEmit`, and `pnpm build` when relevant.
- Update project root `docs/AI_HANDOFF.md` after major changes.

### App-Specific Boundaries

- Fleet vehicle limits, staff limits, role access, and plan feature access must be enforced by `auto_parts_admin`.
- UI menu/tab visibility may use backend-provided permissions, but backend APIs must still enforce every fleet action.

### Visual Design Rule

- For any new UI feature (buttons, inputs, selects, modals, tables, cards, and similar controls), use the existing ShadCN UI components and keep spacing, type scale, colors, and interaction patterns aligned with the current app design language.

<!-- END:autoparts-pro-codex-docs -->
