# COSMOS

**Your Personal Academic Operating System.**

COSMOS is an offline-first academic command center for planning, studying, and building momentum. The current V1 focuses on a polished dashboard experience with schedule, syllabus progress, task management, study sessions, goals, analytics, roadmap, knowledge base, and settings surfaces.

## Run locally

```bash
pnpm install
pnpm dev
```

## Validate

```bash
pnpm check
pnpm build
```

## Product notes

- Tasks are persisted to `localStorage` under `cosmos.tasks`.
- Navigation is fully client-side and responsive from 320px upward.
- The visual system uses a dark cosmic palette, restrained glow, deep surfaces, and CSS/SVG visualizations rather than heavy media assets.
- Cloud synchronization, auth, AI, and Supabase remain intentionally future-ready seams for a later release.

## Deployment

The app is a Vite static frontend and can be served by GitHub Pages or any static host. Configure the Vite base path for a project subpath if deploying to a repository-owned Pages URL.
