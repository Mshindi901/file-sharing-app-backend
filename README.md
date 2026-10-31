# backend

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.js
```

To type check:

```bash
bun check
```

Set `FRONTEND_URL` to the frontend's origin (for example,
`https://file-sharing-app-frontend-eta.vercel.app`) in the backend deployment
environment to allow browser requests from that site. The deployed frontend
origin is also included in the CORS allowlist.

The admin users endpoint (`GET /api/admin/users`) requires an admin bearer
token and returns account name, email, role, and creation date. Creating
additional admins through `POST /api/auth/admin/signup` also requires an
existing admin session; provision the initial admin account directly in the
database.

Run `bun fmt` to format the code.

This project was created using `bun init` in bun v1.4.4. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
