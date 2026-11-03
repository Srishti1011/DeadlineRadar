# 🎯 Deadline Radar — Academic Workload & Deadline Management Platform

**Deadline Radar** is an editorial, responsive, and high-performance frontend productivity web application crafted specifically for college students and academics. It transforms overwhelming course schedules, assignments, lab vivas, quizzes, and examination dates into an intelligent, visually balanced radar of cognitive load.

Built with **React**, **Vite**, **Tailwind CSS**, **Lucide React**, and **Recharts**.

---

## 🌟 Key Features

### 1. 📊 Overview Dashboard
- **Dynamic Welcome & Context**: Real-time greeting customized to user's local hour and academic urgency (e.g. *"Good morning, Srishti. You have 5 upcoming academic deadlines. Let's stay ahead"*).
- **Stat Cards**: Oversized numbers and micro-indicators for:
  - Total Pending Tasks
  - Due Within 7 Days
  - Completed Tasks
  - Overdue Tasks
- **Workload Radar (Signature Feature)**:
  - Weekly workload chart (Monday–Sunday) calculating live cognitive load based on pending tasks, priority level, proximity, and assessment type (e.g. Examinations count higher than short quizzes).
  - Workload classification levels: **Rest**, **Light**, **Moderate**, **Heavy**, and **Critical**.
  - Highlights the **Peak Day** of academic pressure.
  - Automatically raises early redistribution warnings if a day hits Critical load.
  - Interactive day selection with drilldown deliverables and direct "+ Add task" shortcuts.
- **Today's Focus**: Prioritized queue ordered by Overdue status, deadline proximity, and high priority, with quick-completion checkboxes.
- **Subject Distribution**: Interactive donut chart displaying deliverable distribution across active courses.
- **Upcoming Deadlines**: Chronological milestone timeline with contextual deadline pills (*Due today*, *Due tomorrow*, *Due in X days*, *Overdue*).

### 2. 📝 My Tasks Hub
- Full CRUD operations with browser `LocalStorage` persistence.
- Academic categories with custom pastel and editorial styling:
  - **Assignment** (Violet / Lavender)
  - **Quiz** (Blue)
  - **Examination** (Warm Amber)
  - **Lab Evaluation** (Green / Teal)
  - **Presentation** (Coral / Rose)
  - **Project** (Indigo)
  - **Other** (Slate)
- **Status Tabs**: *All Tasks*, *Pending*, *Completed*, *Overdue*.
- Multi-dimensional filtering by **Subject**, **Category**, and **Priority**.
- Sorting by **Deadline** (Soonest/Furthest), **Priority** (High to Low), **Date Created**, and **Alphabetical**.
- Real-time search across titles, descriptions, and subjects.
- Quick priority toggles, edit modal, detail viewer, and delete confirmation dialogs.
- Interactive celebration confetti on task completion!

### 3. 🗓️ Academic Calendar
- **Monthly View** & **Weekly View** with seamless toggling.
- Full date matrix navigation (*Previous*, *Next*, and *Today* button).
- Current day highlighted with bold dark contrast badge.
- Tasks color-coded by category badges directly on deadline dates.
- Interactive date inspector sidebar: click any date to view scheduled tasks or add a task directly for that date.

### 4. 📈 Workload Analytics
- **Weekly Deliverable Density**: Stacked bar chart showing pending vs. completed obligations per day.
- **Subject-wise Pending Workload**: Horizontal bar chart comparing academic burden across subjects.
- **Completion Rate**: Circular radial progress meter displaying submission percentage.
- **Productivity Overview**: Metrics tracking tasks completed this week, this month, active pending, and overdue backlog.
- **Intelligent Workload Insights**: Computed observations from live data (e.g. clustered deadlines between Wednesday and Friday, subject concentration, peak pressure days).

### 5. 📚 Subject Directory
- Course management with code, faculty instructor, description, and accent color.
- Real-time deliverable metrics per subject (Total, Pending, Completed, and progress bar).
- **Safe Subject Deletion Dialog**: Never silently deletes tasks. Allows students to:
  1. *Keep tasks as Unassigned*
  2. *Reassign tasks to another active subject*
  3. *Delete all associated tasks*

### 6. ⚙️ Platform Settings
- Edit student display name and avatar initials.
- Select preferred date formatting (*MMM DD, YYYY*, *DD/MM/YYYY*, *YYYY-MM-DD*).
- One-click **Light / Dark Mode** toggle with full color token support.
- Notification & reminder preferences (simulated frontend switches).
- **Reset to Sample Demo Data** (repopulates original curated college dataset).
- **Clear All Application Data** (with safety confirmation dialog).

---

## 🎨 Visual Identity & Design Language

- **Editorial Swiss Typography**: High contrast headings, oversized figures, uppercase letter-spaced metadata labels (`Plus Jakarta Sans`).
- **Architectural Grid Background**: Subtle geometric grid pattern inspired by engineering drafting paper.
- **Layered White & Charcoal Cards**: Floating shadows (`shadow-card`, `shadow-float`), rounded corners (`rounded-2xl`, `rounded-3xl`), and thin borders (`#E7E5EC` / `#242432`).
- **Controlled Color Palette**:
  - Background: `#F5F4F8` (Light) / `#0C0C10` (Dark)
  - Card: `#FFFFFF` (Light) / `#15151C` (Dark)
  - Primary Text: `#17171D` (Light) / `#F0EFF4` (Dark)
  - Secondary Text: `#777780` (Light) / `#908FA0` (Dark)
  - Thin Borders: `#E7E5EC` (Light) / `#242432` (Dark)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### Installation & Launch

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

Open [http://localhost:5173](http://localhost:5173) in your browser.
