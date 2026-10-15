# ServiceFlow Design System

## Overview

ServiceFlow uses a small, consistent visual system built only with **Tailwind CSS v4**. There is no third-party component library (such as shadcn/ui). Colors are CSS variables, and repeated UI patterns are semantic classes defined in a custom Tailwind component layer.

Everything described here lives in [`app/globals.css`](../app/globals.css), which is the single source of truth for colors and shared component styles.

## Color Palette

The palette is intentionally small. One color is used per role, plus a hover variant where needed.

| Variable           | Value              | Role                                                |
| ------------------ | ------------------ | --------------------------------------------------- |
| `--background`     | `#ffffff`          | Page background                                     |
| `--foreground`     | `#000000`          | All body text, headings, and gray-looking text      |
| `--navy`           | `#172554`          | Primary actions, links, active states, text on blue |
| `--navy-hover`     | `#243b6b`          | Hover state for navy buttons                        |
| `--maroon`         | `#7f1d1d`          | Errors, destructive actions, cancelled status       |
| `--maroon-hover`   | `#8b2635`          | Hover state for maroon buttons                      |
| `--green`          | `#14532d`          | Completed status                                    |
| `--status-gray`    | `#374151`          | Scheduled status (the only gray text)               |
| `--surface`        | `#f8fafc`          | Subtle surfaces (table headers, app background)     |
| `--surface-strong` | `#e2e8f0`          | Skeletons and stronger neutral fills                |
| `--border`         | `rgb(0 0 0 / 15%)` | Borders and dividers                                |

Tint variables (`--navy-tint`, `--maroon-tint`, `--green-tint`, `--status-gray-tint`) are 5% mixes of the base color with white (`color-mix`). They are used for badge and hover backgrounds, and fall back to transparent in browsers without `color-mix`.

All variables are exposed to Tailwind through `@theme inline`, so utilities such as `text-navy`, `bg-maroon`, and `bg-navy-tint` work as expected.

### Color rules

- Text is black (`foreground`). Gray text is not used, except for the scheduled status.
- Any text that is blue is **navy**. Any text that is red is **maroon**.
- White text only sits on navy or maroon backgrounds, which keeps contrast accessible.
- Lighter tints are used for hover effects, backgrounds, and borders only, never for text.
- Indigo, red, and multi-step shade scales (200–800) are not used.
- Color is never the only signal; statuses always include their text label.

### Job status badges

| Status      | Text color    | Background (5% tint) |
| ----------- | ------------- | -------------------- |
| Scheduled   | `status-gray` | gray tint            |
| In progress | `navy`        | navy tint            |
| Completed   | `green`       | green tint           |
| Cancelled   | `maroon`      | maroon tint          |

## Typography

ServiceFlow uses **Inter** (via `next/font/google`) as its font family. The type scale is applied through component classes so that similar elements look identical everywhere.

| Class             | Utilities                                           | Use                         |
| ----------------- | --------------------------------------------------- | --------------------------- |
| `heading-display` | large responsive display size, bold, tight tracking | Landing page hero only      |
| `heading-h1`      | `text-2xl font-bold tracking-tight sm:text-3xl`     | Page titles (`PageHeader`)  |
| `heading-h2`      | `text-xl font-semibold`                             | Section headings            |
| `heading-h3`      | `text-lg font-semibold`                             | Sub-section / card headings |
| `body-text`       | `text-sm leading-6 sm:text-base`                    | Paragraphs                  |
| `small-text`      | `text-sm`                                           | Supporting text             |
| `label-text`      | small, medium weight                                | Detail labels               |
| `field-label`     | small, medium weight                                | Form labels                 |
| `stat-value`      | `text-2xl font-bold`                                | Dashboard numbers           |

## Spacing

Spacing follows an 8px grid using standard Tailwind steps only:

| Token | Tailwind | Size |
| ----- | -------- | ---- |
| xs    | `1`      | 4px  |
| sm    | `2`      | 8px  |
| md    | `4`      | 16px |
| lg    | `6`      | 24px |
| xl    | `8`      | 32px |
| xxl   | `12`     | 48px |

No arbitrary values (`p-[17px]`) or inline styles are used. The landing page is a deliberate exception and uses larger section padding (`py-16` to `py-32`).

## Component Layer

Repeated UI is defined once under `@layer components` in `globals.css` using `@apply`. Unique, placement-specific layout (parent flex or grid, one-off margins) stays inline in the component.

