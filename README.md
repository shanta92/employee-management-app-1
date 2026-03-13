# Employee Management App

An enterprise employee management system with CRUD operations.

## Tech Stack
- **Backend**: Node.js, Express, SQLite (better-sqlite3)
- **Frontend**: React (Create React App), Axios

## Features
- View all employees in a sortable table
- Filter employees by department
- Add new employees via a modal form
- Edit existing employee records
- Delete employees with confirmation dialog
- Input validation and error handling
- Responsive design

## Employee Fields
- **ID** – auto-generated
- **Name** – full name
- **Email** – unique email address
- **Department** – Engineering, Marketing, Sales, HR, Finance, Operations
- **Role** – job title/role
- **Hire Date** – date of joining

## Getting Started

### Prerequisites
- Node.js 16+

### Backend

```bash
cd backend
npm install
node index.js
```

The API will be available at http://localhost:3001

### Frontend

```bash
cd frontend
npm install
npm start
```

The app will open at http://localhost:3000

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | List all employees (supports `?department=X`) |
| GET | `/api/employees/:id` | Get a specific employee |
| POST | `/api/employees` | Create a new employee |
| PUT | `/api/employees/:id` | Update an employee |
| DELETE | `/api/employees/:id` | Delete an employee |
