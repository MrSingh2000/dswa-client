# 🚀 DSA Sheet & Preparation Tracker

A modern, full-stack Data Structures and Algorithms (DSA) preparation tracking platform. Designed to help developers organize their coding interview preparation with curated problem sheets, hierarchical syllabus breakdown, visual progress analytics, intelligent automated study planning, and daily calendar scheduling.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Setup](#installation--setup)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [API & Backend Overview](#-api--backend-overview)
- [Key Workflows](#-key-workflows)
- [Available Scripts](#-available-scripts)
- [License](#-license)

---

## 🌟 Overview

The **DSA Sheet Web Application** bridges the gap between solving coding problems and structured long-term interview preparation. It features:
- **Curated Problem Sheets**: Browse, search, filter, and track hundreds of DSA problems with difficulty levels and direct reference links (LeetCode, GFG, etc.).
- **Hierarchical Syllabus Tree**: Drill down through **Topics → Chapters (Sub-topics) → Problems** to master algorithms systematically.
- **Progress Tracking & Analytics**: Visualize your strengths and progress across Easy, Medium, and Hard tiers with interactive charts.
- **Smart Calendar & Auto-Study Planner**: Automatically generate a realistic study schedule tailored to your daily study hours, target start date, and problem backlog.
- **Authentication & Guest Access**: Browse sheets freely in guest mode; unlock cloud progress sync, personalized study plans, and custom scheduling upon signing in.

---

## ✨ Key Features

### 1. 📋 All Problems Explorer
- Paginated table view of DSA problems with pagination and responsive controls.
- Filter dynamically by **Difficulty** (`Easy`, `Medium`, `Hard`), **Topic**, and **Chapter**.
- Instant search by problem name or concepts.
- Quick completion toggles with instant optimistic UI feedback.
- Guest gating: Prompts non-authenticated users with a dialog before persisting status.

### 2. 🌲 Hierarchical Syllabus (`/chapters`)
- Collapsible 3-tier structure: **Topic → Chapters / Subtopics → Problem Rows**.
- Progress badges showing completed vs. total problems per topic and chapter.
- Expand all / Collapse all toggles for rapid exploration.
- Direct external problem links and integrated status toggles.

### 3. 📊 Visual Progress Analytics (`/progress`)
- **Key Metric Cards**: Total Solved, Completion Rate, Daily Streak, Revision Count.
- **Difficulty Breakdown Chart**: Radial / Donut breakdown of Easy, Medium, and Hard problems.
- **Topic-wise Mastery Bars**: Visual progress indicator per topic.
- **Solved Problems Records Table**: Comprehensive history of completed questions with timestamps.

### 4. 📅 Smart Study Calendar & Auto-Plan Generator (`/calendar`)
- **Monthly Grid View**: Color-coded indicators showing daily scheduled tasks and problems solved.
- **Day Details Panel**: Detailed daily schedule view with checkboxes, custom task adding, and quick-remove.
- **Intelligent Auto-Plan Generator**:
  - Paces topics based on daily study capacity (e.g. 1h, 2h, 3h/day).
  - Choose curriculum scope (All topics or specific topics).
  - Live projection calculator displaying total hours, problem count, and estimated completion date.
  - Option to include solved questions (Full Revision mode) or incomplete ones only.
- **Quick Schedule & Future Plan Clear**: Customize your daily workload or reset upcoming plans in one click.

### 5. 🎨 Design & Experience
- **Theme Support**: Seamless Dark Mode and Light Mode switching with system preference detection.
- **Component System**: Crafted with modern **shadcn/ui** and `@base-ui/react` primitives.
- **Notification System**: Toast notifications via `react-toastify`.
- **Responsive Layout**: Collapsible sidebar, sticky headers, and smooth micro-interactions.

---

## 🛠 Architecture & Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: TypeScript (~6.0)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + CSS Variables
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) primitives built with `@base-ui/react`
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management & Server Cache**: [@tanstack/react-query v5](https://tanstack.com/query/latest)
- **Routing**: [React Router v8](https://reactrouter.com/)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Date & Time Utilities**: [Luxon](https://moment.github.io/luxon/)
- **Linting & Code Quality**: [Oxlint](https://oxc.rs/)

### Backend (Companion Server)
- **Runtime**: Node.js + Express 5
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens) with bcrypt password hashing
- **Documentation**: Swagger UI & OpenAPI (`/api-docs`)

---

## 📁 Project Structure

```text
dsa-sheet-web-application/
├── public/                 # Static assets and icons
├── src/
│   ├── api/                # API client configuration & request functions
│   │   ├── api.ts          # Axios instance with auth interceptors
│   │   ├── endpoints.ts    # Centralized REST API endpoints
│   │   └── request/        # Typed API request functions (auth, calendar, problems, etc.)
│   ├── components/         # Reusable React components
│   │   ├── calendar/       # Calendar grid, day panel, auto-plan dialog
│   │   ├── progress/       # Analytics charts, metric cards, problem history table
│   │   ├── ui/             # shadcn/ui components (button, dialog, select, card, etc.)
│   │   ├── layout.tsx      # Main application layout & theme container
│   │   ├── sidebar.tsx     # Navigation sidebar with auth status & user greeting
│   │   └── perform-login-dialog.tsx # Modal prompting guests to sign in for locked actions
│   ├── const/              # Global constants & external links
│   ├── context/            # Theme provider context (dark/light mode)
│   ├── pages/              # Application views / routes
│   │   ├── all-problems.tsx# Paginated problems table view
│   │   ├── chapters.tsx    # Hierarchical topic syllabus view
│   │   ├── calendar.tsx    # Study planner and calendar view
│   │   ├── progress.tsx    # Analytics dashboard
│   │   └── login.tsx       # Authentication view
│   ├── query/              # TanStack React Query hooks categorized by domain
│   ├── schemas/            # Zod validation schemas
│   ├── utils/              # Local storage, date formatting, and toast helpers
│   ├── App.tsx             # Route definitions & router provider
│   └── main.tsx            # Entry point
├── .env.example            # Example environment configuration
├── package.json            # Scripts & dependencies
├── vite.config.ts          # Vite build and plugin setup
└── tsconfig.json           # TypeScript configuration
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **Package Manager**: `npm`, `pnpm`, or `yarn`
- **DSA Backend Server**: Running locally or hosted (default: `http://localhost:3000`)

---

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/dsa-sheet-web-application.git
   cd dsa-sheet-web-application
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Configure environment variables:**
   Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

---

### Environment Variables

Create or update `.env` in the root folder:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

| Variable | Description | Default |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Base URL pointing to the backend API service | `http://localhost:3000/api` |

---

### Running the App

Start the Vite development server:

```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:5173
```

---

## 📡 API & Backend Overview

The frontend communicates with a RESTful backend server with the following primary endpoints:

| Domain | Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- | :---: |
| **Auth** | `POST` | `/api/auth/login` | User login & JWT issuance | ❌ |
| **User** | `GET` | `/api/users/me` | Fetch active user profile | ✅ |
| **DSA** | `GET` | `/api/dsa/problems` | Paginated problems list with status | Optional |
| **DSA** | `GET` | `/api/dsa/chapters` | Paginated chapters with problems | Optional |
| **DSA** | `GET` | `/api/dsa/sheet` | Full Topic → Chapter → Problem tree | Optional |
| **Progress** | `PATCH`| `/api/users/problems/:id/status` | Mark/toggle problem completion | ✅ |
| **Calendar** | `GET` | `/api/calendar/month` | Events & solved stats for month view | ✅ |
| **Calendar** | `GET` | `/api/calendar/day` | Detailed scheduled tasks for a day | ✅ |
| **Calendar** | `POST`| `/api/calendar/preview` | Preview auto-generated study plan | ✅ |
| **Calendar** | `POST`| `/api/calendar/generate` | Generate and persist plan schedule | ✅ |
| **Calendar** | `DELETE`| `/api/calendar/plan` | Clear future scheduled study tasks | ✅ |

> **Note**: When running the backend server, visit `http://localhost:3000/api-docs` to view the interactive **Swagger / OpenAPI** documentation.

---

## 🔄 Key Workflows

### 🎯 Guest vs. Authenticated Mode
- **Unauthenticated Users**: Can freely explore problems, view the chapter syllabus, filter topics, and test search functionalities.
- **Triggering Locked Actions**: Attempting to toggle completion or navigate to `/progress` or `/calendar` prompts the `PerformLoginDialog` asking the user to sign in to save their progress.
- **Authenticated Users**: Have full access to sync status across devices, auto-generate calendar study plans, and view deep analytics.

### 📅 Generating an Auto Study Plan
1. Navigate to **Calendar** (`/calendar`).
2. Click **Generate Study Plan**.
3. Select curriculum scope (All Topics or a specific module).
4. Set daily study hours (1h – 4h) and a start date.
5. Review the real-time calculated roadmap (duration in days, total hours, target completion date, and 3-day sample breakdown).
6. Click **Generate Calendar Roadmap** to populate your calendar.

---

## 📜 Available Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| `dev` | `npm run dev` | Runs the Vite dev server with hot module replacement (HMR) |
| `build` | `npm run build` | Runs TypeScript compilation (`tsc -b`) and generates production build in `dist/` |
| `preview` | `npm run preview` | Previews the production build locally |
| `lint` | `npm run lint` | Runs the ultra-fast Oxlint linter across the codebase |

---

## 🤝 Contributing

Contributions, feedback, and feature suggestions are welcome!
1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