| Group            | Classes                                                                                                                                                                                                                                                                                               |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Typography       | `heading-display`, `heading-h1`–`h3`, `lead-text`, `body-text`, `small-text`, `caption-text`, `label-text`, `item-title`, `eyebrow-text`, `stat-value`, `error-text`, `link-primary`, `link-inline`, `link-subtle`                                                                                    |
| Buttons          | `btn-primary`, `btn-secondary`, `btn-danger`, `btn-danger-outline`, `btn-inverse`, `btn-disabled`, `btn-lg`, `btn-icon`, `btn-ghost`                                                                                                                                                                  |
| Forms            | `input-field`, `input-field-invalid`, `field-label`, `form-actions`, `row-responsive`, `alert-error`                                                                                                                                                                                                  |
| Cards and panels | `card-surface`, `card-padded`, `card-elevated`, `card-feature`, `card-muted`, `card-outline`, `auth-card`, `empty-panel`, `details-grid`, `stat-grid`, `panel-header`, `list-divided`, `list-row-link`, `data-head`, `data-row`, `section-divider`, `dropdown-panel`, `dropdown-item`, `modal-dialog` |
| Layout           | `page-shell`, `page-main`, `page-main-centered`, `auth-main`, `page-header`, `header-surface`                                                                                                                                                                                                         |
| Small elements   | `nav-link` (+ `-active`, `-idle`), `summary-card` (+ `-default`, `-alert`), `badge` (+ `-navy`, `-green`, `-maroon`, `-gray`), `icon-tile`, `skeleton`, `spinner`                                                                                                                                     |

Notes:

- Tailwind's `@apply` cannot apply custom classes, so each class lists its utilities in full.
- The utilities layer overrides the components layer, so an inline utility such as `w-full` or `h-12` can adjust a component class where needed.
- Avoid class names that collide with built-in Tailwind utilities. For example, `table-row` is a Tailwind utility (`display: table-row`), which is why the list layout classes are named `data-row` and `data-head`.

## Layout Patterns

```text
Header / Navigation
        ↓
Page Header (title, description, primary action)
        ↓
Filters (search, status)
        ↓
Content (list, form, or details)
        ↓
Pagination (pinned to the bottom of the page)
```

- Authenticated pages are wrapped in `AuthenticatedShell`: a sidebar on desktop and a slide-out menu on small screens, with an account menu in the header.
- Every authenticated page starts with the shared `PageHeader`.
- Lists use `DataTable` / `DataRow`: a column header row and grid rows on `md+`, stacked card-like rows on small screens. The same item component serves both.
- Pagination sits at the bottom of the viewport area even when a list has few entries.

## Responsive Design

ServiceFlow is **mobile-first**. Layout changes use Tailwind responsive variants (`sm:`, `md:`, `lg:`). Forms stay usable without horizontal scrolling, and all buttons are 40px tall (48px for `btn-lg`) for touch use.

## Shared Components

Shared UI lives in `components/shared/` and `components/layout/`:

| Component                                   | Purpose                                          |
| ------------------------------------------- | ------------------------------------------------ |
| `PageHeader`                                | Page title, description, and primary action      |
| `ButtonLink`                                | Link styled as a primary or secondary button     |
| `ConfirmActionButton`                       | Two-step confirmation for destructive actions    |
| `DeleteSection`                             | Destructive-action section on detail pages       |
| `DataTable` / `DataRow`                     | Responsive list layout                           |
| `ListFilters`, `Pagination`                 | Search/filter controls and paging                |
| `BackLink`                                  | Back navigation on detail and form pages         |
| `FieldErrors`, `FormMessage`, `FormActions` | Form validation and action layout (`form.tsx`)   |
| `LoadingState`                              | Loading spinner and message                      |
| `EmptyState`                                | Empty lists and sections, with optional icon     |
| `ErrorMessage`                              | Inline error text                                |
| `ErrorState`                                | Full error panel with retry, used by `error.tsx` |
| `Modal`                                     | Native `<dialog>` wrapper                        |

## Application States

- **Loading:** `loading.tsx` in the authenticated area, `LoadingState`, and `DashboardSummarySkeleton`.
- **Empty:** `EmptyState` for lists and dashboard sections with no data.
- **Error:** `app/error.tsx` and `app/(authenticated)/error.tsx` render `ErrorState` with a retry button.
- **Not found:** `app/not-found.tsx` and `app/(authenticated)/not-found.tsx`, used by pages that call `notFound()`.

## Interaction Conventions

- **Buttons:** primary (navy) for the main action, secondary (outlined) for supporting actions, danger (maroon) for destructive actions. The Account page uses the same navy buttons as the rest of the app.
- **Forms:** consistent label placement, `input-field` styling, inline field errors, and an invalid-state border.
- **Dialogs:** the shared `Modal`, built on the native `<dialog>` element.
- **Focus:** buttons and inputs show a visible focus outline.

## Principle

Favor **consistency and simplicity**: one color per role, one class per repeated pattern, and the standard Tailwind scale throughout.
