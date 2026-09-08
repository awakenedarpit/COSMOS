import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Bell,
  BookOpen,
  BrainCircuit,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  Code2,
  Command,
  Compass,
  Database,
  Flame,
  FolderKanban,
  Gauge,
  GraduationCap,
  LayoutDashboard,
  ListChecks,
  Menu,
  Moon,
  MoreHorizontal,
  Orbit,
  Plus,
  Rocket,
  Search,
  Settings2,
  Sparkles,
  Target,
  Timer,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type View = "Dashboard" | "Schedule" | "Syllabus" | "Tasks" | "Study" | "Goals" | "Analytics" | "Roadmap" | "Knowledge" | "Settings";
type Task = { id: number; title: string; course: string; due: string; label: "Today" | "Tomorrow" | "This week"; priority: "High" | "Medium" | "Low"; done: boolean };

type NavItem = { label: View; icon: LucideIcon; section?: string };

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Schedule", icon: CalendarDays },
  { label: "Syllabus", icon: BookOpen },
  { label: "Tasks", icon: ListChecks },
  { label: "Study", icon: Timer },
  { label: "Goals", icon: Target, section: "ORBIT" },
  { label: "Analytics", icon: BarChart3 },
  { label: "Roadmap", icon: Compass },
  { label: "Knowledge", icon: BrainCircuit, section: "SYSTEM" },
  { label: "Settings", icon: Settings2 },
];

const subjects = [
  { name: "Mathematics I", code: "MATH 101", progress: 72, next: "Vector spaces", color: "violet", orbit: "orbit-one" },
  { name: "Data Structures", code: "CSE 204", progress: 58, next: "Graph algorithms", color: "cyan", orbit: "orbit-two" },
  { name: "Digital Logic", code: "ECE 202", progress: 84, next: "Sequential circuits", color: "amber", orbit: "orbit-three" },
  { name: "Communication Skills", code: "HSS 110", progress: 46, next: "Technical writing", color: "rose", orbit: "orbit-four" },
];

const initialTasks: Task[] = [
  { id: 1, title: "Complete eigenvalues problem set", course: "Mathematics I", due: "Today · 6:00 PM", label: "Today", priority: "High", done: false },
  { id: 2, title: "Review graph traversal notes", course: "Data Structures", due: "Today · 9:00 PM", label: "Today", priority: "Medium", done: false },
  { id: 3, title: "Submit lab report: Flip-flops", course: "Digital Logic", due: "Tomorrow · 11:59 PM", label: "Tomorrow", priority: "High", done: false },
  { id: 4, title: "Read chapter 4 — Technical writing", course: "Communication Skills", due: "Friday · 8:00 PM", label: "This week", priority: "Low", done: true },
];

const schedule = [
  { time: "09:00", meridiem: "AM", title: "Data Structures", meta: "Room 304 · Prof. Mehta", color: "cyan", active: false },
  { time: "11:30", meridiem: "AM", title: "Independent study", meta: "Library · 90 minutes", color: "violet", active: true },
  { time: "02:00", meridiem: "PM", title: "Digital Logic Lab", meta: "Lab 2 · Group B", color: "amber", active: false },
  { time: "04:30", meridiem: "PM", title: "Mathematics I", meta: "Lecture hall 1", color: "rose", active: false },
];

