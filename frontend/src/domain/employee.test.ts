import { validateEmployeeInput, VALID_DEPARTMENTS } from './employee';

describe('validateEmployeeInput', () => {
  const validInput = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    department: 'Engineering',
    role: 'Developer',
    hire_date: '2024-01-15',
  };

  it('should return no errors for valid input', () => {
    const errors = validateEmployeeInput(validInput);
    expect(errors).toHaveLength(0);
  });

  it('should reject missing name', () => {
    const errors = validateEmployeeInput({ ...validInput, name: '' });
    expect(errors).toContain('Name is required');
  });

  it('should reject missing email', () => {
    const errors = validateEmployeeInput({ ...validInput, email: '' });
    expect(errors).toContain('Email is required');
  });

  it('should reject invalid email', () => {
    const errors = validateEmployeeInput({ ...validInput, email: 'bad-email' });
    expect(errors).toContain('Email must be a valid email address');
  });

  it('should reject invalid department', () => {
    const errors = validateEmployeeInput({ ...validInput, department: 'InvalidDept' });
    expect(errors).toContain('Invalid department');
  });

  it('should accept all valid departments', () => {
    for (const dept of VALID_DEPARTMENTS) {
      const errors = validateEmployeeInput({ ...validInput, department: dept });
      expect(errors).toHaveLength(0);
    }
  });

  it('should reject missing role', () => {
    const errors = validateEmployeeInput({ ...validInput, role: '' });
    expect(errors).toContain('Role is required');
  });

  it('should reject missing hire_date', () => {
    const errors = validateEmployeeInput({ ...validInput, hire_date: '' });
    expect(errors).toContain('Hire date is required');
  });

  it('should return multiple errors for empty input', () => {
    const errors = validateEmployeeInput({});
    expect(errors.length).toBeGreaterThanOrEqual(5);
  });
});
