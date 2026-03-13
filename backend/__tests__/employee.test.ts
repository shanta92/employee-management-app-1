import { validateEmployee, VALID_DEPARTMENTS } from '../src/domain/employee';

describe('validateEmployee', () => {
  const validInput = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    department: 'Engineering',
    role: 'Developer',
    hire_date: '2024-01-15',
  };

  it('should accept valid employee input', () => {
    const result = validateEmployee(validInput);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject missing name', () => {
    const result = validateEmployee({ ...validInput, name: '' });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Name is required');
  });

  it('should reject missing email', () => {
    const result = validateEmployee({ ...validInput, email: '' });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Email is required');
  });

  it('should reject invalid email format', () => {
    const result = validateEmployee({ ...validInput, email: 'not-an-email' });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Email must be a valid email address');
  });

  it('should reject invalid department', () => {
    const result = validateEmployee({ ...validInput, department: 'InvalidDept' });
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain('Department must be one of');
  });

  it('should accept all valid departments', () => {
    for (const dept of VALID_DEPARTMENTS) {
      const result = validateEmployee({ ...validInput, department: dept });
      expect(result.valid).toBe(true);
    }
  });

  it('should reject missing role', () => {
    const result = validateEmployee({ ...validInput, role: '' });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Role is required');
  });

  it('should reject missing hire_date', () => {
    const result = validateEmployee({ ...validInput, hire_date: '' });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Hire date is required');
  });

  it('should reject invalid hire_date format', () => {
    const result = validateEmployee({ ...validInput, hire_date: '01-15-2024' });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Hire date must be in YYYY-MM-DD format');
  });

  it('should return multiple errors for multiple invalid fields', () => {
    const result = validateEmployee({});
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(5);
  });

  it('should reject non-string name', () => {
    const result = validateEmployee({ ...validInput, name: 123 as unknown as string });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Name is required');
  });
});
