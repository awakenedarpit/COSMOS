# COSMOS Project Memory

## Current state

The functional upgrade is implemented as a React + TypeScript + Vite static frontend. The default surface remains the Command Center dashboard, now driven by a typed local data repository instead of hardcoded personal records.

Navigation surfaces implemented: Dashboard, Schedule, Syllabus, Tasks, Study, Goals, Analytics, Roadmap, Knowledge, and Settings. Tasks and goals support create, edit, delete, progress/completion updates, and persistence. Schedule blocks are initialized once from the user's provided weekly plan and are editable thereafter. Study supports countdown, pause/resume, reset, finish-and-log, and manual logging. Analytics derives counts from stored data. Settings supports validated JSON export/import.

## Design decisions

- Dark navy/indigo atmosphere with violet, cyan, amber, and rose status accents.
- Space Grotesk for display typography, Manrope for UI copy, DM Mono for system labels.
- CSS/SVG visualizations keep the static build fast and GitHub Pages compatible.
- Mobile navigation uses a compact top bar and fixed bottom nav; desktop uses a persistent sidebar.

## Functional architecture

- `client/src/services/storage.ts` owns the `CosmosData` model, defensive parsing, one-time schedule initialization, persistence, activity records, export, and import validation.
- `client/src/App.tsx` owns the UI surfaces and application services that update the repository state.
- System subjects are immutable application data based on Group B Semester 1; user data includes tasks, goals, schedule edits, sessions, activities, and settings.
- Storage currently uses one versioned `cosmos.data` envelope with a compatibility migration for the original `cosmos.tasks` key.

## Known next steps

1. Add IndexedDB behind the existing storage service for larger workspaces.
2. Add user-controlled knowledge notes and subject progress editing.
3. Add richer weekly review and backlog/I'm Behind mode.
4. Add a server boundary for auth, AI copilot, and Supabase sync.
