# ServiceFlow Architecture

## Overview

ServiceFlow is a full-stack service-business management application built with:

- **Next.js 16** (App Router) and **React 19**
- **TypeScript** (strict mode)
- **Tailwind CSS v4** with a custom component layer
- **Neon PostgreSQL** via `@neondatabase/serverless` (raw SQL, no ORM)
- **Auth.js** (`next-auth` v5 beta) with a credentials provider and JWT sessions
- **Zod** for input validation, **bcrypt** for password hashing
- **ESLint** and **Prettier**

Users manage customers and jobs. Invoicing was planned but could not be added due to time constraints, so it is not part of the application.

## Routes

### Public

| Route     | Purpose                                           |
| --------- | ------------------------------------------------- |
| `/`       | Landing page (signed-in users go to `/dashboard`) |
| `/login`  | Sign in                                           |
| `/signup` | Create account                                    |

### Authenticated

| Route                  | Purpose                                       |
| ---------------------- | --------------------------------------------- |
| `/dashboard`           | Overview of jobs and customers                |
| `/customers`           | Customer list (search, filter, paging)        |
| `/customers/new`       | Create customer                               |
| `/customers/[id]`      | Customer details and their jobs               |
| `/customers/[id]/edit` | Edit customer                                 |
| `/jobs`                | Job list (search, status, due, sort, paging)  |
| `/jobs/new`            | Create job                                    |
| `/jobs/[id]`           | Job details and status control                |
| `/jobs/[id]/edit`      | Edit job                                      |
| `/account`             | Edit profile, change password, delete account |

Access control is enforced by `proxy.ts` (Next.js middleware) using `auth.config.ts`: every route except `/`, `/login`, and `/signup` requires a session. Signed-in users visiting `/` or `/login` are redirected to `/dashboard`. API routes are excluded from the proxy matcher and check the session themselves.

There are no separate `/delete` or `/status` pages; deletion and status changes happen on the entity's details page.

Special files: `app/error.tsx`, `app/not-found.tsx`, `app/(authenticated)/error.tsx`, `app/(authenticated)/not-found.tsx`, and `app/(authenticated)/loading.tsx`.

## Project Structure

```text
app/
  (authenticated)/       Route group with the app shell (sidebar, header)
    account/ customers/ dashboard/ jobs/
  api/                   REST route handlers (auth, customers, jobs, users)
  login/ signup/         Public auth pages
  globals.css            Color variables and the component layer
  layout.tsx page.tsx    Root layout (Inter font) and landing page
components/
  auth/ customers/ dashboard/ jobs/ profile/   Domain components
  layout/                App shell, header, sidebar, modal, logo
  shared/                Reusable UI (tables, forms, states, pagination)
lib/
  auth/                  Session helpers and sign-in/sign-out actions
  db/
    customer/ jobs/ users/ dashboard/   repository, schema, actions, api-helpers
  sql/setup.sql          Database schema
auth.ts auth.config.ts proxy.ts          Auth.js setup and route protection
docs/                    Project documentation
```

## Layers

Each domain (`customer`, `jobs`, `users`) in `lib/db/` follows the same split:

| File             | Responsibility                                                           |
| ---------------- | ------------------------------------------------------------------------ |
| `schema.ts`      | Zod schemas and field-error formatting                                   |
| `repository.ts`  | SQL queries and domain errors; always scoped by `userId`                 |
| `actions.ts`     | Server Actions used by forms (validate, call repository, revalidate)     |
| `api-helpers.ts` | Shared API helpers (id validation, JSON parsing, error → status mapping) |

```text
Page (Server Component)
   ↓ reads via repository
Domain components (Client Components only when interactive)
   ↓ submit
Server Actions / API routes
   ↓ validate (Zod) → authorize (session) → repository
Neon PostgreSQL
```

- **Pages** are Server Components that load data and compose the interface.
- **Forms** use Server Actions with `useActionState`; validation errors come back as field-level messages.
- **API routes** expose the same operations over HTTP for external clients. Both paths use the same schemas and repositories.
- **Authorization** is enforced in the data layer: repository functions take the session's `userId`, so one user can never read another user's rows, regardless of UI visibility.

## Components

### Shared (`components/shared`)

`PageHeader`, `ButtonLink`, `BackLink`, `ConfirmActionButton`, `DeleteSection`, `DataTable` / `DataRow`, `ListFilters`, `Pagination`, `LoadingState`, `EmptyState`, `ErrorMessage`, `ErrorState`, `TimeZoneSync`, `form.tsx` (`FieldErrors`, `FormMessage`, `FormActions`), and the `useFormFeedback` hook.

### Layout (`components/layout`)

`AuthenticatedShell`, `AppHeader`, `AppSidebar`, `AccountMenu`, `PublicHeader`, `Logo`, `Modal`.

### Domain

- **Customers:** `CustomerList`, `CustomerItem`, `CustomerForm`, `CustomerDetails`, `CustomerJobList`, `CustomerFilters`, `DeleteCustomerButton`
- **Jobs:** `JobList`, `JobItem`, `JobForm`, `JobDetails`, `JobFilters`, `JobStatusBadge`, `JobStatusControl`, `DeleteJobButton`
- **Dashboard:** `DashboardSummary`, `DashboardSummarySkeleton`, `SummaryCard`, `UpcomingJobs`, `OverdueJobs`, `JobPreviewList`
- **Auth and profile:** `LoginForm`, `SignupForm`, `ChangePasswordForm`, `UserProfileForm`, `SignoutButton`, `DeleteAccountButton`

Responsive behavior is a presentation concern: the same `*Item` component renders as a table row on `md+` and as a compact card on small screens. Separate desktop and mobile components are not created.

## Naming Conventions

- Components, types, and interfaces: **PascalCase** (`CustomerForm`, `JobStatus`). Component files match the component name.
- Route files follow Next.js conventions (`page.tsx`, `route.ts`); route-local form files are kebab-case (`create-job-form.tsx`).
- Routes use lowercase plural resources: `/customers`, `/jobs`, with `/new`, `/[id]`, `/[id]/edit`.
- Variables and functions: **camelCase**. Fixed lookup tables: **UPPER_SNAKE_CASE** (`JOB_STATUS_LABELS`, `ITEMS_PER_PAGE`).
- Database columns: **camelCase**, matching the TypeScript layer.
- CSS component classes: lowercase kebab-case, named by role (`btn-primary`, `card-surface`).

## Key Workflows

### Authentication

1. `POST /api/users` or the signup form creates the account (bcrypt-hashed password).
2. The credentials provider in `auth.ts` verifies email and password and issues a JWT session containing the user id.
3. `proxy.ts` redirects unauthenticated requests to `/login`.

### Job status

```text
scheduled ──► in_progress ──► completed
    └────────────┴──────────► cancelled
```

`completed` and `cancelled` are final. The job details page offers only valid next statuses, and the Server Action rejects invalid transitions. A job must be cancelled before it can be deleted, and a customer with scheduled or in-progress jobs cannot be deleted. Deletes are soft deletes.

### Dashboard

The dashboard shows summary cards (Upcoming, Overdue, In progress, Completed, Total jobs, Total customers, Leads) that link to filtered lists, plus Upcoming and Overdue job previews. A skeleton is shown while it loads, and a first-run empty state guides new users.

## Out of Scope

Invoicing (not added due to time), payment processing, accounting, tax, recurring billing, CRM/ERP features, and role-based access control.
