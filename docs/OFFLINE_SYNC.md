# COSMOS Local-First Sync

COSMOS now treats the browser as a **local cache and pending-change queue**, while keeping the UI independent from the eventual cloud provider.

## Current behavior

Every workspace snapshot is persisted to the existing `cosmos.data` local storage record and coalesced into one pending `snapshot` operation under `cosmos.sync.queue`. The queue stores the latest complete workspace state, a stable operation identifier, timestamps, and an attempt count. This prevents rapid edits from creating an unbounded queue while preserving the latest user state for a future upload adapter.

The top bar exposes the local state through a subtle indicator: `Local queue`, `Synced`, `Offline`, `Syncing`, or `Sync error`. Browser `online` and `offline` events update this indicator without interrupting task, goal, schedule, profile, study, or roadmap workflows. No passwords or authentication credentials are stored by this layer.

## Future Supabase adapter

When authentication and Supabase are enabled, the queue becomes the hand-off boundary between the UI and the cloud repository:

1. Read the authenticated user’s records from Supabase into the local snapshot.
2. Apply local mutations immediately and enqueue the resulting snapshot.
3. Upload the pending operation with the authenticated `user_id`.
4. Subscribe to user-scoped Realtime changes and merge newer records.
5. Clear the queue only after the cloud write is confirmed.
6. Use `updatedAt` timestamps and a documented latest-valid-update-wins strategy for conflicts.

The current queue deliberately does not pretend to be cloud sync. It provides durable local behavior and a safe seam for the authenticated repository to be added next.

## Data safety

Import/export continues to operate on the current workspace snapshot. Queue writes are defensive: private browsing, unavailable storage, or quota errors do not prevent the application UI from remaining usable. Genuine local data should be migrated only after authentication identifies its owner; hardcoded system subjects and roadmap definitions remain shared, read-only content.
