# Feature Specification: ServiceFlow

**Feature Branch**: `001-serviceflow`
**Created**: 2026-09-12
**Status**: Implemented (MVP)

## 1. Project Description

ServiceFlow is a web application for small service businesses to manage customers, service jobs, and job progress in one place. It gives authenticated users a central workspace for customer records, scheduling, status tracking, and a dashboard overview.

> **Invoicing:** Minimal invoicing was part of the original plan. Due to time constraints, invoicing could not be added. It is not part of the delivered application and is listed under [Out of Scope](#8-out-of-scope).

## 2. Purpose

To give small service businesses a simple system for organizing their customers and jobs without the complexity of a full accounting, CRM, or enterprise management system.

## 3. Target Audience

Small service businesses such as cleaning, repair, maintenance, and landscaping companies, and others that manage customer service jobs.

## 4. User Stories

### US-001 — Create an Account (P1)

**As a** service business user, **I want** to create an account, **so that** I can securely manage my business information.

- The user provides name, business name, email, password, and password confirmation.
- Name and business name must be 2–255 characters; the email must be valid; the password must be at least 8 characters and match its confirmation.
- A duplicate email is rejected.
- Invalid information is rejected with field-level errors.

### US-002 — Sign In and Sign Out (P1)

**As a** registered user, **I want** to sign in and out, **so that** my data is protected.

- Valid credentials sign the user in and open the dashboard.
- Invalid credentials are rejected with a generic message.
- A signed-in user can sign out from the account menu.
- Unauthenticated users are redirected to `/login` for any protected page.

### US-003 — Manage Customers (P1)

**As a** service business user, **I want** to create, view, update, and delete customers, **so that** my records stay accurate.

- Customers have a name, email, phone, and address, all required and validated.
- The customer list supports search, a "leads" filter (customers with no scheduled or in-progress jobs), and pagination (10 per page).
- A customer's page lists their jobs.
- A customer with scheduled or in-progress jobs cannot be deleted.
- Deleting is a soft delete.
- Users can only access their own customers.

### US-004 — Manage Jobs (P1)

**As a** service business user, **I want** to create and manage jobs for my customers, **so that** I can track the work I need to do.

- A job has a title (2–255 characters), optional description, scheduled date, status, and a customer.
- The job list supports search (title or customer), status filter, due filter (upcoming or overdue), sort by date, and pagination.
- A job must reference an existing customer owned by the user.
- A scheduled or in-progress job cannot be deleted; it must be cancelled first.
- Deleting is a soft delete.
- Users can only access their own jobs.

### US-005 — Manage Job Status (P1)

**As a** service business user, **I want** to update a job's status, **so that** I can track progress.

Statuses: `scheduled`, `in_progress`, `completed`, `cancelled`.

- New jobs start as `scheduled`.
- Allowed transitions: `scheduled → in_progress | cancelled`, `in_progress → completed | cancelled`.
- `completed` and `cancelled` are final.
- Destructive or irreversible changes ask for confirmation.
- Invalid transitions are rejected.

### US-006 — Review the Dashboard (P2)

**As a** service business user, **I want** an overview of my activity, **so that** I can see the state of my work quickly.

- Summary cards show Upcoming, Overdue, In progress, Completed, Total jobs, Total customers, and Leads, each linking to the relevant list.
- Upcoming and Overdue job previews are shown.
- A loading skeleton, an error state, and a first-run empty state are provided.

### US-007 — Manage My Account (P2)

**As a** signed-in user, **I want** to update my profile, change my password, and delete my account, **so that** I control my own data.

- Name, business name, and email can be updated.
- Changing the password requires the current password.
- Deleting the account removes the user and cascades to their customers and jobs.

## 5. Functional Requirements

| ID     | Requirement                                                                                         |
| ------ | --------------------------------------------------------------------------------------------------- |
| FR-001 | Users can create accounts and authenticate (credentials, JWT session).                              |
| FR-002 | Protected pages and API routes require authentication.                                              |
| FR-003 | Users can only access and modify their own customers and jobs.                                      |
| FR-004 | Customers support create, read, update, and soft delete.                                            |
| FR-005 | Customer deletion is blocked while the customer has scheduled or in-progress jobs.                  |
| FR-006 | Jobs support create, read, update, and soft delete.                                                 |
| FR-007 | Each job references a valid customer owned by the same user.                                        |
| FR-008 | Job statuses are `scheduled`, `in_progress`, `completed`, and `cancelled` with defined transitions. |
| FR-009 | Each job has a required scheduled date.                                                             |
| FR-010 | The dashboard summarizes job and customer activity.                                                 |
| FR-011 | All input is validated with Zod before processing; errors are returned per field.                   |
| FR-012 | The UI handles loading, empty, error, and not-found states with shared components.                  |
| FR-013 | Lists are paginated (10 per page) and filterable.                                                   |

## 6. API Endpoints

The full reference, with request and response details, is in the [README](../README.md#api-reference). Summary:

| Method | Endpoint                   | Purpose             |
| ------ | -------------------------- | ------------------- |
| POST   | `/api/users`               | Create an account   |
| GET    | `/api/users/{id}`          | Retrieve a user     |
| PATCH  | `/api/users/{id}`          | Update a user       |
| DELETE | `/api/users/{id}`          | Delete a user       |
| PATCH  | `/api/users/{id}/password` | Change password     |
| POST   | `/api/auth/sign-in`        | Sign in             |
| POST   | `/api/auth/sign-out`       | Sign out            |
| GET    | `/api/customers`           | List customers      |
| POST   | `/api/customers`           | Create a customer   |
| GET    | `/api/customers/{id}`      | Retrieve a customer |
| PATCH  | `/api/customers/{id}`      | Update a customer   |
| DELETE | `/api/customers/{id}`      | Delete a customer   |
| GET    | `/api/jobs`                | List jobs           |
| POST   | `/api/jobs`                | Create a job        |
| GET    | `/api/jobs/{id}`           | Retrieve a job      |
| PATCH  | `/api/jobs/{id}`           | Update a job        |
| DELETE | `/api/jobs/{id}`           | Delete a job        |

Job status changes made in the UI go through a Server Action that enforces the transition rules. There is no separate status endpoint and no dashboard endpoint; the dashboard reads directly from the data layer.

## 7. Core Entities

- **User** — account owner; stores `businessName`.
- **Customer** — a customer of the business.
- **Job** — a service job for a customer.

See [data-model.md](data-model.md) for fields and rules. There is no `Business` entity: one account represents one business.

## 8. Out of Scope

- **Invoicing** (amount, due date, paid date): planned, not added due to time constraints
- Payment processing, full accounting, tax calculations, recurring billing
- Advanced CRM or reporting
- Payroll and enterprise features
- Role-based access control and multi-user businesses

## 9. Success Criteria

1. A user can create an account, sign in, and sign out.
2. A user can create, view, update, and delete customers.
3. A user can create and manage jobs associated with customers.
4. A user can schedule jobs and move them through their statuses.
5. A user can see their work on the dashboard.
6. A user only ever sees their own data.
7. Invalid input and failures produce clear, safe messages, and loading, empty, error, and not-found states are handled.
