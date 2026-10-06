# Testing — Customer CRUD

No automated test suite exists yet for this feature. Verification was
done manually via `tests/http/customers/customers.http` (VS Code REST Client)
against a local dev server, with actual responses captured inline in
that file as comments beneath each request.

## Environment

- `next dev`, local Postgres (Neon)
- Seeded user: `PLACEHOLDER_USER_ID` in `lib/db/auth/placeholder-seesion.ts`
  (temporary stand-in until auth is implemented)

## Scenarios verified

| Scenario | Endpoint | Expected | Result |
    |---|---|---|---|
| Create with valid data | `POST /api/customers` | 201, customer returned | ✅ |
| Create with invalid email | `POST /api/customers` | 400, field-level errors | ✅ |
| Create with missing fields | `POST /api/customers` | 400, field-level errors | ✅ |
| List customers | `GET /api/customers` | 200, only current user's customers | ✅ |
| Get by valid id | `GET /api/customers/:id` | 200, customer returned | ✅ |
| Get by well-formed but nonexistent id | `GET /api/customers/:id` | 404 | ✅ |
| Get by malformed id | `GET /api/customers/:id` | 400 (id validation) | ✅ |
| Partial update (single field) | `PATCH /api/customers/:id` | 200, only that field changed | ✅ |
| Update with invalid data | `PATCH /api/customers/:id` | 400, field-level errors | ✅ |
| Delete with no active jobs | `DELETE /api/customers/:id` | 200, soft-deleted | ✅ |
| Delete with an active (`scheduled`/`in_progress`) job | `DELETE /api/customers/:id` | 409, blocked | ✅ |
| Delete after job marked `completed` | `DELETE /api/customers/:id` | 200, succeeds | ✅ |
| Access another user's customer | `GET/PATCH/DELETE /api/customers/:id` with different `userId` | 404 (ownership scoping via `userId` in query) | ✅ |

## Server action / UI paths (manual, via browser)

- `/customers/new`: create with valid data → redirect to `/customers`, row appears
- `/customers/new`: create with invalid data → errors shown, previously typed values preserved on re-render
- `/customers/[id]/edit`: form pre-filled with existing values
- `/customers/[id]/edit`: update with invalid data → errors shown, submitted values preserved
- `/customers`: delete button → active-jobs guard message shown in place, no crash

## Known gaps

- No automated tests. Manual coverage only, evidenced by
  `tests/http/customers/customers.http` (API) and this document (UI/action paths).
- Auth is not implemented; all scenarios above ran against a single
  seeded placeholder user via `PLACEHOLDER_USER_ID`.
  