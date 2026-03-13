import request from 'supertest';
import app from '../src/server';
import { initDb, closeDb } from '../src/db';

beforeAll(() => {
  initDb(':memory:');
});

afterAll(() => {
  closeDb();
});

describe('GET /health', () => {
  it('should return ok status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

describe('Employee API', () => {
  const validEmployee = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    department: 'Engineering',
    role: 'Developer',
    hire_date: '2024-01-15',
  };

  describe('POST /api/employees', () => {
    it('should create a new employee', async () => {
      const res = await request(app)
        .post('/api/employees')
        .send(validEmployee);

      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Jane Doe');
      expect(res.body.email).toBe('jane@example.com');
      expect(res.body.id).toBeDefined();
    });

    it('should reject invalid input', async () => {
      const res = await request(app)
        .post('/api/employees')
        .send({ name: '' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });

    it('should reject invalid email format', async () => {
      const res = await request(app)
        .post('/api/employees')
        .send({ ...validEmployee, email: 'bad-email' });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('valid email');
    });

    it('should reject invalid department', async () => {
      const res = await request(app)
        .post('/api/employees')
        .send({ ...validEmployee, email: 'unique1@test.com', department: 'InvalidDept' });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Department must be one of');
    });

    it('should reject duplicate email', async () => {
      const res = await request(app)
        .post('/api/employees')
        .send(validEmployee);

      expect(res.status).toBe(409);
      expect(res.body.error).toContain('already exists');
    });
  });

  describe('GET /api/employees', () => {
    it('should list all employees', async () => {
      const res = await request(app).get('/api/employees');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
    });

    it('should filter by department', async () => {
      const res = await request(app).get('/api/employees?department=Engineering');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      for (const emp of res.body) {
        expect(emp.department).toBe('Engineering');
      }
    });
  });

  describe('GET /api/employees/:id', () => {
    it('should return a single employee', async () => {
      const res = await request(app).get('/api/employees/1');
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Jane Doe');
    });

    it('should return 404 for non-existent employee', async () => {
      const res = await request(app).get('/api/employees/9999');
      expect(res.status).toBe(404);
      expect(res.body.error).toContain('not found');
    });
  });

  describe('PUT /api/employees/:id', () => {
    it('should update an employee', async () => {
      const res = await request(app)
        .put('/api/employees/1')
        .send({ ...validEmployee, role: 'Senior Developer' });

      expect(res.status).toBe(200);
      expect(res.body.role).toBe('Senior Developer');
    });

    it('should reject invalid input on update', async () => {
      const res = await request(app)
        .put('/api/employees/1')
        .send({ name: '' });

      expect(res.status).toBe(400);
    });

    it('should return 404 for non-existent employee', async () => {
      const res = await request(app)
        .put('/api/employees/9999')
        .send(validEmployee);

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/employees/:id', () => {
    it('should delete an employee', async () => {
      const res = await request(app).delete('/api/employees/1');
      expect(res.status).toBe(204);
    });

    it('should return 404 for non-existent employee', async () => {
      const res = await request(app).delete('/api/employees/9999');
      expect(res.status).toBe(404);
    });
  });
});
