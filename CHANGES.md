# Changes made (summary)

Date: 2026-05-23

This file summarizes the client-side state changes I added so the projects list is shared between the Home page and the Projects page.

**Files added**
- [app/context/ProjectsContext.jsx](app/context/ProjectsContext.jsx)
  - New client-side React context that holds `projects` state, syncs with `localStorage`, normalizes old plain-string entries into `{ name, status }`, and exposes `useProjects()` and `addProject()`.
- [app/providers.jsx](app/providers.jsx)
  - Small wrapper component that currently mounts `ProjectsProvider` and can host more providers later.

**Files modified**
- [app/layout.js](app/layout.js)
  - Wrapped the app `children` with `<Providers>` so client-side context is available across pages.
- [app/page.js](app/page.js)
  - Replaced local `projects` state with `useProjects()` from the context and now calls `addProject()` to add new items.
- [app/projects/page.jsx](app/projects/page.jsx)
  - Uses `useProjects()` to read the shared `projects` list (instead of reading `localStorage` directly).

**Behavioral notes / why**
- The Context provider keeps a single source of truth for projects and makes the UI reactive across pages without full page reloads.
- The provider normalizes older localStorage formats where a project could be stored as a plain string (it converts strings to `{ name, status: "Todo" }`) so the UI always reads `project.name` safely.

**How to test**
1. Start the dev server:

```bash
npm run dev
```

2. (Optional) Clear old project storage in the browser console:

```js
localStorage.removeItem('projects')
```

3. Open the app, add a project on the Home page — it should appear immediately in the "Recent Projects" list and on the `/projects` page.

**Edge cases / future improvements**
- Consider adding edit/delete/status-change handlers in the context.
- For larger apps, a lightweight store (Zustand) may be preferable.

If you want, I can also:
- Add edit/delete/status controls now.
- Switch the provider to Zustand and migrate the persistence logic.


