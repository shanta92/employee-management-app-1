const express = require('express');
const router = express.Router();
const { getDb } = require('../db');

const VALID_DEPARTMENTS = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates employee input fields.
 * @param {Object} body - The request body containing employee data
 * @param {string} body.name - Full name
 * @param {string} body.email - Email address
 * @param {string} body.department - Department name
 * @param {string} body.role - Job role
 * @param {string} body.hire_date - Hire date (YYYY-MM-DD)
 * @returns {string|null} An error message if validation fails, or null if valid
 */
function validateEmployee(body) {
  const { name, email, department, role, hire_date } = body;
  if (!name || !email || !department || !role || !hire_date) {
    return 'Missing required fields: name, email, department, role, hire_date';
  }
  if (!EMAIL_REGEX.test(email)) {
    return 'Invalid email format';
  }
  if (!VALID_DEPARTMENTS.includes(department)) {
    return `Invalid department. Must be one of: ${VALID_DEPARTMENTS.join(', ')}`;
  }
  return null;
}

/**
 * GET /api/employees - Lists all employees, with optional department filter.
 * @param {import('express').Request} req - Express request (query: { department?: string })
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Next middleware
 */
router.get('/', (req, res, next) => {
  try {
    const db = getDb();
    const { department } = req.query;
    let stmt;
    if (department) {
      stmt = db.prepare('SELECT * FROM employees WHERE department = ? ORDER BY name');
      const employees = stmt.all(department);
      return res.json(employees);
    }
    stmt = db.prepare('SELECT * FROM employees ORDER BY name');
    const employees = stmt.all();
    res.json(employees);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/employees/:id - Retrieves a single employee by ID.
 * @param {import('express').Request} req - Express request (params: { id: string })
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Next middleware
 */
router.get('/:id', (req, res, next) => {
  try {
    const db = getDb();
    const employee = db.prepare('SELECT * FROM employees WHERE id = ?').get(req.params.id);
    if (!employee) {
      const err = new Error('Employee not found');
      err.status = 404;
      return next(err);
    }
    res.json(employee);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/employees - Creates a new employee record.
 * @param {import('express').Request} req - Express request with employee data in body
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Next middleware
 */
router.post('/', (req, res, next) => {
  try {
    const validationError = validateEmployee(req.body);
    if (validationError) {
      const err = new Error(validationError);
      err.status = 400;
      return next(err);
    }
    const { name, email, department, role, hire_date } = req.body;
    const db = getDb();
    const stmt = db.prepare(
      'INSERT INTO employees (name, email, department, role, hire_date) VALUES (?, ?, ?, ?, ?)'
    );
    const result = stmt.run(name, email, department, role, hire_date);
    const employee = db.prepare('SELECT * FROM employees WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(employee);
  } catch (err) {
    if (err.message && err.message.includes('UNIQUE constraint failed')) {
      err.status = 409;
      err.message = 'An employee with that email already exists';
    }
    next(err);
  }
});

/**
 * PUT /api/employees/:id - Updates an existing employee record.
 * @param {import('express').Request} req - Express request with employee data in body
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Next middleware
 */
router.put('/:id', (req, res, next) => {
  try {
    const db = getDb();
    const existing = db.prepare('SELECT * FROM employees WHERE id = ?').get(req.params.id);
    if (!existing) {
      const err = new Error('Employee not found');
      err.status = 404;
      return next(err);
    }
    const validationError = validateEmployee(req.body);
    if (validationError) {
      const err = new Error(validationError);
      err.status = 400;
      return next(err);
    }
    const { name, email, department, role, hire_date } = req.body;
    db.prepare(
      `UPDATE employees SET name=?, email=?, department=?, role=?, hire_date=?, updated_at=datetime('now') WHERE id=?`
    ).run(name, email, department, role, hire_date, req.params.id);
    const updated = db.prepare('SELECT * FROM employees WHERE id = ?').get(req.params.id);
    res.json(updated);
  } catch (err) {
    if (err.message && err.message.includes('UNIQUE constraint failed')) {
      err.status = 409;
      err.message = 'An employee with that email already exists';
    }
    next(err);
  }
});

/**
 * DELETE /api/employees/:id - Deletes an employee record.
 * @param {import('express').Request} req - Express request (params: { id: string })
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Next middleware
 */
router.delete('/:id', (req, res, next) => {
  try {
    const db = getDb();
    const existing = db.prepare('SELECT * FROM employees WHERE id = ?').get(req.params.id);
    if (!existing) {
      const err = new Error('Employee not found');
      err.status = 404;
      return next(err);
    }
    db.prepare('DELETE FROM employees WHERE id = ?').run(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
