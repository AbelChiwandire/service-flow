# Testing — Users

No automated test suite. API verification was done manually via
`tests/http/users/users.http` (VS Code REST Client) against a local dev server,
with actual responses captured inline in that file as comments beneath
each request. UI flow was verified manually through the browser.

## Environment

- `next dev`, local Postgres (Neon)
- Authenticated user: the signed-in session user (`getSessionUserId()` in `lib/auth/session.ts`).
  These scenarios were originally verified with a hardcoded placeholder user, since removed.
- Passwords hashed with bcrypt (`SALT_ROUNDS = 10`) before storage;
  `passwordHash` is never returned by any read (`PublicUser` type
  excludes it at the repository level)

## API scenarios verified

| Scenario                                      | Endpoint                        | Expected                               | Result |
| --------------------------------------------- | ------------------------------- | -------------------------------------- | ------ |
| Sign up with valid data                       | `POST /api/users`               | 201, user returned (no `passwordHash`) | ✅     |
| Sign up with mismatched passwords             | `POST /api/users`               | 400, `confirmPassword` error           | ✅     |
| Sign up with a short password (<8 chars)      | `POST /api/users`               | 400, `password` error                  | ✅     |
| Sign up with an invalid email                 | `POST /api/users`               | 400, `email` error                     | ✅     |
| Sign up with an email already taken           | `POST /api/users`               | 409 (`EmailAlreadyExistsError`)        | ✅     |
| Sign up with mixed-case email                 | `POST /api/users`               | 201, email stored lowercased           | ✅     |
| Get by valid id                               | `GET /api/users/:id`            | 200, no `passwordHash` in response     | ✅     |
| Get by well-formed but nonexistent id         | `GET /api/users/:id`            | 404                                    | ✅     |
| Get by malformed id                           | `GET /api/users/:id`            | 400 (id validation)                    | ✅     |
| Partial update (single field)                 | `PATCH /api/users/:id`          | 200, other fields unchanged            | ✅     |
| Update email to one already taken             | `PATCH /api/users/:id`          | 409                                    | ✅     |
| Update with an invalid email                  | `PATCH /api/users/:id`          | 400                                    | ✅     |
| Delete a user                                 | `DELETE /api/users/:id`         | 200, cascades to owned customers/jobs  | ✅     |
| Delete an already-deleted user                | `DELETE /api/users/:id`         | 404                                    | ✅     |
| Change password with correct current password | `PATCH /api/users/:id/password` | 200                                    | ✅     |
| Change password with wrong current password   | `PATCH /api/users/:id/password` | 401                                    | ✅     |
| Change password with mismatched new passwords | `PATCH /api/users/:id/password` | 400                                    | ✅     |

## UI / server action paths verified

- `/signup`: create account with valid data → redirect to `/login`
- `/signup`: invalid/mismatched fields → errors shown, non-password values
  preserved on re-render (password fields deliberately not preserved)
- `/signup`: duplicate email → field-level error on the email input
- `/account`: profile pre-filled with existing values
- `/account`: update profile with invalid data → errors shown, values preserved
- `/account`: change password with correct current password → success,
  redirect back to `/account`
- `/account`: change password with wrong current password → field-level
  error on current password, no change made
- `/account`: change password with mismatched new passwords → error shown
- `/account`: delete account → browser confirm dialog shown; Cancel aborts
  the request, OK proceeds and redirects

## Known gaps

- No automated tests. Coverage is manual only (`tests/http/users/users.http`
  for the API, this document for the UI/action paths).
- **Ownership/authorization gap, not yet fixed:** `GET`/`PATCH`/`DELETE
/api/users/:id`, `PATCH /api/users/:id/password`, and the corresponding
  server actions perform no check that the caller is the user at `id` —
  any id works. Unlike customers/jobs, there's no `userId` column to scope
  by here, since this row's own `id` is the thing a session should
  authenticate. Flagged with comments in `lib/db/user/actions.ts`,
  `app/api/users/[id]/route.ts`, and `app/api/users/[id]/password/route.ts`.
  Fix requires the auth branch (session-based `userId`, checked against
  the path `id` on every request).
- Login (`loginAction`, verifying credentials + establishing a session)
  is not implemented here — `/login` is a placeholder page confirming
  `signupAction`'s redirect lands correctly, nothing more.
- `deleteUserAction`'s browser-native `window.confirm` dialog is a
  placeholder; no styled confirmation modal or type-to-confirm safeguard.
- Scenarios were run before auth landed. The user id now comes from the session, not the client.
