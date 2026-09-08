# COSMOS Project Memory

## Current state

V1 is implemented as a React + TypeScript + Vite static frontend. The default surface is the Command Center dashboard with a cosmic orbit visualization, semester journey, progress stat cards, task queue, schedule, activity timeline, and quick actions.

Navigation surfaces implemented: Dashboard, Schedule, Syllabus, Tasks, Study, Goals, Analytics, Roadmap, Knowledge, and Settings. The task flow supports local task creation, completion toggles, and browser persistence. Study flow opens a focus-session modal. Orbit subject nodes open subject detail drawers.

## Design decisions

- Dark navy/indigo atmosphere with violet, cyan, amber, and rose status accents.
- Space Grotesk for display typography, Manrope for UI copy, DM Mono for system labels.
- CSS/SVG visualizations keep the static build fast and GitHub Pages compatible.
- Mobile navigation uses a compact top bar and fixed bottom nav; desktop uses a persistent sidebar.

## Known next steps

1. Add schema-versioned IndexedDB storage and import/export.
2. Add a true calendar model and richer task editing.
3. Add weekly review and backlog/I'm Behind mode.
4. Add a server boundary for auth, AI copilot, and Supabase sync.
5. Configure repository Pages deployment workflow after the first repository push.
