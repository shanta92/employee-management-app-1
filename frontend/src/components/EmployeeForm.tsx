/**
 * EmployeeForm component.
 * A modal form for creating or editing employee records with client-side validation.
 *
 * @module components/EmployeeForm
 *
 * @example
 * ```tsx
 * // Create new employee
 * <EmployeeForm onSubmit={handleSubmit} onCancel={handleCancel} />
 *
 * // Edit existing employee
 * <EmployeeForm
 *   employee={selectedEmployee}
 *   onSubmit={handleSubmit}
 *   onCancel={handleCancel}
 * />
 * ```
 */

import React, { useState } from 'react';
import { Employee, EmployeeInput, VALID_DEPARTMENTS, validateEmployeeInput } from '../domain/employee';

interface EmployeeFormProps {
  /** Optional employee to edit. If not provided, form creates a new employee. */
  employee?: Employee | null;
  /** Callback when form is submitted with valid data. */
  onSubmit: (data: EmployeeInput) => Promise<void>;
  /** Callback when form is cancelled. */
  onCancel: () => void;
}

/**
 * Renders a modal form for creating or editing an employee.
 * Validates all input before submission.
 *
 * @param props - The component props
 * @returns The rendered employee form modal
 */
const EmployeeForm: React.FC<EmployeeFormProps> = ({ employee, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<EmployeeInput>({
    name: employee?.name || '',
    email: employee?.email || '',
    department: employee?.department || '',
    role: employee?.role || '',
    hire_date: employee?.hire_date || '',
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateEmployeeInput(formData);

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    setSubmitting(true);

    try {
      await onSubmit(formData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save employee';
      setErrors([message]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{employee ? 'Edit Employee' : 'Add Employee'}</h2>
        <form onSubmit={handleSubmit}>
          {errors.length > 0 && (
            <div className="alert alert-error">
              {errors.map((err, i) => (
                <p key={i}>{err}</p>
              ))}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="department">Department</label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            >
              <option value="">Select Department</option>
              {VALID_DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <input
              id="role"
              name="role"
              type="text"
              value={formData.role}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="hire_date">Hire Date</label>
            <input
              id="hire_date"
              name="hire_date"
              type="date"
              value={formData.hire_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
