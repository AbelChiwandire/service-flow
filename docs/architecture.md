# ServiceFlow Architecture

## Overview

ServiceFlow is a full-stack service-business management application built with Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, PostgreSQL, and Auth.js.

The application allows service businesses to manage customers, jobs, job statuses, and basic invoices. The MVP focuses on straightforward customer and job management rather than full accounting or complex business administration.

## Routes

### Public Routes

| Route     | Purpose                    | Priority |
| --------- | -------------------------- | -------- |
| `/`       | Landing page / entry point | P1       |
| `/login`  | Sign in                    | P1       |
| `/signup` | Create account             | P1       |

### Authenticated Routes

| Route                  | Purpose                           | Priority |
| ---------------------- | --------------------------------- | -------- |
| `/dashboard`           | Authenticated overview            | P2       |
| `/customers`           | Customer list                     | P1       |
| `/customers/new`       | Create customer                   | P1       |
| `/customers/[id]`      | View customer and associated jobs | P1       |
| `/customers/[id]/edit` | Edit customer                     | P1       |
| `/jobs`                | Job list                          | P1       |
| `/jobs/new`            | Create job                        | P1       |
| `/jobs/[id]`           | View job details                  | P1       |
| `/jobs/[id]/edit`      | Edit job                          | P1       |
| `/invoices`            | Invoice list                      | P2       |
| `/invoices/[id]`       | View invoice                      | P2       |
| `/invoices/[id]/edit`  | Edit invoice                      | P2       |

There is no `/invoices/new` route because invoice creation is part of the job-completion workflow.

There are no separate `/delete` or `/status` routes. Deletion and status changes are handled through the appropriate entity interface.

## Application Structure

The application is logically divided into public and authenticated areas:

```text
ServiceFlow
├── Public Area
│   ├── Landing Page
│   ├── Login
│   └── Signup
│
└── Authenticated Area
    ├── Dashboard
    ├── Customers
    │   ├── List
    │   ├── Create
    │   ├── Details
    │   └── Edit
    ├── Jobs
    │   ├── List
    │   ├── Create
    │   ├── Details
    │   └── Edit
    └── Invoices
        ├── List
        ├── Details
        └── Edit
```

"Public Area" and "Authenticated Area" are conceptual groupings for documentation. They do not require physical folders with those exact names. Next.js route groups or another folder organization may be used during implementation.

## Component Architecture

The application follows this logical hierarchy:

```text
Routes
   ↓
Pages
   ↓
Reusable Domain Components
   ↓
Shared UI Primitives
```

Pages are responsible for composing the interface for a route. Reusable components contain domain-specific presentation and behavior, while shared UI primitives provide common interface elements.

### Shared Application Components

* `Header`
* `Navigation`
* `PageHeader`
* `LoadingState`
* `EmptyState`
* `ErrorMessage`

Shared UI primitives from shadcn/ui may also be used as needed, including:

* `Button`
* `Input`
* `Dialog`
* `AlertDialog`
* `Badge`
* `Select`
* Other primitives as required

### Customer Components

* `CustomerList`
* `CustomerItem`
* `CustomerForm`
* `CustomerDetails`
* `CustomerJobList`

### Job Components

* `JobList`
* `JobItem`
* `JobForm`
* `JobDetails`
* `JobStatusBadge`

The job domain also includes the job-completion and invoice-creation workflow.

### Invoice Components

* `InvoiceList`
* `InvoiceItem`
* `InvoiceDetails`
* `InvoiceForm`

### Dashboard Components

* `DashboardSummary`
* `SummaryCard`
* `UpcomingJobs`
* `OutstandingInvoices`

Components such as `CustomerActions`, `JobActions`, `JobStatusControl`, `InvoiceStatus`, and `RecentActivity` are not planned as separate components initially. They may be introduced later if implementation complexity justifies them.

## Naming Conventions

ServiceFlow will use consistent naming conventions for routes, files, components, and variables to make the codebase predictable across the team.

### Components

React components use **PascalCase**.

Examples:

* `CustomerList`
* `CustomerForm`
* `JobDetails`
* `JobStatusBadge`
* `SummaryCard`

Component names should describe their responsibility rather than their location or implementation details.

### Component Files

Component files should use the same name as their primary component.

Examples:

```text
CustomerList.tsx
CustomerForm.tsx
JobDetails.tsx
SummaryCard.tsx
```

