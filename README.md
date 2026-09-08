# COSMOS

## Your Personal Academic Operating System

COSMOS is a premium, offline-first academic command center for planning, studying, and building momentum. It treats an academic life as an interconnected universe: schedules, tasks, syllabus progress, study sessions, goals, roadmaps, and reflection all live in one calm command center.

> **Project status:** COSMOS is a responsive, offline-first academic operating system with user-controlled tasks, goals, schedule blocks, study sessions, analytics, and JSON backup. Cloud synchronization, authentication, AI assistance, and Supabase remain planned extension points rather than V1 requirements.

## What is included in V1

The current release includes a desktop sidebar, mobile top bar, and mobile bottom navigation; a command-center dashboard with data-derived progress signals; a CSS/SVG study orbit with selectable Group B Semester 1 subjects; a 16-week academic journey; the user's planned Monday–Sunday schedule; full task CRUD; full goal CRUD with progress control; a functional focus timer and manual study logging; syllabus; analytics; learning rotation roadmap; settings; validated JSON import/export; and GitHub Pages deployment automation.

The app is intentionally designed to feel like a serious productivity system rather than a generic student dashboard. The visual language combines deep navy surfaces, restrained violet/cyan/amber accents, subtle orbital geometry, system labels, and accessible contrast.

## Features at a glance

| Area | V1 behavior |
| --- | --- |
| Command center | Progress, focus time, task completion, momentum, orbit, journey, schedule, and activity |
| Tasks | Add, edit, delete, complete, reopen, prioritize, subject-tag, schedule, and persist tasks in the browser |
| Study | Start, pause, resume, reset, finish, log, and persist focus sessions |
| Syllabus | Track progress across subjects and inspect the next module |
| Schedule | Browse Monday–Sunday, edit the planned schedule, add blocks, and delete blocks |
| Goals | Create, edit, delete, categorize, deadline, and manually update goal progress |
| Analytics | Derive task, goal, subject, and study metrics from stored user data |
| Roadmap | Organize full-stack, Python/AI-ML, and backlog directions |
| Knowledge | Browse notes and saved ideas in a second-brain surface |
| Responsive UX | Dedicated sidebar, compact mobile header, stacked cards, and fixed mobile navigation |
| Offline-first | Versioned workspace data is saved locally under `cosmos.data` |
| Backup | Export and validate/import workspace JSON from Settings |

## Technology

- React 19 and TypeScript
- Vite 7
- Tailwind CSS 4 alongside a product-specific CSS design system
- Lucide React icons
- Wouter-compatible static project structure
- CSS and inline SVG visualization primitives for the orbit, charts, and progress rings
- GitHub Actions and GitHub Pages for static deployment

## Local development

Requirements: Node.js 22 or newer and pnpm 10.

```bash
pnpm install
pnpm dev
```

The Vite development server will print the local URL. The app is client-only and does not require an API key, database, or external service for the V1 experience.

## Quality checks

Run the same checks used before release:

```bash
pnpm check
pnpm build
```

`pnpm check` runs TypeScript validation. `pnpm build` creates the production frontend and bundles the static-compatible server entry supplied by the project template. The build currently emits a bundle-size advisory from Vite; it is informational and does not block a successful build.

For responsive review, inspect at least 390px, 768px, 1024px, and 1280px widths. The main mobile navigation is intended for 320px and wider.

## Project structure

```text
COSMOS/
├── .github/workflows/deploy.yml   # GitHub Pages build and deployment
├── client/
│   ├── index.html                 # App shell and metadata
│   └── src/
│       ├── App.tsx                # Routes, product surfaces, state, and actions
│       ├── services/storage.ts     # Typed repository, initialization, import/export
│       ├── index.css              # COSMOS visual system and responsive layout
│       ├── components/            # Shared template and UI primitives
│       ├── contexts/              # Theme/runtime contexts from the scaffold
│       └── pages/                 # Template-compatible page entry points
├── server/                        # Template-compatible static server entry
├── shared/                        # Template-compatible shared constants
├── AGENTS.md                      # Operating manual for future agents
├── MEMORY.md                      # Durable project state and next steps
├── docs/                          # Architecture, development, roadmap, and release notes
└── README.md                      # This document
```

## Data and privacy

COSMOS stores its workspace locally in the current browser under a versioned `cosmos.data` record. Nothing is sent to a server by the frontend. Clearing browser storage removes local data, so use Settings → Export workspace for backup. Import validates the JSON structure and asks for confirmation before replacing current data.

The intended future architecture is:

1. Keep the current UI and domain model stable.
2. Move durable entities into versioned IndexedDB for richer offline behavior.
3. Add optional authentication and Supabase synchronization behind a server boundary.
4. Add an AI copilot that can reason over user-approved academic data without putting credentials in frontend code.

## GitHub Pages

The repository contains `.github/workflows/deploy.yml`. A push to `main` runs:

1. Checkout.
2. Node 22 and pnpm 10 setup.
3. Frozen-lockfile dependency installation.
4. Production build.
5. Pages artifact upload.
6. GitHub Pages deployment.

The repository's Pages settings must have GitHub Actions selected as the deployment source. The Vite configuration automatically uses `/COSMOS/` for GitHub Actions builds and `/` for local development, so the repository subpath is handled by the deployment build.

## Release process

Use annotated semantic tags and GitHub releases:

```bash
git checkout main
git pull --ff-only
git tag -a v1.0.0 -m "COSMOS V1.0.0"
git push origin v1.0.0
gh release create v1.0.0 --title "COSMOS V1.0.0" --generate-notes
```

Before releasing, run `pnpm check`, `pnpm build`, inspect the Actions run, and confirm the repository is clean.

## Documentation map

- [`AGENTS.md`](./AGENTS.md) — rules and conventions for agents continuing the project.
- [`MEMORY.md`](./MEMORY.md) — current implementation state and prioritized next steps.
- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — product layers, state boundaries, and future cloud seams.
- [`docs/DEVELOPMENT.md`](./docs/DEVELOPMENT.md) — implementation workflow, QA checklist, and troubleshooting.
- [`docs/ROADMAP.md`](./docs/ROADMAP.md) — post-V1 roadmap and release themes.
- [`docs/RELEASE_NOTES_V1.0.0.md`](./docs/RELEASE_NOTES_V1.0.0.md) — detailed V1.0.0 feature and validation notes.

## License

No license has been selected yet. Add a license before distributing COSMOS beyond the repository owner.


## Dynamic Solar System environment

COSMOS now includes a persistent, decorative React Three Fiber Solar System environment mounted behind the application shell. The scene is a single long-lived canvas containing the Sun, eight stylized planets, orbit paths, a star field, Sparkles dust, Saturn's rings, subtle lighting, camera depth, and pointer parallax. It is not a static image and is never recreated when the user changes views.

The section-to-planet mapping is centralized in `client/src/components/SpatialCore.tsx`: Dashboard focuses the Sun, Tasks and Syllabus focus the inner planets, Goals focuses Jupiter, Schedule focuses Saturn, Roadmap travels toward Neptune, Analytics widens the camera, Profile focuses Uranus, and Settings settles into a slower deep-space view. `SolarSystemBackground` interpolates camera position, target, and scene rotation on section changes. It dims when a modal is open, uses a simpler particle budget on small screens, and respects `prefers-reduced-motion`.

The existing dashboard `SpatialCore` remains available as the interactive command-center map; the new global environment extends that architecture rather than adding a second product routing system. Future section positions and visual emphasis can be adjusted through the `sectionStates` configuration and `planetData` in `SpatialCore.tsx`.
