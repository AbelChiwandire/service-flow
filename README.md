# ServiceFlow

ServiceFlow is a web application for small service businesses to manage customers, service jobs, job progress, and basic invoice information in one place.

The project is currently in development. The repository contains the Next.js application foundation, while authentication, persistence, and the full business workflows described below are being built incrementally.

## MVP Scope

ServiceFlow is designed for businesses such as cleaning, repair, maintenance, and landscaping services.

The planned MVP includes:

- Account creation, sign-in, and sign-out
- Customer creation, viewing, editing, and deletion
- Job creation, viewing, editing, and deletion
- Job statuses: `scheduled`, `in_progress`, `completed`, and `cancelled`
- A dashboard with relevant job and invoice summaries
- Minimal invoices associated with completed jobs

When a job is marked as completed, the user provides invoice information as part of the completion workflow. Each completed job has one invoice containing an amount and due date. A paid date is optional.

Payment processing, accounting, tax calculations, recurring billing, and full CRM or ERP functionality are outside the MVP scope.

## Technology

The project uses or is being built with:

- Next.js App Router
- React
- TypeScript with strict mode
- Tailwind CSS and PostCSS
- ESLint
- Prettier

PostgreSQL/Neon, Auth.js, and shadcn/ui are part of the planned application architecture and will be documented further as they are implemented.

## Getting Started

### Prerequisites

- Node.js and npm

### Installation

```bash
npm install
```

### Development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in a browser.

### Other commands

```bash
npm run lint
npm run build
npm start
```

## Project Structure

- `app/` — Next.js routes, layouts, and application UI
- `docs/` — Product specifications, architecture, data model, design system, and project constitution
- `public/` — Static assets

## Documentation

- [Feature specification](docs/spec.md)
- [Architecture](docs/architecture.md)
- [Data model](docs/data-model.md)
- [Design system](docs/design-system.md)
- [Project constitution](docs/constitution.md)

## Team 13 Members

- Abel Chiwandire
- Prayer Marangwanda
- Olanrewaju Ayomide Adebayo
- Ijato Precious-jane Okpen
