# COSMOS

## Your Personal Academic Operating System

COSMOS is a premium, offline-first academic command center for planning, studying, and building momentum. It treats an academic life as an interconnected universe: schedules, tasks, syllabus progress, study sessions, goals, roadmaps, and reflection all live in one calm command center.

> **Project status:** V1 is a polished frontend release with local task persistence and responsive desktop/mobile experiences. Cloud synchronization, authentication, AI assistance, and Supabase remain planned extension points rather than V1 requirements.

## What is included in V1

The current release includes a desktop sidebar, mobile top bar, and mobile bottom navigation; a command-center dashboard with progress signals; a CSS/SVG study orbit with selectable subject nodes; a 16-week semester journey; today's priorities and schedule; a local task manager with create and complete flows; a focus-session modal; syllabus and subject progress; goals; analytics; coding and AI/ML roadmaps; a knowledge base; settings; and GitHub Pages deployment automation.

The app is intentionally designed to feel like a serious productivity system rather than a generic student dashboard. The visual language combines deep navy surfaces, restrained violet/cyan/amber accents, subtle orbital geometry, system labels, and accessible contrast.

## Features at a glance

| Area | V1 behavior |
| --- | --- |
| Command center | Progress, focus time, task completion, momentum, orbit, journey, schedule, and activity |
| Tasks | Add tasks, toggle completion, view priority queue, and persist tasks in the browser |
| Study | Launch a 25-minute focus-session flow and review weekly focus history |
| Syllabus | Track progress across subjects and inspect the next module |
| Schedule | Review a daily schedule and weekly plan surface |
| Goals | Track progress toward academic, career, and personal outcomes |
| Analytics | Review focus hours, consistency, subject effort, and system insights |
| Roadmap | Organize full-stack, Python/AI-ML, and backlog directions |
| Knowledge | Browse notes and saved ideas in a second-brain surface |
| Responsive UX | Dedicated sidebar, compact mobile header, stacked cards, and fixed mobile navigation |
| Offline-first | Task data is saved to `localStorage` under `cosmos.tasks` |

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
│       ├── App.tsx                # Routes, product surfaces, state, and local model
│       ├── index.css              # COSMOS visual system and responsive layout
│       ├── components/            # Shared template and UI primitives
│       ├── contexts/              # Theme/runtime contexts from the scaffold
│       └── pages/                 # Template page entry points
├── server/                        # Template-compatible static server entry
├── shared/                        # Template-compatible shared constants
├── AGENTS.md                      # Operating manual for future agents
├── MEMORY.md                      # Durable project state and next steps
└── README.md                      # This document
```

## Data and privacy

V1 stores task state locally in the current browser. Nothing is sent to a server by the COSMOS frontend. Clearing browser storage removes local task state, so export/import and schema-versioned IndexedDB are planned follow-ups before introducing richer personal data.

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

The repository's Pages settings must have GitHub Actions selected as the deployment source. If the project is served from a repository subpath, set the Vite base path before publishing.

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

## License

No license has been selected yet. Add a license before distributing COSMOS beyond the repository owner.
