# Funlane Travel Portal

A Next.js (App Router) + TypeScript refactor of the original vanilla-JS prototype.
The client portal and the agency dashboard are now **separate, authenticated areas**
behind a login screen and role-based authorization.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000 — you'll be redirected to `/login`.

### Demo accounts

Any non-empty password works. Pick the matching role tab on the login screen.

| Role   | Email                  |
| ------ | ---------------------- |
| Client | travel@zenithcorp.ng   |
| Client | adeola.b@gmail.com     |
| Agent  | chidi@funlane.ng       |
| Agent  | fatima@funlane.ng      |

## Authentication & authorization

- **Login (`/login`)** authenticates against the seeded clients/agents and stores a
  principal in `localStorage` (Zustand) plus a small cookie.
- **`src/middleware.ts`** reads that cookie at the edge and enforces separation:
  - unauthenticated → `/login`
  - client hitting `/agent/*` → `/client/dashboard` (and vice-versa)
- **`DashboardShell`** mirrors the same guard on the client for a graceful loading state.

## Project structure (`src/`)

| Folder        | Responsibility                                                        |
| ------------- | -------------------------------------------------------------------- |
| `api/`        | Async "network" layer (simulated). Swap for real `fetch` here only.  |
| `app/`        | Next.js App Router routes, layouts, and `globals.css`.               |
| `components/` | Reusable presentational UI + layout (Topbar, Sidebar, Modal, …).    |
| `containers/` | Feature/page-level components composing components + hooks.           |
| `hooks/`      | React hooks (`useAuth`, `useRequests`, `useWallet`, `useToast`, …). |
| `interface/`  | TypeScript types/interfaces.                                          |
| `lib/`        | Constants, seed data, cookie helpers.                                |
| `services/`   | Pure domain logic (auth, wallet, request derivations).               |
| `store/`      | Zustand state + mutations (portal data, auth, toasts).               |
| `utils/`      | Formatters and small helpers.                                        |
| `middleware/` | Reusable authorization guard logic used by `src/middleware.ts`.      |

