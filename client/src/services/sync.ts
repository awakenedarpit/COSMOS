import type { CosmosData } from "./storage";

export type SyncState = "local" | "syncing" | "synced" | "offline" | "error";
export type SyncOperation = { id: string; kind: "snapshot"; payload: CosmosData; createdAt: string; updatedAt: string; attempts: number };

const QUEUE_KEY = "cosmos.sync.queue";
const META_KEY = "cosmos.sync.meta";
const listeners = new Set<() => void>();
const emit = () => listeners.forEach(listener => listener());
const readQueue = (): SyncOperation[] => { try { const raw = localStorage.getItem(QUEUE_KEY); return raw ? JSON.parse(raw) as SyncOperation[] : []; } catch { return []; } };
const writeQueue = (queue: SyncOperation[]) => { try { localStorage.setItem(QUEUE_KEY, JSON.stringify(queue)); } catch { /* Keep the UI usable in private browsing. */ } emit(); };
const readMeta = (): { state: SyncState; lastSyncedAt?: string; error?: string } => { try { const raw = localStorage.getItem(META_KEY); return raw ? JSON.parse(raw) : { state: navigator.onLine ? "local" : "offline" }; } catch { return { state: "local" }; } };
const writeMeta = (meta: { state: SyncState; lastSyncedAt?: string; error?: string }) => { try { localStorage.setItem(META_KEY, JSON.stringify(meta)); } catch { /* no-op */ } emit(); };

export const enqueueSnapshot = (payload: CosmosData) => {
  const queue = readQueue();
  const operation: SyncOperation = { id: queue[0]?.id ?? `${Date.now().toString(36)}-snapshot`, kind: "snapshot", payload, createdAt: queue[0]?.createdAt ?? new Date().toISOString(), updatedAt: new Date().toISOString(), attempts: queue[0]?.attempts ?? 0 };
  writeQueue([operation]);
  writeMeta({ ...readMeta(), state: navigator.onLine ? "local" : "offline" });
};
export const getPendingCount = () => readQueue().length;
export const getSyncMeta = () => readMeta();
export const subscribeSync = (listener: () => void) => { listeners.add(listener); return () => listeners.delete(listener); };
export const markSyncing = () => writeMeta({ ...readMeta(), state: "syncing", error: undefined });
export const markSynced = () => { writeQueue([]); writeMeta({ state: "synced", lastSyncedAt: new Date().toISOString() }); };
export const markSyncError = (error: string) => { const queue = readQueue(); if (queue[0]) writeQueue([{ ...queue[0], attempts: queue[0].attempts + 1 }]); writeMeta({ ...readMeta(), state: "error", error }); };
export const clearSyncQueue = () => { writeQueue([]); writeMeta({ state: navigator.onLine ? "local" : "offline" }); };
export const installSyncListeners = () => { const online = () => writeMeta({ ...readMeta(), state: getPendingCount() ? "local" : "synced" }); const offline = () => writeMeta({ ...readMeta(), state: "offline" }); window.addEventListener("online", online); window.addEventListener("offline", offline); return () => { window.removeEventListener("online", online); window.removeEventListener("offline", offline); }; };
