# ServiceFlow

ServiceFlow is a web application for small service businesses (cleaning, repair, maintenance, landscaping, and similar) to manage their customers and service jobs in one place. Users create an account, keep a customer list, schedule jobs for those customers, move each job through its statuses, and review what needs attention on a dashboard.

> **Note on invoicing:** minimal invoicing was part of the original plan. Due to time constraints, invoicing could not be added.

## Product Demo

**The problem.** Small service businesses often run on text messages, paper notes, and spreadsheets. Customer details are scattered, it is easy to forget which jobs are scheduled, and nobody has a quick answer to "what is overdue today?". Full CRM and accounting tools solve this, but they are heavy, expensive, and far more than a small crew needs.

**Who it is for.** ServiceFlow is built for owners and operators of small service businesses who manage their own customers and schedule. Each account represents one business, and everything in it is private to that account.

**The core flow and its value.** A user signs up, adds a customer with their contact details and address, and creates a job for that customer with a title, description, and scheduled date. From the job page they move it from _Scheduled_ to _In progress_ to _Completed_ (or _Cancelled_), with confirmation for irreversible changes. The dashboard summarizes upcoming, overdue, in-progress, and completed work and links straight to the filtered lists, so the owner starts each day knowing what needs attention. Search, status and due filters, and pagination keep the customer and job lists usable as the business grows, and the interface works on phones as well as desktops.

## Team Members (Team 13)

- Abel Chiwandire
- Prayer Marangwanda
- Olanrewaju Ayomide Adebayo
- Ijato Precious-jane Okpen

## Features

- Account creation, sign-in, and sign-out (Auth.js credentials, JWT sessions)
- Customer create, view, edit, and delete, with search, a "leads" filter, and pagination
- Job create, view, edit, and delete, with search, status, due and sort filters, and pagination
- Job statuses `scheduled`, `in_progress`, `completed`, `cancelled` with enforced transitions
- Dashboard with summary cards and upcoming/overdue job lists
- Account page: update profile, change password, delete account
- Loading, empty, error, and not-found states
- Responsive, accessible UI built with Tailwind CSS

## Tech Stack

