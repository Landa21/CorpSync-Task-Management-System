CorpSync — Task Management System
CorpSync is a small corporate task management demo application built with a Vite + React + TypeScript frontend and an Express-based backend that provides simple JWT authentication and seeded demo users. The project demonstrates role-based routing, in-memory task management in the client, and a simple file-based backend for auth.

Frontend: Vite, React, TypeScript, TailwindCSS, lucide-react icons, framer-motion
Backend: Express, json web tokens (JWT), bcryptjs (file-backed DB in backend/db.json)
Features
Role-based dashboards (SUPER_ADMIN, ADMIN_MANAGER, EMPLOYEE)
JWT authentication (login + /me)
Seeded demo users for development
Task context with create/update/comment functions for UI/demo
TailwindCSS-based design with accessible components
Dev scripts for frontend and backend
Quick Start
Prerequisites
Node.js (recommend v18+)
npm (or yarn)
Git (optional to clone)
Install dependencies
Open two terminals (or one and run multiple commands sequentially):

Root (frontend) dependencies:
# in project root
npm install
Backend dependencies:
cd backend
npm install
cd ..
Note: The backend is a separate Node project (backend/package.json). Installing root deps does not install backend deps automatically.

Run (Development)
There are two servers to run: the backend (auth API) and the frontend (Vite dev server).

Start the backend (auth server)
# from project root
cd backend
npm run dev
# This uses: nodemon server.js and watches for changes.
By default the backend runs on port 5000 (configurable via .env)

Start the frontend
# from project root
npm run dev
# Runs: vite dev server (see package.json)
Open the app in your browser:
Vite server default: http://localhost:5173 (the dev server prints the actual address)
Backend: http://localhost:5000
You can also run only the backend from the root:

npm run backend
# this runs: cd backend && npm run dev
Backend (API)
The backend is a minimal Express server located at backend/server.js. It implements:

POST /api/login

Body: { email, password }
Returns: { user: { ...no password }, token }
Token: JWT signed with JWT_SECRET from backend/.env
GET /api/me

Requires Authorization: Bearer
Returns the user object (from db.json) for the authenticated token
The code uses a file backend/db.json as the data store for users (seeded). The login uses bcrypt to compare provided passwords with hashed values stored in db.json. Tokens are verified with JWT_SECRET.

Demo accounts (seeded)
The repo includes seeded accounts in backend/db.json. Use these during development:

Super Admin

Email: super@corporate.com
Password (plaintext used to generate seed): admin123
Role: SUPER_ADMIN
Manager(s)

Email: sarah@corporate.com / Password: manager123 / Role: ADMIN_MANAGER
Email: michael@corporate.com / Password: manager123 / Role: ADMIN_MANAGER
Email: kelly@corporate.com / Password: manager123 / Role: ADMIN_MANAGER
Employees

Email: john@corporate.com / Password: employee123 / Role: EMPLOYEE
Email: pam@corporate.com / Password: employee123 / Role: EMPLOYEE
These plaintext passwords are only for the seeded demo data. The actual stored values in backend/db.json are bcrypt hashes.

Initialize / Reset the DB
A small seeding script is provided to re-create the db.json with hashed passwords:

# from backend folder
node init-db.js
# or from project root:
node backend/init-db.js
This will re-hash the plaintext passwords in the file and overwrite backend/db.json. Use it when you want to reset seeded users.

Environment variables
The backend reads backend/.env. At minimum, set:

PORT=5000
JWT_SECRET=corpsync_precision_secret_2026
NODE_ENV=development
Create backend/.env (or copy/modify the included one). For production, change JWT_SECRET to a secure random secret.

API Examples
Login example (curl):

curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"super@corporate.com", "password":"admin123"}'
If successful, you will get a response like:

{
  "user": {
    "id": "1",
    "name": "Super Admin",
    "email": "super@corporate.com",
    "role": "SUPER_ADMIN",
    "avatar": "https://..."
  },
  "token": "eyJhbGciOiJ..."
}
Use the token to call the protected /api/me endpoint:

curl http://localhost:5000/api/me \
  -H "Authorization: Bearer eyJhbGciOiJ..."
Frontend
Entry: src/main.tsx
App root & routes: src/App.tsx
Routes:
/login — login page (client saves token in localStorage)
/super_admin/* — SUPER_ADMIN area (protected)
/admin_manager/* — ADMIN_MANAGER area (protected)
/employee/* — EMPLOYEE area (protected)
/tasks — shared task view (protected)
/profile — profile (protected)
/ — redirects to the correct dashboard depending on role (client-side)
/404 — not found
Auth behavior:

The frontend uses src/context/AuthContext.tsx:
login(email, password) posts to the backend /api/login.
On success: stores token in localStorage under token and sets user state.
logout() clears token and user from memory/storage.
On app load, it attempts to call /api/me with localStorage.token to restore session.
Tasks:

src/context/TaskContext.tsx contains an in-memory task store used by the UI and demonstrates operations:
addTask, updateTaskStatus, addComment, addDepartment, addUser, deleteUser
This is a client-side demo; persistent backend task endpoints are not implemented in this repository.
Build & Preview
To build the frontend for production:

npm run build
# This runs: tsc && vite build
To preview the built frontend:

npm run preview
# Vite preview server
Linting
Project includes ESLint and TypeScript configs. Run:

npm run lint
Key Files & Where to Look
Frontend
src/App.tsx — high-level routes and dashboards
src/context/AuthContext.tsx — authentication logic (token handling, login)
src/context/TaskContext.tsx — tasks and demo data logic
src/components/ProtectedRoute.tsx — route protection UI/logic
src/pages/Shared/Tasks.tsx — main tasks UI (filters, sort, modals)
Backend
backend/server.js — Express server, auth endpoints
backend/init-db.js — seed script that hashes initial user passwords
backend/db.json — seeded user data (bcrypt hashes)
backend/.env — environment variables (secret, port)
Troubleshooting
If login returns "Network error. Is the server running?" ensure backend is running on the expected port and CORS requests are allowed (server.js uses CORS by default).
If tokens fail verification, check backend/.env JWT_SECRET matches the secret used when signing tokens.
If you re-seed DB and get login failures, re-run node backend/init-db.js and restart the backend.
Port conflicts: By default backend uses PORT=5000. Vite dev server typically runs on 5173. Adjust as needed.
Development Tips
The backend is intentionally minimal and file-based (db.json) to make local development easy. For production or complex testing, replace the data layer with a real DB and expand APIs.
The frontend stores the token in localStorage and uses it to call /api/me on load. You can inspect localStorage in devtools for token.
Task management in this repo is client-only (in-memory). To persist tasks, implement REST endpoints in the backend and update TaskContext to call them.
Contributing
This repository is structured as a demo—if you'd like to contribute:

Open issues for improvements (security, API, UX)
Submit PRs to:
Add persistent task APIs
Add proper backend user CRUD with secure admin flows
Add tests (unit + integration)
Improve TypeScript types and linting rules
Security & Notes
The seeded JWT_SECRET in backend/.env should be changed for any real deployment.
Demo account passwords are for local development only; do not reuse them in production.
The backend uses plain file storage; it is not suitable for production as-is.
License
No license file is bundled. Add a LICENSE file if you intend to open-source or distribute this project.
