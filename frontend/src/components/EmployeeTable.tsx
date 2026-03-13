/**
 * EmployeeTable component.
 * Displays a sortable table of employee records with edit and delete actions.
 *
 * @module components/EmployeeTable
 *
 * @example
 * ```tsx
 * <EmployeeTable
 *   employees={employees}
 *   onEdit={(emp) => handleEdit(emp)}
 *   onDelete={(emp) => handleDelete(emp)}
 * />
 * ```
 */

import React, { useState } from 'react';
import { Employee } from '../domain/employee';

interface EmployeeTableProps {
  /** Array of employees to display. */
  employees: Employee[];
  /** Callback when edit is clicked for an employee. */
  onEdit: (employee: Employee) => void;
  /** Callback when delete is clicked for an employee. */
  onDelete: (employee: Employee) => void;
}

type SortField = 'name' | 'email' | 'department' | 'role' | 'hire_date';

/**
 * Renders a table of employees with sortable columns.
 *
 * @param props - The component props
 * @returns The rendered employee table
 */
const EmployeeTable: React.FC<EmployeeTableProps> = ({ employees, onEdit, onDelete }) => {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sorted = [...employees].sort((a, b) => {
    const aVal = a[sortField] || '';
    const bVal = b[sortField] || '';
    const cmp = aVal.localeCompare(bVal);
    return sortAsc ? cmp : -cmp;
  });

  const sortIndicator = (field: SortField) =>
    sortField === field ? (sortAsc ? ' ▲' : ' ▼') : '';

  if (employees.length === 0) {
    return <p className="empty-message">No employees found.</p>;
  }

  return (
    <table className="employee-table">
      <thead>
        <tr>
          <th onClick={() => handleSort('name')}>Name{sortIndicator('name')}</th>
          <th onClick={() => handleSort('email')}>Email{sortIndicator('email')}</th>
          <th onClick={() => handleSort('department')}>Department{sortIndicator('department')}</th>
          <th onClick={() => handleSort('role')}>Role{sortIndicator('role')}</th>
          <th onClick={() => handleSort('hire_date')}>Hire Date{sortIndicator('hire_date')}</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((emp) => (
          <tr key={emp.id}>
            <td>{emp.name}</td>
            <td>{emp.email}</td>
            <td>{emp.department}</td>
            <td>{emp.role}</td>
            <td>{emp.hire_date}</td>
            <td>
              <button className="btn btn-sm" onClick={() => onEdit(emp)}>Edit</button>
              <button className="btn btn-sm btn-danger" onClick={() => onDelete(emp)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EmployeeTable;
