# Feature Specification: ServiceFlow

**Feature Branch**: `001-serviceflow`
**Created**: 2026-09-12
**Status**: Draft
**Input**: User description: "Create a project specification for ServiceFlow, a web application for small service businesses to manage customers, jobs, and minimal invoices. Include: a project title and description, the purpose and target audience, user stories for core workflows (sign up, sign in, sign out, create, read, update, delete customers and jobs, manage job status, and manage minimal invoices), acceptance criteria for each story, API endpoints, and implementation priority."

## Overview

## 1. Project Description

ServiceFlow is a web application for small service businesses to manage customers, service jobs, job progress, and minimal invoices in one place.

The application provides authenticated users with a central workspace for managing customer information, scheduling and tracking jobs, recording job status, and managing basic invoice information.

---

## 2. Purpose

The purpose of ServiceFlow is to provide small service businesses with a simple system for organizing their customers, jobs, and basic billing information without the complexity of a full accounting, CRM, or enterprise management system.

---

## 3. Target Audience

ServiceFlow is intended for small service businesses such as:

* Cleaning businesses
* Repair businesses
* Maintenance businesses
* Landscaping businesses
* Other businesses that manage customer service jobs

The MVP focuses on the core workflows required to manage these businesses without introducing unnecessary complexity.

---

## 4. User Stories

## US-001 — Create an Account

**Priority:** P1

**As a** service business user,
**I want** to create a ServiceFlow account,
**so that** I can securely access and manage my business information.

**Acceptance Scenarios**:

* The user can provide the required registration information.
* A new account is created when the information is valid.
* The user is authenticated after successful registration.
* An account cannot be created using an email address that is already registered.
* Invalid registration information is rejected with an appropriate error.

---

## US-002 — Sign In and Sign Out

**Priority:** P1

**As a** registered user,
**I want** to sign in and sign out of ServiceFlow,
**so that** my business information is protected.

**Acceptance Scenarios**:

* A registered user can sign in with valid credentials.
* Invalid credentials are rejected.
* An authenticated user can sign out.
* Protected functionality cannot be accessed by unauthenticated users.
* Users can only access data they are authorized to access.

---

## US-003 — Manage Customers

**Priority:** P1

**As a** service business user,
**I want** to create, view, update, and delete customers,
**so that** I can maintain accurate customer records.

**Acceptance Scenarios**:

* A user can create a customer.
* A user can view their customers.
* A user can view an individual customer's information.
* A user can update a customer.
* A user can delete a customer when it is safe to do so.
* A customer cannot be deleted in a way that leaves associated jobs invalid.
* Users cannot access another user's unauthorized customer records.
* Invalid customer information is rejected.

---

## US-004 — Manage Jobs

**Priority:** P1

**As a** service business user,
**I want** to create and manage jobs for my customers,
**so that** I can keep track of the work my business needs to perform.

**Acceptance Scenarios**:

* A user can create a job for an existing customer.
* A job contains relevant information such as a title, description, scheduled date, customer, and status.
* A user can view their jobs.
* A user can view an individual job.
* A user can update a job.
* A user can delete a job.
* A job must reference a valid customer.
* Users cannot create or modify jobs belonging to another user's unauthorized data.

---

## US-005 — Manage Job Status

**Priority:** P1

**As a** service business user,
**I want** to update the status of a job,
**so that** I can track its progress.

### Job Statuses

The MVP supports:

* `planned`
* `in_progress`
* `completed`
* `cancelled`

**Acceptance Scenarios**:

* A newly created job has an appropriate initial status.
* A user can update a job's status.
* Only the defined job statuses can be used.
* Invalid status changes are rejected.
* A completed job is eligible for a minimal invoice.
* A cancelled job is not treated as an active job.

The exact rules governing every possible status transition may be refined during implementation planning.

---

## US-006 — Manage Minimal Invoices

**Priority:** P2

**As a** service business user,
**I want** to create and manage a basic invoice for a completed job,
**so that** I can keep track of the amount owed for completed work.

### Invoice Information

A minimal invoice contains:

* Amount
* Due date
* Paid date, when applicable

**Acceptance Scenarios**:

* An invoice can be created for a completed job.
* A completed job can have no more than one invoice.
* A user can view their invoices.
* A user can view an individual invoice.
* A user can update an invoice.
* A user can delete an invoice.
* An invoice must contain a valid amount.
* An invoice must contain a due date.
* A paid date is optional.
* Users cannot access another user's unauthorized invoices.

ServiceFlow does not provide payment processing, accounting, tax calculations, or advanced billing functionality in the MVP.

---

## US-007 — Review the Dashboard

**Priority:** P2

**As a** service business user,
**I want** to see an overview of important business activity,
**so that** I can quickly understand the current state of my work.

**Acceptance Scenarios**:

* Authenticated users can access the dashboard.
* The dashboard provides an overview of relevant customer, job, and invoice information.
* The dashboard can show active or upcoming jobs.
* The dashboard can show relevant outstanding invoice information.
* Dashboard requirements may be refined as the team determines which information is most useful.

