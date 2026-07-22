This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Install dependencies and run the development server with `pnpm`:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:4001/fleet](http://localhost:4001/fleet) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

Fleet RFQs support CSV, XLSX, and XLS imports with exactly five columns: `VIN
No`, `Quantity`, `Price`, `Part Number`, and `Part Name`. Mixed VIN files are
grouped into one RFQ per vehicle. Adding a fleet vehicle starts with a cached
VIN lookup, falls back to 17VIN, and permits manual details when unresolved.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

<!-- BEGIN:autoparts-pro-codex-docs -->

## AutoParts Pro App Notes

### App Purpose

Fleet/vehicle management dashboard for vehicles, RFQs, orders, suppliers, reports, settings, and fleet auth.

### Important Folders

- app/(dashboard)/vehicles, rfqs, rfqs/create, orders, suppliers, reports, settings
- app/api/auth, app/api/fleet, app/api/orders, app/api/rfqs
- `components/fleet-dashboard`
- `lib/auth, lib/routes.ts`

### Environment Variables

Detected or documented variables:

- `ADMIN_API_BASE_URL`
- `BACKEND_URL`
- `USER_ACCESS_COOKIE_NAME`
- `USER_REFRESH_COOKIE_NAME`
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_VAPID_KEY`
- `NEXT_PUBLIC_BASE_PATH`

Firebase push notifications require `NEXT_PUBLIC_FIREBASE_VAPID_KEY` plus the
Firebase web config. The dashboard registers the browser token only after login
and browser notification permission.

### Run, Build, and Test Commands

Install:

```bash
pnpm install
```

Detected scripts:

- `pnpm dev`
- `pnpm build`
- `pnpm start`
- `pnpm lint`

Runtime note: dev/start use port 4001.

### Connected Apps and Services

- auto_parts_admin/backend APIs through ADMIN_API_BASE_URL or BACKEND_URL
- Firebase web authentication
- RFQ/order APIs shared with admin, supplier, and user flows

### Common Checks Before Deployment

- Vehicle, RFQ creation, RFQ list, order, supplier, report, and settings pages render
- Auth routes exchange backend cookies correctly
- RFQ/order API changes are checked against supplier and admin apps
- Run lint/build for this app before deployment.
- Re-check affected API, auth, database, and env contracts in connected apps.

<!-- END:autoparts-pro-codex-docs -->
