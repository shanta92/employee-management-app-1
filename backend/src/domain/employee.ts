/**
 * Employee domain types and validation logic.
 * @module domain/employee
 */

/** Valid department values for employees. */
export const VALID_DEPARTMENTS = [
  'Engineering',
  'Marketing',
  'Sales',
  'HR',
  'Finance',
  'Operations',
] as const;

export type Department = typeof VALID_DEPARTMENTS[number];

/** Represents an employee record. */
export interface Employee {
  id: number;
  name: string;
  email: string;
  department: Department;
  role: string;
  hire_date: string;
  created_at: string;
  updated_at: string;
}

/** Input data for creating or updating an employee. */
export interface EmployeeInput {
  name: string;
  email: string;
  department: string;
  role: string;
  hire_date: string;
}

/** Result of input validation. */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/** Regular expression for validating email addresses. */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Regular expression for validating date format (YYYY-MM-DD). */
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Validates employee input data.
 * Checks required fields, email format, department whitelist, and date format.
 *
 * @param input - The employee data to validate
 * @returns A validation result indicating whether the input is valid and any errors
 *
 * @example
 * ```typescript
 * const result = validateEmployee({
 *   name: 'Jane Doe',
 *   email: 'jane@example.com',
 *   department: 'Engineering',
 *   role: 'Developer',
 *   hire_date: '2024-01-15',
 * });
 * // result.valid === true
 * ```
 */
export function validateEmployee(input: Partial<EmployeeInput>): ValidationResult {
  const errors: string[] = [];

  if (!input.name || typeof input.name !== 'string' || input.name.trim().length === 0) {
    errors.push('Name is required');
  }

  if (!input.email || typeof input.email !== 'string') {
    errors.push('Email is required');
  } else if (!EMAIL_REGEX.test(input.email)) {
    errors.push('Email must be a valid email address');
  }

  if (!input.department || typeof input.department !== 'string') {
    errors.push('Department is required');
  } else if (!VALID_DEPARTMENTS.includes(input.department as Department)) {
    errors.push(`Department must be one of: ${VALID_DEPARTMENTS.join(', ')}`);
  }

  if (!input.role || typeof input.role !== 'string' || input.role.trim().length === 0) {
    errors.push('Role is required');
  }

  if (!input.hire_date || typeof input.hire_date !== 'string') {
    errors.push('Hire date is required');
  } else if (!DATE_REGEX.test(input.hire_date)) {
    errors.push('Hire date must be in YYYY-MM-DD format');
  }

  return { valid: errors.length === 0, errors };
}