---

## 5. Core Functional Requirements

### Authentication and Authorization

**FR-001:** The system shall allow users to create accounts and authenticate.

**FR-002:** The system shall protect functionality that requires authentication.

**FR-003:** Users shall only be able to access and modify data they are authorized to access.

### Customers

**FR-004:** The system shall support customer creation, retrieval, updating, and deletion.

**FR-005:** Customer records shall maintain their relationship with associated jobs.

### Jobs

**FR-006:** The system shall support job creation, retrieval, updating, and deletion.

**FR-007:** Each job shall be associated with a valid customer.

**FR-008:** Jobs shall support the defined statuses: `planned`, `in_progress`, `completed`, and `cancelled`.

**FR-009:** Jobs shall contain a scheduled date.

### Invoices

**FR-010:** The system shall support creation, retrieval, updating, and deletion of minimal invoices.

**FR-011:** An invoice shall be associated with a completed job.

**FR-012:** A completed job shall have no more than one invoice.

**FR-013:** The system shall validate invoice information before saving it.

### Dashboard

**FR-014:** The system shall provide an authenticated dashboard that summarizes relevant job and invoice activity.

### Validation and Errors

**FR-015:** The system shall validate user input before processing or storing it.

**FR-016:** The system shall provide appropriate responses for invalid, missing, or unauthorized requests.

**FR-017:** The system shall handle loading, empty, and not-found states appropriately in the user interface.

---

## 6. API Endpoints

The following endpoints represent the proposed API structure for the MVP and may be refined during technical planning.

### Authentication Endpoints

* `POST /api/auth/sign-up` — Create an account
* `POST /api/auth/sign-in` — Authenticate a user
* `POST /api/auth/sign-out` — Sign out a user

### Customer Endpoints

* `GET /api/customers` — Retrieve customers
* `POST /api/customers` — Create a customer
* `GET /api/customers/{customerId}` — Retrieve a customer
* `PATCH /api/customers/{customerId}` — Update a customer
* `DELETE /api/customers/{customerId}` — Delete a customer

### Job Endpoints

* `GET /api/jobs` — Retrieve jobs
* `POST /api/jobs` — Create a job
* `GET /api/jobs/{jobId}` — Retrieve a job
* `PATCH /api/jobs/{jobId}` — Update a job
* `DELETE /api/jobs/{jobId}` — Delete a job
* `PATCH /api/jobs/{jobId}/status` — Update job status

### Invoice Endpoints

* `GET /api/invoices` — Retrieve invoices
* `POST /api/invoices` — Create an invoice
* `GET /api/invoices/{invoiceId}` — Retrieve an invoice
* `PATCH /api/invoices/{invoiceId}` — Update an invoice
* `DELETE /api/invoices/{invoiceId}` — Delete an invoice

### Dashboard Endpoints

* `GET /api/overview` — Retrieve information required by the dashboard

---

## 7. Core Entities

The initial domain model consists of:

### User

Represents an authenticated ServiceFlow user.

### Customer

Represents a customer receiving services from the business.

### Job

Represents a service job associated with a customer.

### Invoice

Represents a minimal invoice associated with a completed job.

### Business

A Business entity may be used to support business ownership and future multi-user functionality. This relationship is considered useful for the application's future architecture but does not require a full business-management or role-management system in the MVP.

---

## 8. Implementation Priority

### P1 — Core MVP

1. Account creation
2. Authentication
3. Customer CRUD
4. Job CRUD
5. Job status management

### P2 — Supporting Features

1. Minimal invoice management
2. Dashboard

The P1 features should establish the application's core functionality before the P2 features are completed.

---

## 9. Out of Scope

The following functionality is outside the MVP:

* Payment processing
* Full accounting
* Tax calculations
* Recurring billing
* Advanced CRM functionality
* Payroll
* Complex business administration
* Enterprise features
* Advanced reporting
* Complex role-based access control unless later required by the team
* Other functionality not directly related to the agreed ServiceFlow MVP

---

## 10. Success Criteria

ServiceFlow will be considered successful when users can complete the core business workflows:

1. Create and authenticate an account.
2. Create, view, update, and delete customers.
3. Create and manage jobs associated with customers.
4. Schedule jobs and track their status.
5. Mark jobs as completed or cancelled.
6. Create and manage a minimal invoice for a completed job.
7. View relevant business activity through the dashboard.
8. Access only authorized business data.
9. Receive appropriate validation and error responses.

The application should remain focused on providing these workflows without expanding into a full accounting, CRM, or enterprise management platform.

---

## 11. Specification Notes

Some implementation details may be refined during the planning stage.

In particular:

* Exact dashboard contents may be refined by the team.
* Exact job status transition rules may be refined.
* Customer deletion behavior may be refined based on the final data model.
* The relationship between users and businesses may be refined during database design.
* API routes may be adjusted if the final architecture requires it.
* Additional validation rules may be established during implementation planning.

These refinements should remain consistent with the core purpose and MVP scope of ServiceFlow.
