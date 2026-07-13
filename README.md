# PolymerX — Training & TNI Management System

A full-stack web application for managing employees, departments, training courses, employee-to-training mapping, and Training Need Identification (TNI). Built as a complete HR training workflow: identify skill gaps in the TNI competency matrix, create courses, assign employees, and track their progress and proficiency — with company-wide and per-department dashboards on top.

**Stack:** React (Vite) · Node.js / Express · MySQL · JWT Authentication

---

## Features

| Module | What it does |
|---|---|
| **Authentication** | Admin register & login. Passwords bcrypt-hashed, JWT tokens (8h expiry), every API route protected by middleware. |
| **Employees** | Listing with avatars, status badges, live search (name/ID) and department + status filters. Add/Edit modal, delete with confirmation. |
| **Departments** | Listing with auto employee counts (SQL JOIN) and budgets in ₹ lakhs. HOD dropdown populated from employees. |
| **Training Management** | Course cards with category/status badges, duration, assigned count, and average completion bar. Search, create, edit, delete. |
| **Manage (Mapping)** | Per-course modal to assign employees (already-assigned excluded from dropdown), update progress via slider (status auto-derives), rate proficiency 1–5 stars, or unassign. |
| **TNI & Competency Mapping** | Per employee, per year competency matrix. Set Required / Self / HOD levels (1–5); the Gap and "Training Required" flag compute live (gap = required − HOD). |
| **Admin Dashboard** | Stat cards + bar chart (assignments by department) + donut (assignment status distribution) via recharts. |
| **Department Dashboard** | Same stats scoped to a selected department, with a per-employee assigned/completed table. |

---

## Project Structure

```
training-app/
├── backend/
│   ├── .env                  # secrets (never committed)
│   ├── .env.example          # template for setup
│   ├── schema.sql            # database + tables + seed data
│   ├── db.js                 # shared MySQL connection pool
│   ├── server.js             # Express entry point + route mounting
│   ├── middleware/
│   │   └── auth.js           # JWT verification (protects all /api routes)
│   └── routes/
│       ├── auth.js           # register / login
│       ├── departments.js    # CRUD + employee counts
│       ├── employees.js      # CRUD + department names
│       ├── trainings.js      # CRUD + assigned counts + avg progress
│       ├── assignments.js    # the many-to-many mapping endpoints
│       ├── needs.js          # TNI competency matrix rows
│       └── dashboard.js      # aggregate queries (admin + department)
└── frontend/
    ├── .env                  # VITE_API_URL
    └── src/
        ├── components/       # one folder per feature:
        │   └── <Name>/       #   <Name>.jsx (UI) + <Name>.hook.js (logic) + <Name>.css
        ├── routes/index.jsx  # route map + ProtectedRoute guard
        ├── service/          # api.js (axios + interceptors) + per-feature services
        ├── redux/            # store.js + slices/ (employees, departments, trainings)
        ├── constants/        # API URL, statuses, categories, nav items
        └── theme.css         # global design system (colors, cards, badges, modals)
```

---

## Database Design (MySQL — `training_db`)

| Table | Key columns | Role |
|---|---|---|
| `users` | name, email (unique), password_hash, role | Login accounts — passwords stored only as bcrypt hashes |
| `departments` | name, head, budget, description | Master data; parent of employees |
| `employees` | name, email (unique), designation, department_id (FK), manager, status, join_date, rating | Staff records |
| `trainings` | title, category, trainer, duration_hours, status (Draft/Active/Completed) | Training courses |
| `training_assignments` | training_id (FK), employee_id (FK), status, progress %, proficiency | **Many-to-many mapping.** UNIQUE(training_id, employee_id) prevents double assignment; ON DELETE CASCADE removes orphan rows |
| `training_needs` | employee_id (FK), topic, required_level, self_level, hod_level, year | TNI matrix rows — the gap is computed at runtime, never stored |

---

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL Server 8+ (with MySQL Workbench recommended)

### 1. Database

