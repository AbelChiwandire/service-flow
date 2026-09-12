<!--
Sync Impact Report
Version change: [none] → 1.0.0 (initial ratification)
Modified principles: n/a (new document)
Added sections:
  - Core Principles (I–X: Strict TypeScript, Next.js Architecture,
    Utility-First Interface, Proportional Testing, Clear Boundaries and
    Naming, Focused MVP Scope, Explicit Data and Business Rules,
    Authentication and Data Protection, Boundary Validation and Safe Errors,
    Collaborative Quality)
  - Technology Constraints
  - Development Workflow and Collaboration
  - Governance
Removed sections: none
Templates requiring updates:
  ✅ .specify/templates/plan-template.md (generic gate reference, no changes needed)
  ✅ .specify/templates/spec-template.md (no principle-specific references found)
  ✅ .specify/templates/tasks-template.md (no principle-specific references found)
  ✅ .specify/templates/checklist-template.md (no principle-specific references found)
  ⚠ No command files found under .specify/templates/commands/ — none to update
Follow-up TODOs: none
-->

# ServiceFlow Constitution

## Core Principles

### I. Strict TypeScript

ServiceFlow MUST use TypeScript strict mode. Production code MUST NOT use `any`. Types MUST be used appropriately to clearly define application data and contracts.

### II. Next.js Architecture

ServiceFlow MUST use Next.js App Router and file-based routing. Server Components MUST be the default, with Client Components used when browser-side interaction or state requires them. The application MUST follow appropriate Next.js conventions for components, routing, data handling, and server-side operations.

### III. Utility-First Interface

Tailwind CSS MUST be the primary styling system. UI styling MUST follow a utility-first approach. Custom CSS MUST only be used when necessary. Shared UI patterns SHOULD be implemented as reusable components.

### IV. Proportional Testing

Important application functionality and business rules MUST be tested. Tests SHOULD cover core CRUD operations, validation, authentication and authorization, and important user workflows. Testing MUST remain proportional to the MVP scope.

### V. Clear Boundaries and Naming

Names MUST be clear and descriptive and follow TypeScript, React, and Next.js conventions. Files and modules MUST be organized by responsibility. UI components, data access, business logic, and API functionality SHOULD remain appropriately separated to avoid unnecessary coupling.

### VI. Focused MVP Scope

ServiceFlow MUST remain a focused MVP for managing customers, jobs, and minimal invoice records. Features MUST satisfy an approved requirement before implementation. The product MUST NOT expand into a full accounting, CRM, ERP, or enterprise management system without explicit approval. When several designs satisfy a requirement, the simplest solution SHOULD be preferred.

### VII. Explicit Data and Business Rules

Customers MUST belong to the authenticated business or user, and jobs MUST be associated with customers. A completed job MAY have one associated minimal invoice. An MVP invoice MUST contain an amount and due date and MAY contain a paid date. Payment processing, accounting, tax calculations, recurring billing, and other advanced billing features MUST NOT be introduced unless explicitly required.

### VIII. Authentication and Data Protection

Protected application functionality MUST require authentication. Users MUST only access and modify data for which they are authorized. Authorization MUST be enforced independently of UI visibility.

### IX. Boundary Validation and Safe Errors

User input MUST be appropriately validated before reaching business logic or persistence. The application MUST handle invalid input, missing resources, and unauthorized operations clearly. User-facing errors MUST be useful without exposing sensitive implementation details.

### X. Collaborative Quality

Developers MUST work on feature branches rather than directly on the main branch. Changes MUST be submitted through pull requests and reviewed by another team member before merging. Contributors MUST follow the project's ESLint and Prettier configuration and keep commits focused and descriptive.

## Technology Constraints

The application MUST use Next.js with the App Router, TypeScript in strict mode, Tailwind CSS, ESLint, and Prettier. New technologies MUST NOT be added to the baseline stack without team approval. The product scope is limited to small service businesses managing customers, jobs, and minimal invoices.

## Development Workflow and Collaboration

Development MUST be organized around clear user stories and approved project requirements. Developers SHOULD consider affected routes, components, data, and tests before implementation.

Code MUST use clear and descriptive names and follow established TypeScript, React, and Next.js naming conventions.

Changes MUST be submitted through pull requests and reviewed by another team member before merging. Contributors MUST keep commits focused and follow the project's agreed coding standards.

## Governance

This constitution is the governing development standard for ServiceFlow. When another project practice conflicts with it, these principles take precedence unless the project team approves an exception.

Amendments MUST state the motivation and affected principles and require review and agreement from the project team. The version and last-amended date MUST be updated when an amendment is adopted.

Versioning follows semantic versioning:

* MAJOR for incompatible governance or principle changes.
* MINOR for new principles or materially expanded obligations.
* PATCH for clarifications that do not change required behavior.

**Version**: 1.0.0 | **Ratified**: 2026-09-11 | **Last Amended**: 2026-09-11