- [Next.js](https://nextjs.org) 16 (App Router) and React 19
- TypeScript (strict mode)
- Tailwind CSS v4 with a custom `@layer components` library
- Neon PostgreSQL (`@neondatabase/serverless`)
- Auth.js (`next-auth` v5 beta), bcrypt, Zod
- ESLint and Prettier

## Setup

### Prerequisites

- Node.js 20 or later and npm
- A [Neon](https://neon.tech) PostgreSQL database

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create `.env.local` in the project root:

```bash
DATABASE_URL="postgresql://<user>:<password>@<host>/<database>?sslmode=require"
AUTH_SECRET="<random string>"
```

Generate a secret with `npx auth secret` or `openssl rand -base64 32`. Never commit `.env.local`.

### 3. Create the database schema

Run the contents of [`lib/sql/setup.sql`](lib/sql/setup.sql) against your Neon database (Neon SQL editor or `psql`). It creates the `users`, `customers`, and `jobs` tables, the `job_status` enum, and indexes.

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and create an account.

### Scripts

| Command                | Purpose                       |
| ---------------------- | ----------------------------- |
| `npm run dev`          | Start the development server  |
| `npm run build`        | Create a production build     |
| `npm start`            | Serve the production build    |
| `npm run lint`         | Run ESLint                    |
| `npm run format`       | Format the code with Prettier |
| `npm run format:check` | Check formatting              |

## Deployment

ServiceFlow is designed for [Vercel](https://vercel.com) with a Neon database.

1. Create a Neon project and apply `lib/sql/setup.sql` to it.
2. Push the repository to GitHub and import it in Vercel (framework preset: Next.js).
3. Add the environment variables `DATABASE_URL` and `AUTH_SECRET` for the Production environment (the Vercel–Neon integration can add `DATABASE_URL` automatically).
4. Deploy. Vercel runs `npm run build` and serves the app.

For other hosts, run `npm run build` and `npm start` with the same environment variables set.

## API Reference

All endpoints are under `/api`, accept and return JSON, and respond with `{ "data": ... }` on success or `{ "error": "message" }` on failure. Validation failures return `400` with `{ "error": "Missing or invalid fields.", "details": { field: [messages] } }`. Ids must be UUIDs (`400` otherwise). Authenticated endpoints use the Auth.js session cookie and return `401 { "error": "Unauthorized." }` without one. The `/api/users/{id}` endpoints also return `403` when the session belongs to a different user. Customers and jobs are always scoped to the signed-in user, so another user's records return `404`.

### Auth

| Method   | Endpoint             | Description                                                                        |
| -------- | -------------------- | ---------------------------------------------------------------------------------- |
| POST     | `/api/auth/sign-in`  | Body `{ email, password }`. `200 { success: true }`, `401` for invalid credentials |
| POST     | `/api/auth/sign-out` | Signs out the current session. `401` if not signed in                              |
| GET/POST | `/api/auth/*`        | Auth.js built-in endpoints (session, CSRF, callbacks)                              |

### Users

| Method | Endpoint                   | Description                                                                                                |
| ------ | -------------------------- | ---------------------------------------------------------------------------------------------------------- |
| POST   | `/api/users`               | Sign up. Body `{ name, businessName, email, password, confirmPassword }`. `201`, `409` if the email exists |
| GET    | `/api/users/{id}`          | Retrieve a user (without the password hash)                                                                |
| PATCH  | `/api/users/{id}`          | Update `{ name, businessName, email }`                                                                     |
| DELETE | `/api/users/{id}`          | Delete the user and, by cascade, their customers and jobs                                                  |
| PATCH  | `/api/users/{id}/password` | Body `{ currentPassword, newPassword, confirmNewPassword }`. `401` if the current password is wrong        |

### Customers

| Method | Endpoint              | Description                                                                                  |
| ------ | --------------------- | -------------------------------------------------------------------------------------------- |
| GET    | `/api/customers`      | The user's customers, newest first (10 per page). Query: `query`, `filter` (`leads`), `page` |
| POST   | `/api/customers`      | Body `{ name, email, phone, address }`. `201`                                                |
| GET    | `/api/customers/{id}` | Retrieve a customer. `404` if not found                                                      |
| PATCH  | `/api/customers/{id}` | Partial update of the fields above                                                           |
| DELETE | `/api/customers/{id}` | Soft delete. `409` if the customer has scheduled or in-progress jobs                         |

### Jobs

| Method | Endpoint         | Description                                                                                                                              |
| ------ | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/api/jobs`      | The user's jobs (10 per page). Query: `query`, `status`, `due` (`upcoming` or `overdue`), `sort` (`asc` or `desc`), `page`, `customerId` |
| POST   | `/api/jobs`      | Body `{ customerId, title, description?, scheduledDate (YYYY-MM-DD), status? }`. `201`, `404` if the customer is not found               |
| GET    | `/api/jobs/{id}` | Retrieve a job. `404` if not found                                                                                                       |
| PATCH  | `/api/jobs/{id}` | Partial update of `title`, `description`, `scheduledDate`, `status`                                                                      |
| DELETE | `/api/jobs/{id}` | Soft delete. `409` if the job is scheduled or in progress (cancel it first)                                                              |

Status values: `scheduled`, `in_progress`, `completed`, `cancelled`.

## Project Structure

- `app/` — routes, layouts, API route handlers, and `globals.css` (colors and component classes)
- `components/` — `shared/`, `layout/`, and domain components (`customers/`, `jobs/`, `dashboard/`, `auth/`, `profile/`)
- `lib/` — session helpers, database repositories, Zod schemas, server actions, and `sql/setup.sql`
- `auth.ts`, `auth.config.ts`, `proxy.ts` — Auth.js setup and route protection
- `docs/` — project documentation

## Documentation

- [Feature specification](docs/spec.md)
- [Architecture](docs/architecture.md)
- [Data model](docs/data-model.md)
- [Design system](docs/design-system.md)
- [Project constitution](docs/constitution.md)

## Known Issues and Opportunities

**Known issues**

- **Status transitions are not enforced by the REST API.** `PATCH /api/jobs/{id}` accepts any valid status; the transition rules are applied by the UI's Server Action only.
- **No automated tests.** Validation, authorization, and the status rules are verified manually.
- **No rate limiting** on sign-in or sign-up, and no email verification or password reset.
- ESLint reports 8 unused `_prevState` / `_formData` warnings in server action signatures.

**Opportunities**

- **Invoicing** (amount, due date, paid date for completed jobs), which could not be added due to time.
- Automated unit and end-to-end tests.
- A migration tool for the database schema.
- Customer and job notes, job assignment, and recurring jobs.
- Calendar view of scheduled jobs and email or SMS reminders.
- Multi-user businesses with roles.
