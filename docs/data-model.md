# ServiceFlow Data Model

## 1. Overview

ServiceFlow uses **Neon PostgreSQL** for persistent application data.

The MVP contains four core entities:

* User
* Customer
* Job
* Invoice

A separate `Business` entity is intentionally excluded from the MVP. Each ServiceFlow account represents one business, so the minimal business identity is stored as `businessName` on the `User` record. A dedicated `Business` entity can be introduced later if multi-user or multi-business functionality is added.

---

## 2. User

Represents the person who owns and manages a ServiceFlow account.

| Field          | Type      | Purpose                                         |
| -------------- | --------- | ----------------------------------------------- |
| `id`           | UUID      | Unique user identifier                          |
| `name`         | string    | Account owner's name                            |
| `businessName` | string    | Name of the business represented by the account |
| `email`        | string    | Login email; unique                             |
| `passwordHash` | string    | Stored password hash                            |
| `createdAt`    | timestamp | Account creation timestamp                      |
| `updatedAt`    | timestamp | Last update timestamp                           |

### Relationship

**User → Customer: one-to-many**

One user can have many customers, while each customer belongs to one user.

The same ownership relationship exists for jobs and invoices.

```text
User
 │
 ├── Customer
 ├── Customer
 └── Customer
```

The user's `businessName` is used as the primary business identity within the application rather than displaying the account owner's personal name as the business name.

---

## 3. Customer

Represents a customer receiving services from the business.

| Field       | Type      | Purpose                      |
| ----------- | --------- | ---------------------------- |
| `id`        | UUID      | Unique customer identifier   |
| `userId`    | UUID      | Owner of the customer record |
| `name`      | string    | Customer's name              |
| `email`     | string    | Customer email               |
| `phone`     | string    | Customer phone number        |
| `address`   | string    | Customer/service address     |
| `createdAt` | timestamp | Creation timestamp           |
| `updatedAt` | timestamp | Last update timestamp        |

### Relationships

**User → Customer: one-to-many**

**Customer → Job: one-to-many**

A customer can have multiple jobs, while each job belongs to one customer.

```text
Customer: John Doe
 │
 ├── Job: Garden maintenance
 ├── Job: Lawn repair
 └── Job: Monthly maintenance
```

---

## 4. Job

Represents a service job performed for a customer.

| Field           | Type      | Purpose                        |
| --------------- | --------- | ------------------------------ |
| `id`            | UUID      | Unique job identifier          |
| `userId`        | UUID      | Owner of the job               |
| `customerId`    | UUID      | Customer receiving the service |
| `title`         | string    | Short job name                 |
| `description`   | string    | Description of the work        |
| `scheduledDate` | date      | Scheduled date                 |
| `status`        | enum      | Current job status             |
| `createdAt`     | timestamp | Creation timestamp             |
| `updatedAt`     | timestamp | Last update timestamp          |

### Status

The MVP defines four job statuses:

```text
scheduled
in_progress
completed
cancelled
```

### Relationships

**User → Job: one-to-many**

**Customer → Job: one-to-many**

**Job → Invoice: one-to-zero-or-one**

A job can have at most one invoice.

An invoice is created as part of the job-completion workflow. A job cannot transition to `completed` unless its invoice is successfully created.

Therefore, while a job may temporarily exist without an invoice while it is still in progress or scheduled, a completed job must have an associated invoice.

```text
Job
 │
 ├── scheduled
 ├── in_progress
 ├── completed ────── Invoice
 └── cancelled
```

---

## 5. Invoice

Represents the minimal billing record associated with a completed job.

| Field       | Type            | Purpose                   |
| ----------- | --------------- | ------------------------- |
| `id`        | UUID            | Unique invoice identifier |
| `userId`    | UUID            | Owner of the invoice      |
| `jobId`     | UUID            | Associated job            |
| `amount`    | numeric/decimal | Amount owed               |
| `dueDate`   | date            | Payment due date          |
| `paidDate`  | date/null       | Date payment was received |
| `createdAt` | timestamp       | Creation timestamp        |
| `updatedAt` | timestamp       | Last update timestamp     |

