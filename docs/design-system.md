# ServiceFlow Design System

## Overview

ServiceFlow uses a simple, consistent visual system designed for a professional service-business management application. The design system establishes shared defaults for color, typography, spacing, layout, responsiveness, and UI components.

These conventions provide a common starting point for implementation. Individual values and component styling may be refined during development when practical UI requirements become clearer.

## Color Palette

ServiceFlow uses a blue and indigo palette as its primary brand identity.

| Role                   | Color       | Hex       |
| ---------------------- | ----------- | --------- |
| Primary                | Deep Blue   | `#2667FF` |
| Primary Hover/Active   | Bright Blue | `#3F8EFC` |
| Accent                 | Indigo      | `#3B28CC` |
| Light Accent           | Sky Blue    | `#87BFFF` |
| Light Brand Background | Light Blue  | `#ADD7F6` |

### Semantic Usage

* **Primary (`#2667FF`)** — primary actions, important links, and key interactive elements.
* **Primary Hover/Active (`#3F8EFC`)** — hover and active variations of primary interactions.
* **Accent (`#3B28CC`)** — stronger emphasis and selected states where additional contrast is appropriate.
* **Light Accent (`#87BFFF`)** — subtle highlights and secondary branded elements.
* **Light Brand Background (`#ADD7F6`)** — branded background sections and supporting visual areas.

Neutral colors such as white, gray, and slate may be used for the main application background, surfaces, borders, and supporting text. The branded colors should not be used for every UI element.

Color should not be the only method used to communicate meaning. Statuses and important states should also use text, icons, or other visual indicators.

## Typography

ServiceFlow uses **Inter** as its primary font family.

Typography should use Tailwind's standard type scale rather than introducing unnecessary custom sizes.

### Hierarchy

* **Page titles** — large and bold.
* **Section headings** — medium to large and semibold.
* **Body text** — regular weight and readable size.
* **Labels** — medium weight.
* **Supporting text** — smaller and visually muted.

Typography should establish a clear hierarchy while remaining consistent across pages.

## Layout Patterns

ServiceFlow uses a consistent page structure throughout the application:

```text
Header / Navigation
        ↓
Page Header
        ↓
Main Content
        ↓
Lists / Forms / Cards / Other Content
```

### Page Layout

Authenticated pages should generally:

* Use a centered content container.
* Maintain consistent horizontal padding.
* Use a page header containing the page title and, when appropriate, a primary action.
* Organize related content into clear sections.
* Use cards when they help group or distinguish information rather than wrapping every element in a card.

### Lists and Data

Business data should primarily use row or table-based presentations on larger screens.

On smaller screens, the same domain item component may change to a more compact card-like presentation. Separate desktop and mobile components should not be created unless their implementations become meaningfully different.

## Spacing

ServiceFlow uses Tailwind's standard spacing scale.

The project should prefer standard Tailwind spacing utilities rather than arbitrary pixel values.

General conventions include:

* Small internal spacing — approximately `2` to `3`.
* Normal component spacing — approximately `4`.
* Larger component or section spacing — approximately `6`.
* Major page sections — approximately `8` or greater.

The exact spacing may vary according to the component, but related components should use consistent spacing patterns.

## Responsive Design

ServiceFlow follows a **mobile-first** approach.

Responsive behavior should be implemented using Tailwind's responsive utilities.

The interface should:

* Begin with a usable mobile layout.
* Expand and reorganize content for larger screens.
* Adapt navigation to available screen space.
* Allow lists and tables to change presentation on smaller screens.
* Keep forms usable without horizontal scrolling.
* Maintain usable interactive controls on touch devices.

## Shared UI Library

ServiceFlow will use **shadcn/ui** for common interface primitives.

Common primitives may include:

* `Button`
* `Input`
* `Label`
* `Select`
* `Dialog`
* `AlertDialog`
* `Badge`
* `Card`
* `Table`
* Form-related primitives

These primitives provide the foundation for ServiceFlow's domain-specific components.

For example:

```text
shadcn/ui primitives
        ↓
ServiceFlow domain components
        ↓
ServiceFlow pages
```

Domain components such as `CustomerForm`, `JobDetails`, and `InvoiceDetails` should compose these shared primitives rather than repeatedly implementing their own basic UI controls.

shadcn/ui components may be customized when necessary to meet ServiceFlow's design requirements.

## UI Interaction Conventions

### Buttons

* **Primary** — important or primary actions.
* **Secondary** — supporting actions.
* **Outline/Ghost** — lower-emphasis actions where appropriate.
* **Destructive** — actions that remove or permanently change data.

### Status Indicators

Statuses should use badges or similarly compact visual indicators that include the status text. Color may reinforce the meaning but should not be the only indicator.

Examples include:

* `Scheduled`
* `In Progress`
* `Completed`
* `Cancelled`

### Dialogs

Dialogs should use shadcn/ui's `Dialog` or `AlertDialog` primitives rather than creating a separate application-wide modal implementation.

The job-completion invoice workflow is an example of a domain-specific interaction that can be implemented using these shared dialog primitives.

### Forms

Forms should maintain consistent:

* Label placement
* Field spacing
* Input styling
* Validation messages
* Error presentation
* Action placement

### Application States

Shared components should be used for common application states:

* `LoadingState` — loading operations and page content.
* `EmptyState` — pages or sections with no data.
* `ErrorMessage` — errors that need to be presented to the user.

## Tailwind Conventions

Tailwind utility classes should be used directly for component styling.

The project should:

* Prefer existing Tailwind utilities over custom CSS when practical.
* Use the established design tokens and semantic colors rather than repeatedly introducing raw values.
* Use responsive variants for layout changes.
* Use state variants such as `hover:`, `focus:`, and `disabled:` for interaction states.
* Avoid arbitrary values unless the design genuinely requires them.

The design system is intended to provide consistent defaults while allowing components to evolve as implementation and usability requirements become clearer.

## Design System Principle

ServiceFlow should favor **consistency and simplicity over unnecessary visual complexity**.

The design system establishes shared foundations for the application, while detailed component styling can be refined during implementation without requiring the entire design system to be redesigned.
