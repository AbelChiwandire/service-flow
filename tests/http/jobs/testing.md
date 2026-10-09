# Testing — Jobs CRUD

No automated test suite yet. API verification was done manually via
`tests/http/jobs.http` (VS Code REST Client) against a local dev server,
with actual responses captured inline in that file as comments beneath
each request.

## Environment

- `next dev`, local Postgres (Neon)
- Authenticated user: the signed-in session user (`getSessionUserId()` in `lib/auth/session.ts`).
  These scenarios were originally verified with a hardcoded placeholder user, since removed.
- A seeded customer (from the customer branch's seed data) used as
  `@customerId` in `test/http/jobs.http`

## API scenarios verified

| Scenario                               | Endpoint                            | Expected                        | Result |
| -------------------------------------- | ----------------------------------- | ------------------------------- | ------ |
| Create with valid data                 | `POST /api/customers/:id/jobs`      | 201, job returned               | ✅     |
| Create with invalid title (too short)  | `POST /api/customers/:id/jobs`      | 400, field-level errors         | ✅     |
| Create against a nonexistent customer  | `POST /api/customers/:id/jobs`      | 404                             | ✅     |
| List jobs for a customer               | `GET /api/customers/:id/jobs`       | 200, only that customer's jobs  | ✅     |
| List jobs for a nonexistent customer   | `GET /api/customers/:id/jobs`       | 404 (not an empty list)         | ✅     |
| List all jobs                          | `GET /api/jobs`                     | 200, all of the user's jobs     | ✅     |
| Get by valid id                        | `GET /api/jobs/:id`                 | 200, job returned               | ✅     |
| Get by well-formed but nonexistent id  | `GET /api/jobs/:id`                 | 404                             | ✅     |
| Get by malformed id                    | `GET /api/jobs/:id`                 | 400 (id validation)             | ✅     |
| Partial update (single field)          | `PATCH /api/jobs/:id`               | 200, only that field changed    | ✅     |
| Clear description (explicit `null`)    | `PATCH /api/jobs/:id`               | 200, description becomes `NULL` | ✅     |
| Delete while status is `scheduled`     | `DELETE /api/jobs/:id`              | 409, blocked                    | ✅     |
| Set status to `cancelled`, then delete | `PATCH` then `DELETE /api/jobs/:id` | 200, succeeds                   | ✅     |

## UI / server action paths — verified

- `/customers/:id/jobs/new`: create via form
- `/jobs/:id/edit`: pre-filled form, update via form
- `/jobs`: placeholder list page, delete button, active-job guard message
- Failed validation on the form preserves typed values
- Clearing `description` via an emptied form field

## Known gaps

- No automated tests. API coverage evidenced by `test/http/jobs.http`;
  UI/action coverage still to be done (see above).
- Scenarios were run before auth landed, against a single seeded user. Re-verify under a real session.
- Cross-user ownership (job belonging to another user) not explicitly
  re-tested on this branch; relies on the same `userId`-scoping
  pattern verified on the customer branch.
- Job status workflow (valid transitions, a dedicated cancel action)
  is deferred to a separate issue; today `cancelled` is just one of
  four freely-settable values via the status field.
