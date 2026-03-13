/**
 * Employee API routes.
 * Provides CRUD operations for employee records with input validation.
 * @module routes/employees
 */

import { Router, Request, Response, NextFunction } from 'express';
import { getDb } from '../db';
import { validateEmployee, Employee } from '../domain/employee';

const router = Router();

/**
 * GET /api/employees
 * Lists all employees, optionally filtered by department.
 *
 * @queryParam department - Optional department filter
 */
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const db = getDb();
    const { department } = req.query;

    if (department && typeof department === 'string') {
      const stmt = db.prepare('SELECT * FROM employees WHERE department = ? ORDER BY name');
      const employees = stmt.all(department);
      return res.json(employees);
    }

    const stmt = db.prepare('SELECT * FROM employees ORDER BY name');
    const employees = stmt.all();
    res.json(employees);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/employees/:id
 * Retrieves a single employee by ID.
 *
 * @param id - The employee ID
 */
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const db = getDb();
    const employee = db.prepare('SELECT * FROM employees WHERE id = ?').get(req.params.id);

    if (!employee) {
      const err = new Error('Employee not found') as Error & { status?: number };
      err.status = 404;
      return next(err);
    }

    res.json(employee);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/employees
 * Creates a new employee record after validating input.
 */
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const validation = validateEmployee(req.body);
    if (!validation.valid) {
      const err = new Error(validation.errors.join('; ')) as Error & { status?: number };
      err.status = 400;
      return next(err);
    }

    const { name, email, department, role, hire_date } = req.body;
    const db = getDb();
    const stmt = db.prepare(
      'INSERT INTO employees (name, email, department, role, hire_date) VALUES (?, ?, ?, ?, ?)'
    );
    const result = stmt.run(name.trim(), email.trim(), department, role.trim(), hire_date);
    const employee = db.prepare('SELECT * FROM employees WHERE id = ?').get(
      result.lastInsertRowid
    ) as Employee;

    res.status(201).json(employee);
  } catch (err) {
    const error = err as Error & { status?: number; message: string };
    if (error.message && error.message.includes('UNIQUE constraint failed')) {
      error.status = 409;
      error.message = 'An employee with that email already exists';
    }
    next(error);
  }
});

/**
 * PUT /api/employees/:id
 * Updates an existing employee record after validating input.
 *
 * @param id - The employee ID to update
 */
router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const db = getDb();
    const existing = db.prepare('SELECT * FROM employees WHERE id = ?').get(req.params.id);

    if (!existing) {
      const err = new Error('Employee not found') as Error & { status?: number };
      err.status = 404;
      return next(err);
    }

    const validation = validateEmployee(req.body);
    if (!validation.valid) {
      const err = new Error(validation.errors.join('; ')) as Error & { status?: number };
      err.status = 400;
      return next(err);
    }

    const { name, email, department, role, hire_date } = req.body;
    db.prepare(
      `UPDATE employees SET name=?, email=?, department=?, role=?, hire_date=?, updated_at=datetime('now') WHERE id=?`
    ).run(name.trim(), email.trim(), department, role.trim(), hire_date, req.params.id);

    const updated = db.prepare('SELECT * FROM employees WHERE id = ?').get(req.params.id);
    res.json(updated);
  } catch (err) {
    const error = err as Error & { status?: number; message: string };
    if (error.message && error.message.includes('UNIQUE constraint failed')) {
      error.status = 409;
      error.message = 'An employee with that email already exists';
    }
    next(error);
  }
});

/**
 * DELETE /api/employees/:id
 * Deletes an employee record.
 *
 * @param id - The employee ID to delete
 */
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const db = getDb();
    const existing = db.prepare('SELECT * FROM employees WHERE id = ?').get(req.params.id);

    if (!existing) {
      const err = new Error('Employee not found') as Error & { status?: number };
      err.status = 404;
      return next(err);
    }

    db.prepare('DELETE FROM employees WHERE id = ?').run(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
