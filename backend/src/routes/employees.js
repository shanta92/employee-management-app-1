const express = require('express');
const router = express.Router();
const { getDb } = require('../db');

// GET /api/employees - list all, optional ?department=X filter
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

// GET /api/employees/:id - get single employee
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

// POST /api/employees - create employee
router.post('/', (req, res, next) => {
  try {
    const { name, email, department, role, hire_date } = req.body;
    if (!name || !email || !department || !role || !hire_date) {
      const err = new Error('Missing required fields: name, email, department, role, hire_date');
      err.status = 400;
      return next(err);
    }
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

// PUT /api/employees/:id - update employee
router.put('/:id', (req, res, next) => {
  try {
    const db = getDb();
    const existing = db.prepare('SELECT * FROM employees WHERE id = ?').get(req.params.id);
    if (!existing) {
      const err = new Error('Employee not found');
      err.status = 404;
      return next(err);
    }
    const { name, email, department, role, hire_date } = req.body;
    if (!name || !email || !department || !role || !hire_date) {
      const err = new Error('Missing required fields: name, email, department, role, hire_date');
      err.status = 400;
      return next(err);
    }
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

// DELETE /api/employees/:id - delete employee
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