Open MySQL Workbench and run `backend/schema.sql`. This creates `training_db`, all six tables, and seeds two departments.

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env     # then edit .env with your values
node server.js           # API starts on http://localhost:5000
```

`backend/.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=training_db
PORT=5000
JWT_SECRET=any_long_random_string
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev              # app opens on http://localhost:5173
```

`frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. First use

Open http://localhost:5173 → Register an account → Sign in. Recommended data-entry order for a fresh database:

1. **Departments** — create them (HOD can stay blank for now)
2. **Employees** — add staff into their departments
3. **Departments (edit)** — assign each HOD from the now-populated dropdown
4. **Training Management** — create courses
5. **Manage** — assign employees, drag progress, click stars
6. **TNI & Mapping** — add topics per employee and set levels; rows flagged "Training Required = Yes" tell you what to assign next
7. **Dashboards** — watch the charts fill

---

## API Reference

All routes are prefixed `/api`. Everything except `/auth/*` requires the header `Authorization: Bearer <token>`.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Create an account |
| POST | `/auth/login` | Returns JWT + user object |
| GET / POST | `/departments` | List (with employee counts) / create |
| GET / PUT / DELETE | `/departments/:id` | Read / update / delete |
| GET / POST | `/employees` | List (with department names) / create |
| GET / PUT / DELETE | `/employees/:id` | Read / update / delete |
| GET / POST | `/trainings` | List (with assigned count + avg progress) / create |
| GET / PUT / DELETE | `/trainings/:id` | Read / update / delete |
| GET | `/assignments/training/:trainingId` | Everyone assigned to a training |
| GET | `/assignments/employee/:employeeId` | All trainings of an employee |
| POST | `/assignments` | Bulk assign: `{ training_id, employee_ids: [] }` |
| PUT | `/assignments/:id` | Update status / progress / proficiency |
| DELETE | `/assignments/:id` | Unassign an employee |
| GET | `/needs/employee/:employeeId?year=` | TNI matrix rows for an employee |
| POST / PUT / DELETE | `/needs`, `/needs/:id` | Add / edit / remove a matrix row |
| GET | `/dashboard/admin` | Company-wide stats + chart data |
| GET | `/dashboard/department/:id` | Stats scoped to one department |

---

## Architecture Decisions

- **Layered data flow — UI → service → API → Redux → UI.** Components never call axios directly; every request goes through a service file, so the flow stays predictable and testable.
- **Component pattern: `Name.jsx` + `Name.hook.js` + `Name.css`.** Logic lives in the hook; the JSX stays purely visual. One job per file.
- **State at the narrowest scope.** Shared lists (employees, departments, trainings) live in Redux Toolkit slices; page-only data like dashboards uses local `useState`.
- **Derived state, never duplicated.** Search results, filters, and the TNI gap are computed with `useMemo` / at render time — nothing can go stale.
- **Mapping enforced by the database.** `UNIQUE(training_id, employee_id)` + `INSERT IGNORE` make double-assignment impossible even if the UI is bypassed.
- **Progress drives status.** 0% = Assigned, 1–99% = In Progress, 100% = Completed — status is derived, not directly editable.
- **Validation on both sides.** TNI levels are clamped to 0–5 in the React hook *and* in the Express route — the database never receives out-of-range values.
- **Parameterized SQL everywhere.** All queries use `?` placeholders, preventing SQL injection.
- **Secrets in `.env`** (gitignored), with a committed `.env.example` so anyone can configure their own environment.

## Known Design Choices (not bugs)

- Registering redirects to Login — you sign in manually after creating an account.
- The HOD dropdown is empty until employees exist: create departments first, add employees, then edit departments to set HODs.
- Deleting a department that still has employees is blocked (foreign key protection).
- Employee PX codes come from database IDs, so deleted employees leave gaps — codes are never resequenced.
- TNI matrix edits save on blur (when an input loses focus), not on every keystroke.
- Course completion % is the average progress of its assignees, so it reads 0% until someone is assigned.

## License

Internal training/assignment project — not licensed for redistribution.