Lowercase or kebab-case file naming may be used where required by a framework convention or for route files.

### Routes

Application routes use **lowercase, plural resource names** for entity collections.

Examples:

```text
/customers
/jobs
/invoices
```

Standard resource operations follow this pattern:

```text
/entity
/entity/new
/entity/[id]
/entity/[id]/edit
```

Dynamic route segments use Next.js's `[id]` convention.

### Variables and Functions

Variables and functions use **camelCase**.

Examples:

```text
customer
customerId
scheduledDate
createCustomer
updateJob
```

Boolean variables should use names that communicate their boolean nature when appropriate, such as `isLoading` or `isPaid`.

### Types and Interfaces

TypeScript types and interfaces use **PascalCase**.

Examples:

```text
Customer
Job
Invoice
CustomerFormData
JobStatus
```

### Constants

Constants that represent fixed values should use **UPPER_SNAKE_CASE** when appropriate.

Examples:

```text
JOB_STATUSES
MAX_PAGE_SIZE
```

Not every `const` variable needs this convention. Normal local constants should continue to use camelCase.

### Database Fields

Database fields use **camelCase** to remain consistent with the TypeScript application layer.

Examples:

```text
userId
customerId
scheduledDate
createdAt
updatedAt
```

### General Naming Principle

Names should be descriptive and use the terminology established by the application's domain model. The same concepts should use the same names throughout the database, API, components, and UI wherever practical.

## Domain Relationship

The primary application workflow is:

```text
User
  ↓
Customers
  ↓
Customer
  ↓
Jobs
  ↓
Job Status
  ↓
Completed
  ↓
Invoice
```

The dashboard provides an overview of information from these domains:

```text
User
  ↓
Dashboard
  ├── Summary Cards
  ├── Upcoming Jobs
  └── Outstanding Invoices
```

## Job Completion and Invoice Workflow

Invoices are created only when a job is completed.

Changing a job's status to `Completed` initiates an invoice-creation interaction using a dialog.

The workflow is:

```text
Job in previous status
        ↓
User selects "Completed"
        ↓
Invoice creation dialog opens
        ↓
User enters invoice information
        ↓
Invoice successfully created
        ↓
Job becomes "Completed"
```

If the user cancels the dialog or invoice creation fails, the job remains in its previous status.

Job status and invoicing remain conceptually separate. There is no combined "Complete & Invoice" status or separate action that mixes the two concepts.

This establishes the MVP business rule:

> Every completed job has exactly one invoice.

A job may exist without an invoice while it is not completed.

## Implementation Priority

### Phase 1 — Foundation

1. `Header`
2. `Navigation`
3. `PageHeader`
4. `LoadingState`
5. `EmptyState`
6. `ErrorMessage`
7. Public authentication interfaces
8. Authenticated layout

### Phase 2 — Customers

9. `CustomerList`
10. `CustomerItem`
11. `CustomerForm`
12. `CustomerDetails`
13. `CustomerJobList`

### Phase 3 — Jobs

14. `JobList`
15. `JobItem`
16. `JobForm`
17. `JobDetails`
18. `JobStatusBadge`
19. Job completion and invoice-creation workflow

### Phase 4 — Invoices

20. `InvoiceList`
21. `InvoiceItem`
22. `InvoiceDetails`
23. `InvoiceForm`

### Phase 5 — Dashboard

24. `DashboardSummary`
25. `SummaryCard`
26. `UpcomingJobs`
27. `OutstandingInvoices`

The customer and job workflow is the primary MVP focus. The dashboard is lower priority and can be implemented after the core customer, job, and invoice workflows are functional.

## Responsive Design Principle

Business data should primarily use rows or tables on desktop and tablet-sized screens.

On smaller screens, the same `*Item` component may change its layout to a compact card-like presentation.

Separate components such as `CustomerRow` and `CustomerCard` should not be created unless the desktop and mobile implementations become meaningfully different.

Responsive behavior is therefore considered a presentation concern rather than a reason to duplicate domain components.

## Component Architecture Principle

ServiceFlow should favor **small, reusable components with clear responsibilities**.

Domain components should compose shared UI primitives rather than repeatedly implementing common interface behavior.

The architecture should remain simple enough for the team to understand and maintain while allowing components to become more specialized when actual implementation complexity requires it.
