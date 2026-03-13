# Employee Management App

An enterprise employee management system with CRUD operations.

## Tech Stack

- **Backend**: Node.js, Express 5, TypeScript, SQLite (better-sqlite3)
- **Frontend**: React 19 (TypeScript), Axios
- **Testing**: Jest, React Testing Library, Supertest

## Features

- View all employees in a sortable table
- Filter employees by department
- Add new employees via a modal form
- Edit existing employee records
- Delete employees with confirmation dialog
- Input validation (email format, department whitelist, required fields)
- Rate limiting and CORS protection
- Responsive design

## Architecture

This project follows clean architecture principles:

- **Domain layer** (`/src/domain/`) — Business logic, types, and validation
- **Components** (`/src/components/`) — React UI components
- **Routes** (`/src/routes/`) — Express API route handlers
- **Middleware** (`/src/middleware/`) — Express middleware (error handling)

## Employee Fields

| Field | Description |
|-------|-------------|
| **ID** | Auto-generated |
| **Name** | Full name (required) |
| **Email** | Unique email address (required, validated) |
| **Department** | Engineering, Marketing, Sales, HR, Finance, or Operations |
| **Role** | Job title/role (required) |
| **Hire Date** | Date of joining in YYYY-MM-DD format (required) |

## Getting Started

### Prerequisites

- Node.js 16+

### Backend

```bash
cd backend
npm install
npm run build
npm start
```

The API will be available at http://localhost:3001

For development with auto-reload:

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

The app will open at http://localhost:3000

## Testing

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npx react-scripts test --watchAll=false
```

With coverage:

```bash
cd frontend
npx react-scripts test --watchAll=false --coverage
```

Both backend and frontend maintain 80%+ code coverage.

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | List all employees (supports `?department=X`) |
| GET | `/api/employees/:id` | Get a specific employee |
| POST | `/api/employees` | Create a new employee |
| PUT | `/api/employees/:id` | Update an employee |
| DELETE | `/api/employees/:id` | Delete an employee |
| GET | `/health` | Health check |
