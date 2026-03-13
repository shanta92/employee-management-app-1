/**
 * Employee domain types and validation logic for the frontend.
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

/** Represents an employee record from the API. */
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

/** Regular expression for validating email addresses. */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates employee form input on the client side.
 *
 * @param input - The employee form data to validate
 * @returns An array of error messages, empty if valid
 *
 * @example
 * ```typescript
 * const errors = validateEmployeeInput({
 *   name: 'Jane Doe',
 *   email: 'jane@example.com',
 *   department: 'Engineering',
 *   role: 'Developer',
 *   hire_date: '2024-01-15',
 * });
 * // errors.length === 0
 * ```
 */
export function validateEmployeeInput(input: Partial<EmployeeInput>): string[] {
  const errors: string[] = [];

  if (!input.name?.trim()) {
    errors.push('Name is required');
  }

  if (!input.email?.trim()) {
    errors.push('Email is required');
  } else if (!EMAIL_REGEX.test(input.email)) {
    errors.push('Email must be a valid email address');
  }

  if (!input.department) {
    errors.push('Department is required');
  } else if (!VALID_DEPARTMENTS.includes(input.department as Department)) {
    errors.push('Invalid department');
  }

  if (!input.role?.trim()) {
    errors.push('Role is required');
  }

  if (!input.hire_date) {
    errors.push('Hire date is required');
  }

  return errors;
}
