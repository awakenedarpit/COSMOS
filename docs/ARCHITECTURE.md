# COSMOS Architecture

## Product layers

COSMOS is organized around four product layers:

1. **Command center:** the dashboard summarizes the state of the academic universe and provides the next useful action.
2. **Academic entities:** subjects, syllabus modules, tasks, schedules, study sessions, goals, and roadmap tracks represent the user's work.
3. **Signals:** progress rings, streaks, analytics, semester journey state, and activity provide feedback without turning the product into a game.
4. **Future intelligence:** scheduling recommendations, backlog triage, weekly review, AI assistance, and cloud synchronization are designed as additions around the current model.

## Current frontend boundary

The V1 frontend is a static React application. `client/src/App.tsx` currently owns the route-level view selection, small seed datasets, task state, modal state, and local-storage persistence. `client/src/index.css` owns the COSMOS visual system, responsive breakpoints, motion preferences, and visualization styling.

The current task model is intentionally small:

```ts
type Task = {
  id: number;
  title: string;
  course: string;
  due: string;
  label: "Today" | "Tomorrow" | "This week";
  priority: "High" | "Medium" | "Low";
  done: boolean;
};
```

Tasks are serialized under `cosmos.tasks`. Keep the UI behavior stable when expanding this model; use a migration or schema version rather than silently changing stored data.

## Persistence evolution

The intended order for richer storage is:

1. Add a `storageVersion` envelope around the existing local data.
2. Introduce IndexedDB for tasks, sessions, notes, subjects, and settings.
3. Keep local writes immediate and treat sync as an asynchronous enhancement.
4. Add import/export so the user can always recover their academic data.
5. Add conflict-aware Supabase synchronization only after the offline model is reliable.

## Cloud and AI seams

Authentication, Supabase, and AI are not required by V1. When introduced, they should be accessed from a server-side boundary or managed integration. Never put service credentials in `client/`. An AI copilot should receive only the user-approved context it needs, produce inspectable recommendations, and never silently modify schedules or tasks.

## Visual architecture

The orbit, journey, progress rings, chart, and focus bars are CSS/SVG primitives. This keeps the initial experience fast, portable to GitHub Pages, and free of large media assets. If a future 3D engine is introduced, preserve a reduced-motion and low-performance mode and keep the same semantic data visible in accessible cards.

## Navigation

Desktop uses a fixed sidebar. Mobile uses a compact top bar, a bottom navigation bar for the highest-frequency destinations, and the same client-side view model. Any future deep-link routing should preserve an escape route through the global shell.
