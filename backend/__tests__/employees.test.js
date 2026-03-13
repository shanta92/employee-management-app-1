const request = require('supertest');
const app = require('../src/server');
const { getDb } = require('../src/db');

let db;

beforeAll(() => {
  db = getDb();
});

afterAll(() => {
  db.close();
});

beforeEach(() => {
  db.exec('DELETE FROM employees');
});

describe('GET /api/employees', () => {
  it('should return an empty array when no employees exist', async () => {
    const res = await request(app).get('/api/employees');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('should return all employees', async () => {
    db.prepare(
      'INSERT INTO employees (name, email, department, role, hire_date) VALUES (?, ?, ?, ?, ?)'
    ).run('Alice Smith', 'alice@example.com', 'Engineering', 'Developer', '2024-01-15');

    const res = await request(app).get('/api/employees');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].name).toBe('Alice Smith');
  });

  it('should filter employees by department', async () => {
    db.prepare(
      'INSERT INTO employees (name, email, department, role, hire_date) VALUES (?, ?, ?, ?, ?)'
    ).run('Alice', 'alice@example.com', 'Engineering', 'Developer', '2024-01-15');
    db.prepare(
      'INSERT INTO employees (name, email, department, role, hire_date) VALUES (?, ?, ?, ?, ?)'
    ).run('Bob', 'bob@example.com', 'Sales', 'Manager', '2024-02-01');

    const res = await request(app).get('/api/employees?department=Engineering');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].name).toBe('Alice');
  });
});

describe('GET /api/employees/:id', () => {
  it('should return a single employee', async () => {
    const result = db.prepare(
      'INSERT INTO employees (name, email, department, role, hire_date) VALUES (?, ?, ?, ?, ?)'
    ).run('Alice', 'alice@example.com', 'Engineering', 'Developer', '2024-01-15');

    const res = await request(app).get(`/api/employees/${result.lastInsertRowid}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Alice');
  });

  it('should return 404 for non-existent employee', async () => {
    const res = await request(app).get('/api/employees/9999');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Employee not found');
  });
});

describe('POST /api/employees', () => {
  const validEmployee = {
    name: 'Alice Smith',
    email: 'alice@example.com',
    department: 'Engineering',
    role: 'Developer',
    hire_date: '2024-01-15',
  };

  it('should create a new employee', async () => {
    const res = await request(app).post('/api/employees').send(validEmployee);
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Alice Smith');
    expect(res.body.id).toBeDefined();
  });

  it('should return 400 when required fields are missing', async () => {
    const res = await request(app).post('/api/employees').send({ name: 'Alice' });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Missing required fields');
  });

  it('should return 400 for invalid email format', async () => {
    const res = await request(app)
      .post('/api/employees')
      .send({ ...validEmployee, email: 'not-an-email' });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Invalid email format');
  });

  it('should return 400 for invalid department', async () => {
    const res = await request(app)
      .post('/api/employees')
      .send({ ...validEmployee, department: 'InvalidDept' });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Invalid department');
  });

  it('should return 409 for duplicate email', async () => {
    await request(app).post('/api/employees').send(validEmployee);
    const res = await request(app).post('/api/employees').send(validEmployee);
    expect(res.status).toBe(409);
    expect(res.body.error).toContain('email already exists');
  });
});

describe('PUT /api/employees/:id', () => {
  let employeeId;

  beforeEach(async () => {
    const result = db.prepare(
      'INSERT INTO employees (name, email, department, role, hire_date) VALUES (?, ?, ?, ?, ?)'
    ).run('Alice', 'alice@example.com', 'Engineering', 'Developer', '2024-01-15');
    employeeId = result.lastInsertRowid;
  });

  it('should update an existing employee', async () => {
    const res = await request(app).put(`/api/employees/${employeeId}`).send({
      name: 'Alice Updated',
      email: 'alice@example.com',
      department: 'Engineering',
      role: 'Senior Developer',
      hire_date: '2024-01-15',
    });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Alice Updated');
    expect(res.body.role).toBe('Senior Developer');
  });

  it('should return 404 for non-existent employee', async () => {
    const res = await request(app).put('/api/employees/9999').send({
      name: 'Nobody',
      email: 'nobody@example.com',
      department: 'Engineering',
      role: 'Developer',
      hire_date: '2024-01-15',
    });
    expect(res.status).toBe(404);
  });

  it('should return 400 for invalid email format', async () => {
    const res = await request(app).put(`/api/employees/${employeeId}`).send({
      name: 'Alice',
      email: 'bad-email',
      department: 'Engineering',
      role: 'Developer',
      hire_date: '2024-01-15',
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Invalid email format');
  });

  it('should return 400 when required fields are missing', async () => {
    const res = await request(app).put(`/api/employees/${employeeId}`).send({ name: 'Alice' });
    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/employees/:id', () => {
  it('should delete an existing employee', async () => {
    const result = db.prepare(
      'INSERT INTO employees (name, email, department, role, hire_date) VALUES (?, ?, ?, ?, ?)'
    ).run('Alice', 'alice@example.com', 'Engineering', 'Developer', '2024-01-15');

    const res = await request(app).delete(`/api/employees/${result.lastInsertRowid}`);
    expect(res.status).toBe(204);

    const check = db.prepare('SELECT * FROM employees WHERE id = ?').get(result.lastInsertRowid);
    expect(check).toBeUndefined();
  });

  it('should return 404 for non-existent employee', async () => {
    const res = await request(app).delete('/api/employees/9999');
    expect(res.status).toBe(404);
  });
});

describe('GET /health', () => {
  it('should return ok status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});
