export type Priority = "High" | "Medium" | "Low";
export type GoalCategory = "Academic" | "Career" | "Personal" | "Skill";
export type ScheduleCategory = "Routine" | "College" | "Study" | "Learning" | "Practice" | "Rest";

export type Task = {
  id: string; title: string; description: string; subject: string; dueDate: string; dueTime: string;
  priority: Priority; completed: boolean; createdAt: string; updatedAt: string;
};
export type Goal = {
  id: string; title: string; description: string; category: GoalCategory; deadline: string;
  progress: number; createdAt: string; updatedAt: string;
};
export type ScheduleBlock = {
  id: string; day: string; start: string; end: string; title: string; category: ScheduleCategory; description: string;
};
export type StudySession = { id: string; startedAt: string; completedAt: string; minutes: number; title: string };
export type Activity = { id: string; text: string; createdAt: string; tone: "green" | "amber" | "violet" | "cyan" };
export type Subject = { code: string; name: string; progress: number; next: string; color: string; group: string };
export type CosmosData = { version: 2; tasks: Task[]; goals: Goal[]; schedule: ScheduleBlock[]; sessions: StudySession[]; activities: Activity[]; subjects: Subject[]; settings: Record<string, unknown>; roadmapProgress: Record<string, number> };

const PREFIX = "cosmos.";
const now = () => new Date().toISOString();
export const id = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const systemSubjects: Subject[] = [
  { code: "BT201", name: "Engineering Physics", progress: 0, next: "Quantum mechanics", color: "violet", group: "GROUP B · SEMESTER 1" },
  { code: "BT102", name: "Mathematics-I", progress: 0, next: "Calculus", color: "cyan", group: "GROUP B · SEMESTER 1" },
  { code: "BT203", name: "Basic Mechanical Engineering", progress: 0, next: "Materials", color: "amber", group: "GROUP B · SEMESTER 1" },
  { code: "BT204", name: "Basic Civil Engineering & Mechanics", progress: 0, next: "Materials", color: "rose", group: "GROUP B · SEMESTER 1" },
  { code: "BT205", name: "Basic Computer Engineering", progress: 0, next: "Computer fundamentals", color: "violet", group: "GROUP B · SEMESTER 1" },
  { code: "BT206", name: "Language Lab & Seminars", progress: 0, next: "Communication practice", color: "cyan", group: "GROUP B · SEMESTER 1" },
  { code: "BT107", name: "Internship-I", progress: 0, next: "Orientation", color: "amber", group: "GROUP B · SEMESTER 1" },
];

const weekdayBlocks = [
  ["06:30", "06:30", "Wake up", "Routine"], ["07:00", "07:30", "Breakfast", "Routine"], ["07:30", "07:50", "Quick review", "Study"],
  ["08:00", "17:00", "College hours", "College"], ["17:00", "17:30", "Lunch + Rest + Phone / Play / Chill", "Rest"], ["17:30", "18:00", "Reset + Snack", "Routine"],
  ["18:00", "19:15", "College Study", "Study"], ["19:15", "19:30", "Break", "Rest"], ["19:30", "20:30", "Online Skill Learning", "Learning"],
  ["20:30", "21:00", "Dinner", "Rest"], ["21:00", "22:00", "Practice", "Practice"], ["22:00", "22:15", "Break", "Rest"],
  ["22:15", "23:15", "Assignments / Revision", "Study"], ["23:15", "23:30", "Wind down", "Rest"], ["23:30", "23:59", "Sleep", "Routine"],
] as const;
const rotation: Record<string, string> = { Monday: "C / C++", Tuesday: "C / C++", Wednesday: "C / C++", Thursday: "Web Development", Friday: "C / C++", Saturday: "Web Development", Sunday: "Python → AI / ML" };
export const defaultSchedule = (): ScheduleBlock[] => {
  const result: ScheduleBlock[] = [];
  ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].forEach(day => weekdayBlocks.forEach(([start, end, title, category]) => result.push({ id: id(), day, start, end, title, category: category as ScheduleCategory, description: day === "Monday" && title === "Online Skill Learning" ? rotation[day] : "" })));
  const weekend: Record<string, [string, string, string, ScheduleCategory][]> = {
    Saturday: [["08:00", "10:00", "C / C++ Learning", "Learning"], ["10:30", "12:00", "Coding Practice", "Practice"], ["15:30", "17:00", "Difficult College Topic", "Study"], ["18:00", "19:30", "Web Development", "Learning"], ["21:00", "22:30", "Web Development Practice", "Practice"], ["23:30", "23:59", "Sleep", "Routine"]],
    Sunday: [["08:00", "10:00", "Python → AI / ML", "Learning"], ["10:30", "12:00", "Python Practice", "Practice"], ["15:30", "17:00", "College Weekly Revision", "Study"], ["18:00", "19:00", "Assignments", "Study"], ["19:00", "20:00", "Weekly Review + Next Week Planning", "Study"], ["21:00", "22:00", "Light Coding / Revision", "Practice"], ["23:30", "23:59", "Sleep", "Routine"]],
  };
  Object.entries(weekend).forEach(([day, blocks]) => blocks.forEach(([start, end, title, category]) => result.push({ id: id(), day, start, end, title, category, description: rotation[day] })));
  return result;
};

const safeParse = <T,>(key: string, fallback: T): T => { try { const raw = localStorage.getItem(PREFIX + key); return raw ? JSON.parse(raw) as T : fallback; } catch { return fallback; } };
const save = <T,>(key: string, value: T) => { try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch { /* private mode or quota; app remains usable */ } };
export const emptyData = (): CosmosData => ({ version: 2, tasks: [], goals: [], schedule: defaultSchedule(), sessions: [], activities: [], subjects: systemSubjects, settings: {}, roadmapProgress: {} });
export const loadData = (): CosmosData => {
  const seed = emptyData();
  const saved = safeParse<Partial<CosmosData> | null>("data", null);
  if (saved && saved.version) return { ...seed, ...saved, subjects: systemSubjects };
  const legacyTasks = safeParse<unknown>("tasks", []);
  const tasks = Array.isArray(legacyTasks) ? legacyTasks.filter(Boolean).map((t: any): Task => ({ id: String(t.id ?? id()), title: String(t.title ?? "Untitled task"), description: String(t.description ?? ""), subject: String(t.subject ?? t.course ?? ""), dueDate: String(t.dueDate ?? ""), dueTime: String(t.dueTime ?? ""), priority: ["High", "Medium", "Low"].includes(t.priority) ? t.priority : "Medium", completed: Boolean(t.completed ?? t.done), createdAt: String(t.createdAt ?? now()), updatedAt: now() })) : [];
  const data = { ...seed, tasks, schedule: safeParse("schedule", seed.schedule), goals: safeParse("goals", []), sessions: safeParse("sessions", []), activities: safeParse("activities", []) };
  save("data", data); return data;
};
export const saveData = (data: CosmosData) => save("data", data);
export const addActivity = (data: CosmosData, text: string, tone: Activity["tone"] = "violet"): CosmosData => ({ ...data, activities: [{ id: id(), text, tone, createdAt: now() }, ...data.activities].slice(0, 30) });
export const exportData = (data: CosmosData) => JSON.stringify({ ...data, exportedAt: now(), app: "COSMOS" }, null, 2);
export const validateImport = (value: unknown): value is CosmosData => { const x = value as CosmosData; return Boolean(x && typeof x === "object" && Array.isArray(x.tasks) && Array.isArray(x.goals) && Array.isArray(x.schedule) && Array.isArray(x.sessions)); };