const activity = [
  { icon: Check, text: "Finished 25 min focus session", time: "12 min ago", tone: "green" },
  { icon: BookOpen, text: "Updated Digital Logic syllabus", time: "Yesterday", tone: "amber" },
  { icon: Target, text: "New goal created: Ship portfolio", time: "Yesterday", tone: "violet" },
];

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand ${compact ? "brand-compact" : ""}`}>
      <div className="brand-mark" aria-hidden="true"><Orbit size={22} strokeWidth={1.7} /><span /></div>
      {!compact && <div><div className="brand-name">COSMOS</div><div className="brand-tag">ACADEMIC OS</div></div>}
    </div>
  );
}

function IconButton({ label, children, onClick, className = "" }: { label: string; children: React.ReactNode; onClick?: () => void; className?: string }) {
  return <button className={`icon-button ${className}`} aria-label={label} title={label} onClick={onClick}>{children}</button>;
}

function Sidebar({ active, setActive, mobileOpen, setMobileOpen }: { active: View; setActive: (view: View) => void; mobileOpen: boolean; setMobileOpen: (value: boolean) => void }) {
  return <>
    <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
      <div className="sidebar-top"><Logo /><IconButton label="Close navigation" className="mobile-close" onClick={() => setMobileOpen(false)}><X size={18} /></IconButton></div>
      <div className="workspace-switcher"><div className="workspace-avatar">A</div><div className="workspace-copy"><strong>Arpit's workspace</strong><span>Semester 4 · 2025/26</span></div><ChevronDown size={15} className="muted-icon" /></div>
      <nav className="main-nav" aria-label="Primary navigation">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          return <div key={item.label}>
            {item.section && <div className="nav-section-label">{item.section}</div>}
            <button className={`nav-item ${active === item.label ? "active" : ""}`} onClick={() => { setActive(item.label); setMobileOpen(false); }}>
              <Icon size={17} strokeWidth={active === item.label ? 2.2 : 1.8} /><span>{item.label}</span>{active === item.label && <span className="active-pip" />}
              {index === 3 && <span className="nav-count">4</span>}
            </button>
          </div>;
        })}
      </nav>
      <div className="sidebar-bottom">
        <div className="storage-card"><div className="storage-title"><Database size={14} /> Local workspace <span>100%</span></div><div className="storage-bar"><span /></div><p>Everything is saved on this device.</p></div>
        <button className="profile-button"><div className="profile-avatar">AS</div><div className="profile-copy"><strong>Arpit Singh</strong><span>Focus mode: on</span></div><MoreHorizontal size={17} /></button>
      </div>
    </aside>
    {mobileOpen && <button className="sidebar-scrim" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
  </>;
}

function Topbar({ onMenu, onQuickAdd }: { onMenu: () => void; onQuickAdd: () => void }) {
  return <header className="topbar">
    <div className="mobile-brand"><IconButton label="Open navigation" onClick={onMenu}><Menu size={21} /></IconButton><Logo compact /></div>
    <div className="breadcrumb"><span>Command center</span><ChevronRight size={14} /><strong>Overview</strong></div>
    <div className="topbar-actions"><button className="search-trigger"><Search size={16} /><span>Search anything</span><kbd>⌘ K</kbd></button><IconButton label="Notifications"><Bell size={18} /></IconButton><button className="add-button" onClick={onQuickAdd}><Plus size={17} /><span>Quick add</span></button></div>
  </header>;
}

function SectionHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: React.ReactNode }) {
  return <div className="section-header"><div><div className="eyebrow">{eyebrow}</div><h2>{title}</h2>{description && <p>{description}</p>}</div>{action}</div>;
}

function ProgressRing({ value, size = 72, stroke = 6, color = "#a78bfa" }: { value: number; size?: number; stroke?: number; color?: string }) {
  const radius = (size - stroke) / 2;
  const circumference = radius * Math.PI * 2;
  return <div className="progress-ring" style={{ width: size, height: size }}><svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}><circle className="ring-track" strokeWidth={stroke} cx={size / 2} cy={size / 2} r={radius} /><circle className="ring-value" stroke={color} strokeWidth={stroke} strokeDasharray={`${circumference} ${circumference}`} strokeDashoffset={circumference - (value / 100) * circumference} cx={size / 2} cy={size / 2} r={radius} /></svg><strong>{value}%</strong></div>;
}

function StatCard({ icon: Icon, label, value, detail, tone, trend }: { icon: LucideIcon; label: string; value: string; detail: string; tone: string; trend?: string }) {
  return <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={17} /></div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-detail">{trend && <span className="trend">{trend}</span>}{detail}</div></div>;
}

function OrbitPanel({ onSelect }: { onSelect: (subject: typeof subjects[number]) => void }) {
  const [rotating, setRotating] = useState(true);
  return <section className="panel orbit-panel">
    <div className="panel-header"><div><div className="eyebrow">LIVE SYSTEM MAP</div><h3>Study orbit</h3></div><div className="panel-actions"><button className={`mini-toggle ${rotating ? "selected" : ""}`} onClick={() => setRotating(!rotating)}><Activity size={14} /> {rotating ? "Auto rotate" : "Paused"}</button><IconButton label="Open full study orbit"><ArrowUpRight size={16} /></IconButton></div></div>
    <div className={`orbit-stage ${rotating ? "is-rotating" : ""}`}>
      <div className="orbit-stars" />
      <div className="orbit-line orbit-line-a" /><div className="orbit-line orbit-line-b" /><div className="orbit-line orbit-line-c" />
      <div className="orbit-core"><div className="core-glow" /><div className="core-inner"><Orbit size={28} /><span>COSMOS</span><small>YOUR UNIVERSE</small></div></div>
      {subjects.map((subject, index) => <button key={subject.code} className={`orbit-node node-${index + 1}`} onClick={() => onSelect(subject)} aria-label={`View ${subject.name}`}><span className={`node-dot ${subject.color}`}><span /></span><span className="node-label"><strong>{subject.name}</strong><small>{subject.progress}% complete</small></span></button>)}
      <div className="orbit-caption"><span className="live-dot" /> synced locally · 2 min ago</div>
    </div>
    <div className="orbit-legend"><span><i className="legend-dot violet" /> Subjects</span><span><i className="legend-dot cyan" /> Focus time</span><span><i className="legend-dot amber" /> Milestones</span></div>
  </section>;
}

function JourneyPanel() {
  const weeks = Array.from({ length: 16 }, (_, i) => ({ week: i + 1, state: i < 7 ? "done" : i === 7 ? "current" : "upcoming" }));
  return <section className="panel journey-panel"><div className="panel-header"><div><div className="eyebrow">SEMESTER 04 / 16</div><h3>Semester journey</h3></div><button className="text-button">View timeline <ArrowUpRight size={14} /></button></div><div className="journey-visual"><div className="journey-line"><span className="journey-progress" /></div><div className="week-grid">{weeks.map(({ week, state }) => <div key={week} className={`week ${state}`}><span>{String(week).padStart(2, "0")}</span><i /></div>)}</div><div className="journey-marker"><span className="marker-line" /><div><strong>Week 08 · Mid-semester</strong><small>Current focus: build momentum</small></div></div></div><div className="journey-footer"><div><span className="footer-key">NEXT MILESTONE</span><strong>Internal assessments</strong><span>in 12 days</span></div><div className="journey-score"><ProgressRing value={43} size={48} stroke={4} color="#67e8f9" /></div></div></section>;
}

function TaskRow({ task, onToggle }: { task: Task; onToggle: (id: number) => void }) {
  return <div className={`task-row ${task.done ? "done" : ""}`}><button className={`check-button ${task.done ? "checked" : ""}`} onClick={() => onToggle(task.id)} aria-label={task.done ? `Mark ${task.title} incomplete` : `Complete ${task.title}`}>{task.done && <Check size={13} />}</button><div className="task-main"><strong>{task.title}</strong><span>{task.course} <i>·</i> {task.due}</span></div><span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span><button className="task-more" aria-label="Task options"><MoreHorizontal size={16} /></button></div>;
}

function TasksPanel({ tasks, onToggle, onAdd }: { tasks: Task[]; onToggle: (id: number) => void; onAdd: () => void }) {
  return <section className="panel tasks-panel"><div className="panel-header"><div><div className="eyebrow">FOCUS QUEUE</div><h3>Today's priorities <span className="count-badge">{tasks.filter(t => !t.done).length}</span></h3></div><button className="text-button" onClick={onAdd}><Plus size={14} /> Add task</button></div><div className="task-list">{tasks.slice(0, 4).map(task => <TaskRow key={task.id} task={task} onToggle={onToggle} />)}</div><button className="panel-footer-link">Open task manager <ArrowUpRight size={14} /></button></section>;
}

function SchedulePanel() {
  return <section className="panel schedule-panel"><div className="panel-header"><div><div className="eyebrow">WEDNESDAY · 14 MAY</div><h3>Today's schedule</h3></div><button className="icon-button"><CalendarDays size={16} /></button></div><div className="schedule-list">{schedule.map(item => <div className={`schedule-row ${item.active ? "active" : ""}`} key={item.time}><div className="time"><strong>{item.time}</strong><span>{item.meridiem}</span></div><div className={`schedule-dot ${item.color}`} /><div className="schedule-copy"><strong>{item.title}</strong><span>{item.meta}</span></div>{item.active ? <span className="now-pill"><i /> NOW</span> : <MoreHorizontal size={15} className="schedule-more" />}</div>)}</div><button className="panel-footer-link">Open full schedule <ArrowUpRight size={14} /></button></section>;
}

function ActivityPanel() {
  return <section className="panel activity-panel"><div className="panel-header"><div><div className="eyebrow">TIMELINE</div><h3>Recent activity</h3></div><button className="icon-button"><MoreHorizontal size={16} /></button></div><div className="activity-list">{activity.map(item => { const Icon = item.icon; return <div className="activity-row" key={item.text}><div className={`activity-icon ${item.tone}`}><Icon size={15} /></div><div><strong>{item.text}</strong><span>{item.time}</span></div></div>; })}</div><button className="panel-footer-link">View activity log <ArrowUpRight size={14} /></button></section>;
}

function QuickActions({ onAdd, onStudy }: { onAdd: () => void; onStudy: () => void }) {
  const actions = [{ icon: Plus, label: "Add a task", click: onAdd }, { icon: Timer, label: "Start focus", click: onStudy }, { icon: BookOpen, label: "Log study time", click: onStudy }, { icon: Target, label: "Set a goal", click: () => undefined }];
  return <div className="quick-actions"><span className="eyebrow">QUICK ACTIONS</span>{actions.map(({ icon: Icon, label, click }) => <button key={label} onClick={click}><span><Icon size={15} /></span>{label}</button>)}</div>;
}

function Overview({ tasks, onToggle, onAdd, onStudy, onSelect }: { tasks: Task[]; onToggle: (id: number) => void; onAdd: () => void; onStudy: () => void; onSelect: (subject: typeof subjects[number]) => void }) {
  return <div className="page-content overview-page"><div className="hero-intro"><div><div className="eyebrow hero-eyebrow"><span className="live-dot" /> WEDNESDAY · MAY 14, 2025</div><h1>Welcome back, <em>Arpit.</em></h1><p>Your academic universe is always expanding.</p></div><div className="hero-meta"><div><span>SEMESTER</span><strong>04 <i>/ 08</i></strong></div><div className="meta-divider" /><div><span>STUDY STREAK</span><strong className="streak"><Flame size={17} /> 12 days</strong></div></div></div>
    <div className="stats-grid"><StatCard icon={Gauge} label="Overall progress" value="68.4%" detail="across 4 subjects" tone="violet" trend="+4.2% " /><StatCard icon={Clock3} label="Focused this week" value="11h 24m" detail="of 18h goal" tone="cyan" trend="+2h 10m " /><StatCard icon={ListChecks} label="Tasks completed" value="24 / 31" detail="this semester" tone="amber" trend="77% " /><StatCard icon={TrendingUp} label="Momentum" value="On track" detail="keep your rhythm" tone="rose" /> </div>
    <div className="content-grid top-grid"><OrbitPanel onSelect={onSelect} /><JourneyPanel /></div>
    <div className="content-grid lower-grid"><TasksPanel tasks={tasks} onToggle={onToggle} onAdd={onAdd} /><SchedulePanel /><ActivityPanel /></div>
    <QuickActions onAdd={onAdd} onStudy={onStudy} />
  </div>;
}

function ScheduleView() {
  return <div className="page-content generic-page"><SectionHeader eyebrow="WEEKLY PLAN" title="My schedule" description="A clear view of your classes, focus blocks, and open space." action={<button className="add-button"><Plus size={16} /> Add block</button>} /><div className="week-tabs"><button className="selected">Mon 12</button><button className="selected">Tue 13</button><button className="today">Wed 14 <i>Today</i></button><button>Thu 15</button><button>Fri 16</button><button>Sat 17</button><button>Sun 18</button></div><div className="schedule-board panel"><div className="board-note"><Sparkles size={16} /> Your next open focus window is today at 6:30 PM <button>Plan it <ArrowUpRight size={13} /></button></div>{schedule.map(item => <div className="board-row" key={item.time}><div className="board-time">{item.time}<span>{item.meridiem}</span></div><div className={`board-event ${item.color} ${item.active ? "current" : ""}`}><strong>{item.title}</strong><span>{item.meta}</span>{item.active && <i>In progress</i>}</div></div>)}</div></div>;
}

function SyllabusView() {
  return <div className="page-content generic-page"><SectionHeader eyebrow="COURSE MAP" title="Syllabus" description="Track every module from first principles to final review." action={<button className="add-button"><Plus size={16} /> Add subject</button>} /><div className="syllabus-grid">{subjects.map(subject => <div className="subject-card panel" key={subject.code}><div className={`subject-badge ${subject.color}`}><BookOpen size={18} /></div><div className="subject-head"><div><span>{subject.code}</span><h3>{subject.name}</h3></div><ProgressRing value={subject.progress} size={58} stroke={5} color={subject.color === "cyan" ? "#67e8f9" : subject.color === "amber" ? "#fbbf24" : subject.color === "rose" ? "#fb7185" : "#a78bfa"} /></div><div className="subject-progress"><div><span>Progress</span><strong>{subject.progress}%</strong></div><div className="progress-track"><span className={subject.color} style={{ width: `${subject.progress}%` }} /></div></div><div className="next-module"><span>NEXT UP</span><strong>{subject.next}</strong><ChevronRight size={15} /></div></div>)}</div><div className="panel module-table"><div className="panel-header"><div><div className="eyebrow">CURRENT TERM</div><h3>Module breakdown</h3></div><button className="text-button">Manage subjects <ArrowUpRight size={14} /></button></div><div className="module-row module-head"><span>MODULE</span><span>SUBJECT</span><span>STATUS</span><span>PROGRESS</span></div>{["Linear algebra foundations", "Graph theory & traversal", "Sequential logic", "Technical writing essentials"].map((module, i) => <div className="module-row" key={module}><strong>{module}</strong><span>{subjects[i].name}</span><span className={`module-status ${i < 2 ? "in-progress" : "upcoming"}`}>{i < 2 ? "In progress" : "Upcoming"}</span><div className="module-meter"><span style={{ width: `${[72, 58, 84, 46][i]}%` }} /></div></div>)}</div></div>;
}

function TasksView({ tasks, onToggle, onAdd }: { tasks: Task[]; onToggle: (id: number) => void; onAdd: () => void }) {
  return <div className="page-content generic-page"><SectionHeader eyebrow="FOCUS QUEUE" title="Tasks" description="Keep the important work visible and the noise out." action={<button className="add-button" onClick={onAdd}><Plus size={16} /> Add task</button>} /><div className="task-filters"><button className="selected">All tasks <span>31</span></button><button>Today <span>4</span></button><button>Upcoming <span>12</span></button><button>Completed <span>24</span></button><div className="filter-spacer" /><button><Search size={15} /> Filter</button></div><div className="task-view panel"><div className="task-view-header"><span>THIS WEEK</span><span>{tasks.filter(t => !t.done).length} open</span></div>{tasks.map(task => <TaskRow key={task.id} task={task} onToggle={onToggle} />)}<button className="dashed-add" onClick={onAdd}><Plus size={15} /> Add another task</button></div></div>;
}

function StudyView({ onStudy }: { onStudy: () => void }) {
  return <div className="page-content generic-page"><SectionHeader eyebrow="DEEP WORK" title="Study room" description="Build a calm rhythm that compounds over time." action={<button className="add-button" onClick={onStudy}><Timer size={16} /> Start session</button>} /><div className="study-layout"><div className="focus-panel panel"><div className="focus-orb"><div className="focus-orb-inner"><Timer size={28} /><strong>25:00</strong><span>FOCUS SESSION</span></div></div><div className="focus-copy"><span className="eyebrow">UP NEXT</span><h3>Eigenvalues problem set</h3><p>Mathematics I <i>·</i> 4 questions remaining</p><button className="focus-button" onClick={onStudy}><Zap size={17} /> Begin focus</button></div></div><div className="study-side"><div className="panel study-stat"><div className="stat-icon violet"><Flame size={17} /></div><span>Current streak</span><strong>12 days</strong><small>Your longest is 21 days</small></div><div className="panel study-stat"><div className="stat-icon cyan"><Clock3 size={17} /></div><span>Focus this week</span><strong>11h 24m</strong><small>63% of your weekly target</small></div><div className="panel quote-card"><Sparkles size={16} /><p>“Small steps every day add up to remarkable distance.”</p><span>— Unknown</span></div></div></div><div className="panel study-history"><div className="panel-header"><div><div className="eyebrow">LAST 7 DAYS</div><h3>Focus history</h3></div><button className="text-button">See analytics <ArrowUpRight size={14} /></button></div><div className="focus-bars">{[42, 68, 25, 82, 54, 95, 67].map((height, i) => <div className="focus-bar" key={i}><span style={{ height: `${height}%` }} /><small>{["Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed"][i]}</small></div>)}</div></div></div>;
}

function GoalsView() {
  const goals = [{ icon: Code2, title: "Ship portfolio v2", detail: "Personal · due Jun 30", progress: 62, color: "violet" }, { icon: GraduationCap, title: "Finish semester strong", detail: "Academic · due Jun 18", progress: 68, color: "cyan" }, { icon: Rocket, title: "Land a summer internship", detail: "Career · due Jul 15", progress: 28, color: "amber" }];
  return <div className="page-content generic-page"><SectionHeader eyebrow="LONG ARC" title="Goals" description="Your orbit is the system. Goals are the direction." action={<button className="add-button"><Plus size={16} /> New goal</button>} /><div className="goals-hero panel"><div><span className="eyebrow">NORTH STAR</span><h3>Build a life of deliberate progress.</h3><p>3 active goals · 1 milestone due this week</p></div><div className="goal-ring"><ProgressRing value={51} size={100} stroke={7} color="#a78bfa" /></div></div><div className="goal-list">{goals.map(goal => { const Icon = goal.icon; return <div className="goal-card panel" key={goal.title}><div className={`goal-icon ${goal.color}`}><Icon size={19} /></div><div className="goal-info"><span>{goal.detail}</span><h3>{goal.title}</h3><div className="goal-progress"><span style={{ width: `${goal.progress}%` }} /></div><small>{goal.progress}% complete</small></div><ArrowUpRight size={17} className="goal-arrow" /></div>; })}</div></div>;
}

function AnalyticsView() {
  return <div className="page-content generic-page"><SectionHeader eyebrow="SIGNALS & TRENDS" title="Analytics" description="A measured view of how your effort turns into momentum." action={<button className="icon-button"><MoreHorizontal size={17} /></button>} /><div className="analytics-grid"><div className="panel chart-panel"><div className="panel-header"><div><div className="eyebrow">WEEKLY FOCUS</div><h3>Hours studied</h3></div><strong className="chart-total">11h 24m <span>+18%</span></strong></div><div className="line-chart"><svg viewBox="0 0 700 220" preserveAspectRatio="none"><defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#a78bfa" stopOpacity=".35" /><stop offset="100%" stopColor="#a78bfa" stopOpacity="0" /></linearGradient></defs><path className="chart-area" d="M0,180 C55,170 85,112 140,135 S230,170 280,98 S365,125 420,90 S515,98 560,50 S640,76 700,25 V220 H0 Z" /><path className="chart-line" d="M0,180 C55,170 85,112 140,135 S230,170 280,98 S365,125 420,90 S515,98 560,50 S640,76 700,25" /></svg><div className="chart-labels"><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span></div></div></div><div className="panel analytics-score"><div className="eyebrow">CONSISTENCY</div><div className="score-center"><ProgressRing value={84} size={142} stroke={8} color="#67e8f9" /><span>excellent</span></div><p>You showed up on 6 of the last 7 days.</p></div></div><div className="analytics-bottom"><div className="panel insight-card"><div className="insight-icon"><Sparkles size={17} /></div><div><span className="eyebrow">SYSTEM INSIGHT</span><h3>Your best focus window is 9:00–11:00 AM.</h3><p>Sessions in this window are 34% longer on average. Protect it this week.</p></div><ArrowUpRight size={17} /></div><div className="panel subject-breakdown"><div className="panel-header"><div><div className="eyebrow">BY SUBJECT</div><h3>Effort distribution</h3></div></div>{subjects.map(s => <div className="breakdown-row" key={s.code}><span className={`breakdown-dot ${s.color}`} /><strong>{s.name}</strong><span className="breakdown-track"><i className={s.color} style={{ width: `${s.progress}%` }} /></span><em>{s.progress}%</em></div>)}</div></div></div>;
}

function RoadmapView() {
  return <div className="page-content generic-page"><SectionHeader eyebrow="SKILL GRAPH" title="Roadmap" description="Turn curiosity into a sequence you can actually follow." action={<button className="add-button"><Plus size={16} /> Add track</button>} /><div className="roadmap-grid"><div className="roadmap-card panel roadmap-primary"><div className="roadmap-icon violet"><Code2 size={20} /></div><span className="eyebrow">ACTIVE TRACK</span><h3>Full-stack development</h3><p>From foundations to shipping useful products.</p><div className="roadmap-progress"><span><b>7</b> of 12 milestones</span><strong>58%</strong></div><div className="roadmap-bar"><i /></div><div className="roadmap-nodes"><span className="done">HTML</span><span className="done">React</span><span className="current">APIs</span><span>Deploy</span></div></div><div className="roadmap-card panel"><div className="roadmap-icon cyan"><BrainCircuit size={20} /></div><span className="eyebrow">NEXT TRACK</span><h3>Python + AI/ML</h3><p>Make the leap from scripting to intelligence.</p><button className="text-button">Explore track <ArrowUpRight size={14} /></button></div><div className="roadmap-card panel"><div className="roadmap-icon amber"><FolderKanban size={20} /></div><span className="eyebrow">BACKLOG</span><h3>Ideas worth exploring</h3><p>14 loose threads waiting for the right moment.</p><button className="text-button">Open backlog <ArrowUpRight size={14} /></button></div></div></div>;
}

function KnowledgeView() {
  return <div className="page-content generic-page"><SectionHeader eyebrow="SECOND BRAIN" title="Knowledge base" description="Keep the ideas that matter close to the work." action={<button className="add-button"><Plus size={16} /> New note</button>} /><div className="knowledge-search panel"><Search size={17} /><input placeholder="Search notes, concepts, and saved links" /><kbd>⌘ K</kbd></div><div className="knowledge-grid">{[{ title: "Graph algorithms — mental model", tag: "Data Structures", time: "Updated 2h ago", icon: BrainCircuit, color: "cyan" }, { title: "Semester review: what is working", tag: "Reflection", time: "Updated yesterday", icon: Sparkles, color: "violet" }, { title: "Portfolio ideas to prototype", tag: "Roadmap", time: "Updated May 08", icon: Code2, color: "amber" }].map(note => { const Icon = note.icon; return <div className="knowledge-card panel" key={note.title}><div className={`knowledge-icon ${note.color}`}><Icon size={18} /></div><span>{note.tag}</span><h3>{note.title}</h3><small>{note.time}</small><ArrowUpRight size={15} /></div>; })}</div></div>;
}

function SettingsView() {
  return <div className="page-content generic-page"><SectionHeader eyebrow="PREFERENCES" title="Settings" description="Shape COSMOS around the way you think and work." /><div className="settings-list panel">{[{ icon: Settings2, title: "Workspace preferences", detail: "Semester dates, week start, and display density" }, { icon: Bell, title: "Notifications", detail: "Choose what deserves your attention" }, { icon: Database, title: "Data & privacy", detail: "Export, import, and manage local data" }, { icon: Moon, title: "Appearance", detail: "Dark mode, motion, and accessibility" }].map(row => { const Icon = row.icon; return <button className="settings-row" key={row.title}><div className="settings-icon"><Icon size={17} /></div><div><strong>{row.title}</strong><span>{row.detail}</span></div><ChevronRight size={17} /></button>; })}</div><div className="settings-note"><CircleHelp size={16} /><span>COSMOS is offline-first. Your data stays in this browser unless you choose to export it.</span></div></div>;
}

function AddTaskModal({ onClose, onSave }: { onClose: () => void; onSave: (title: string) => void }) {
  const [title, setTitle] = useState("");
  return <div className="modal-backdrop" onClick={onClose}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="add-task-title" onClick={e => e.stopPropagation()}><div className="modal-head"><div><span className="eyebrow">QUICK CAPTURE</span><h2 id="add-task-title">Add a task</h2></div><IconButton label="Close" onClick={onClose}><X size={18} /></IconButton></div><label className="form-label">What needs your attention?</label><input autoFocus value={title} onChange={e => setTitle(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && title.trim()) onSave(title.trim()); }} placeholder="e.g. Review chapter 5 notes" /><div className="modal-meta"><button><CalendarDays size={15} /> Today <ChevronDown size={13} /></button><button><Zap size={15} /> Medium <ChevronDown size={13} /></button></div><div className="modal-actions"><button className="text-button" onClick={onClose}>Cancel</button><button className="add-button" disabled={!title.trim()} onClick={() => onSave(title.trim())}><Plus size={16} /> Add task</button></div></div></div>;
}

function StudyModal({ onClose }: { onClose: () => void }) {
  return <div className="modal-backdrop" onClick={onClose}><div className="modal study-modal" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}><div className="modal-head"><div><span className="eyebrow">FOCUS MODE</span><h2>Ready when you are.</h2></div><IconButton label="Close" onClick={onClose}><X size={18} /></IconButton></div><div className="modal-timer"><div className="timer-ring"><Timer size={23} /><strong>25:00</strong><span>MINUTES</span></div><div><h3>Eigenvalues problem set</h3><p>Mathematics I <i>·</i> 4 questions remaining</p></div></div><div className="modal-actions"><button className="text-button" onClick={onClose}>Maybe later</button><button className="focus-button" onClick={onClose}><Zap size={16} /> Start timer</button></div></div></div>;
}

export default function App() {
  const [active, setActive] = useState<View>("Dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(() => { try { const saved = localStorage.getItem("cosmos.tasks"); return saved ? JSON.parse(saved) : initialTasks; } catch { return initialTasks; } });
  const [modal, setModal] = useState<"task" | "study" | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<typeof subjects[number] | null>(null);
  useEffect(() => { localStorage.setItem("cosmos.tasks", JSON.stringify(tasks)); }, [tasks]);
  const openTasks = useMemo(() => tasks.filter(task => !task.done).length, [tasks]);
  const toggleTask = (id: number) => setTasks(current => current.map(task => task.id === id ? { ...task, done: !task.done } : task));
  const addTask = (title: string) => { setTasks(current => [{ id: Date.now(), title, course: "Personal workspace", due: "Today · open", label: "Today", priority: "Medium", done: false }, ...current]); setModal(null); };
  const page = active === "Dashboard" ? <Overview tasks={tasks} onToggle={toggleTask} onAdd={() => setModal("task")} onStudy={() => setModal("study")} onSelect={setSelectedSubject} /> : active === "Schedule" ? <ScheduleView /> : active === "Syllabus" ? <SyllabusView /> : active === "Tasks" ? <TasksView tasks={tasks} onToggle={toggleTask} onAdd={() => setModal("task")} /> : active === "Study" ? <StudyView onStudy={() => setModal("study")} /> : active === "Goals" ? <GoalsView /> : active === "Analytics" ? <AnalyticsView /> : active === "Roadmap" ? <RoadmapView /> : active === "Knowledge" ? <KnowledgeView /> : <SettingsView />;
  return <div className="app-shell"><Sidebar active={active} setActive={setActive} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} /><main className="main-shell"><Topbar onMenu={() => setMobileOpen(true)} onQuickAdd={() => setModal("task")} /><div className="mobile-task-banner"><span><ListChecks size={15} /> {openTasks} tasks need you</span><button onClick={() => setModal("task")}>Add <Plus size={13} /></button></div>{page}<footer className="app-footer"><span>© 2025 COSMOS</span><span>Offline-first <i /> Built for deliberate progress</span></footer></main><div className="mobile-bottom-nav"><button className={active === "Dashboard" ? "active" : ""} onClick={() => setActive("Dashboard")}><LayoutDashboard size={18} /><span>Home</span></button><button className={active === "Schedule" ? "active" : ""} onClick={() => setActive("Schedule")}><CalendarDays size={18} /><span>Schedule</span></button><button className={active === "Tasks" ? "active" : ""} onClick={() => setActive("Tasks")}><ListChecks size={18} /><span>Tasks</span></button><button className={active === "Study" ? "active" : ""} onClick={() => setActive("Study")}><Timer size={18} /><span>Study</span></button><button onClick={() => setMobileOpen(true)}><MoreHorizontal size={18} /><span>More</span></button></div>{modal === "task" && <AddTaskModal onClose={() => setModal(null)} onSave={addTask} />}{modal === "study" && <StudyModal onClose={() => setModal(null)} />}{selectedSubject && <div className="modal-backdrop" onClick={() => setSelectedSubject(null)}><div className="detail-drawer" role="dialog" onClick={e => e.stopPropagation()}><div className="drawer-top"><div className={`subject-badge ${selectedSubject.color}`}><BookOpen size={18} /></div><IconButton label="Close" onClick={() => setSelectedSubject(null)}><X size={18} /></IconButton></div><span className="eyebrow">SUBJECT DETAIL</span><h2>{selectedSubject.name}</h2><p className="drawer-code">{selectedSubject.code} <i>·</i> Current semester</p><div className="drawer-progress"><ProgressRing value={selectedSubject.progress} size={94} stroke={7} color="#a78bfa" /><div><strong>On a steady orbit</strong><span>You have momentum here.</span></div></div><div className="drawer-stats"><div><span>NEXT MODULE</span><strong>{selectedSubject.next}</strong></div><div><span>STUDY TIME</span><strong>4h 20m</strong></div></div><button className="focus-button" onClick={() => { setSelectedSubject(null); setModal("study"); }}><Timer size={16} /> Start a study session</button></div></div>}</div>;
}