`paidDate` is nullable because an invoice may remain unpaid.

An invoice number is not included in the MVP. The specification does not require one, and adding it would introduce an additional uniqueness and business-rule requirement without contributing to the core workflow.

---

## 6. Overall Relationships

The primary entity relationships are:

```text
User
  1
  │
  │ has many
  ▼
Customer
  1
  │
  │ has many
  ▼
Job
  1
  │
  │ has zero or one
  ▼
Invoice
```

There is also a direct ownership relationship:

```text
User 1 ────────< Customer
User 1 ────────< Job
User 1 ────────< Invoice
```

### Relationship Summary

| Relationship    | Cardinality                                     |
| --------------- | ----------------------------------------------- |
| User → Customer | 1-to-many                                       |
| User → Job      | 1-to-many                                       |
| User → Invoice  | 1-to-many                                       |
| Customer → Job  | 1-to-many                                       |
| Job → Invoice   | 1-to-0/1                                        |
| Invoice → Job   | many-to-1, with each job limited to one invoice |

There are no many-to-many relationships in the MVP.

---

## 7. Why `userId` Exists on Customer, Job, and Invoice

Although ownership can be inferred through relationships, each user-owned entity contains a direct `userId`.

For example:

```text
Job → Customer → User
```

could be used to determine ownership.

However, storing `userId` directly on `Job` allows the application to perform a straightforward ownership check when accessing a job:

```text
job.userId === authenticatedUser.id
```

The same applies to customers and invoices.

Direct ownership fields also make queries such as retrieving all jobs or invoices belonging to a user straightforward.

The tradeoff is that ownership information is duplicated across related records. The application and database must therefore maintain the relationships consistently.

---

## 8. Job and Invoice Business Rule

The MVP treats job completion and invoicing as a single business workflow while keeping the concepts separate.

When a user attempts to mark a job as `completed`:

```text
Change Job Status
       ↓
Invoice Creation Modal
       ↓
Create Invoice
       ↓
Job becomes Completed
```

If invoice creation is cancelled or fails:

```text
Invoice not created
       ↓
Job remains in its previous status
```

This maintains the following invariant:

> **Every completed job has exactly one invoice.**

There is no separate `/invoices/new` route. Invoice creation is initiated from the job-completion workflow.

Once an invoice exists, it can be viewed at `/invoices/[id]` and edited at `/invoices/[id]/edit`.

---

## 9. MVP Entity Overview

```text
┌──────────────────┐
│       User       │
├──────────────────┤
│ id               │
│ name             │
│ businessName     │
│ email            │
│ passwordHash     │
│ createdAt        │
│ updatedAt        │
└────────┬─────────┘
         │
         │ 1-to-many
         │
         ▼
┌──────────────────┐
│     Customer     │
├──────────────────┤
│ id               │
│ userId           │
│ name             │
│ email            │
│ phone            │
│ address          │
│ createdAt        │
│ updatedAt        │
└────────┬─────────┘
         │
         │ 1-to-many
         │
         ▼
┌──────────────────┐
│       Job        │
├──────────────────┤
│ id               │
│ userId           │
│ customerId       │
│ title            │
│ description      │
│ scheduledDate    │
│ status           │
│ createdAt        │
│ updatedAt        │
└────────┬─────────┘
         │
         │ 1-to-zero-or-one
         │
         ▼
┌──────────────────┐
│     Invoice      │
├──────────────────┤
│ id               │
│ userId           │
│ jobId            │
│ amount           │
│ dueDate          │
│ paidDate         │
│ createdAt        │
│ updatedAt        │
└──────────────────┘
```

This model intentionally keeps the MVP small while supporting the complete ServiceFlow workflow:

```text
User
 ↓
Customers
 ↓
Jobs
 ↓
Completion
 ↓
Invoice
 ↓
Payment tracking
```
