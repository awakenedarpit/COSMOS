# COSMOS Agent Operating Manual

## Product
COSMOS is a premium, offline-first academic operating system. Preserve the cosmic dark visual language, the information hierarchy, and the principle that academic planning is one interconnected universe.

## Working rules

1. Read `README.md`, `MEMORY.md`, and this file before changing the product.
2. Prefer small, composable React components and CSS variables in `client/src/index.css`.
3. Keep the app usable without a backend. Local persistence is a feature, not a fallback.
4. Treat mobile as a first-class experience: test the 320px–414px range and do not introduce horizontal overflow.
5. Keep interaction motion subtle and respect `prefers-reduced-motion`.
6. Do not place secrets in frontend code. Future cloud/AI integrations belong behind a server boundary.
7. Validate with `pnpm check` and `pnpm build` before committing.

## Product seams

- `client/src/App.tsx` contains the current product surfaces and application actions.
- `client/src/services/storage.ts` contains the typed local repository, safe initialization, activity records, export, and import validation.
- `client/src/index.css` contains the design system and responsive layout.
- `localStorage` currently stores one versioned `cosmos.data` envelope; future IndexedDB/Supabase implementations should preserve the repository contract.
- The app is intentionally prepared for future Supabase/auth/AI integration but does not require those services in V1.

## Data rules

- Never recreate user tasks, goals, or edited schedule blocks on render or every load.
- System subjects may be seeded because they are application academic-plan data; personal records must be explicitly created by the user.
- Every mutation must update state, persist through the storage service, and create a real activity record when appropriate.
- Import must validate before replacement and must require confirmation for destructive replacement.
