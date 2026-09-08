# COSMOS Development Guide

## Start here

Read `README.md`, `AGENTS.md`, and `MEMORY.md` before making a product change. Run the app locally before editing so visual regressions can be compared against the current command center.

```bash
pnpm install
pnpm dev
```

## Implementation workflow

1. Identify the product surface and the user action it should enable.
2. Keep the desktop and mobile information hierarchy intentional rather than shrinking one layout into the other.
3. Reuse the established CSS variables and status colors.
4. Keep interactions keyboard reachable and provide visible focus states.
5. Persist user-created task state locally when the feature changes data.
6. Add empty, loading, and disabled states when a future capability is represented.
7. Run type checking and the production build.
8. Review desktop and mobile screenshots before committing.

## Validation checklist

- `pnpm check` passes without TypeScript errors.
- `pnpm build` completes successfully.
- No unintended horizontal scrolling at 320px, 375px, 390px, 414px, 768px, 1024px, and 1280px.
- Keyboard focus is visible for buttons, links, and form fields.
- `prefers-reduced-motion` disables non-essential animation.
- Task creation and completion still work after a refresh.
- Modal close buttons and backdrop dismissal work.
- Orbit subject selection opens a useful detail state.
- The GitHub Pages artifact is emitted at `dist/public`.

## Troubleshooting

### GitHub Actions fails at dependency setup

The repository uses `pnpm-lock.yaml`. The Pages workflow must install pnpm before running `pnpm install --frozen-lockfile`; do not configure `actions/setup-node` with `cache: npm` unless a `package-lock.json` exists.

### A task appears to reset

Check the browser's local storage key `cosmos.tasks`. Avoid changing the stored task shape without a migration. Browser-private sessions may clear storage between runs.

### A page looks too dense on mobile

Start with the 390px screenshot. Prefer stacking panels, hiding secondary metadata, and preserving the primary action over reducing typography below readable sizes.

### A new visual asset is needed

Prefer CSS/SVG for small diagrams and UI visuals. Avoid putting large media files in `client/public`; use the project's managed asset workflow when a real image is essential.

## Commit guidance

Use focused commit messages, for example:

- `Build COSMOS academic operating system V1`
- `Fix Pages workflow pnpm setup`
- `Add indexed task storage migration`

Before pushing to `main`, ensure the working tree is clean and the release notes accurately describe what shipped.
