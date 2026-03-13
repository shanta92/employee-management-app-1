import React from 'react';

/**
 * Displays a table of employees with edit and delete actions.
 *
 * @param {Object} props
 * @param {Array<Object>} props.employees - Array of employee objects to display
 * @param {Function} props.onEdit - Callback invoked with the employee object when Edit is clicked
 * @param {Function} props.onDelete - Callback invoked with the employee object when Delete is clicked
 * @returns {React.ReactElement} The rendered employee table or empty state message
 *
 * @example
 * <EmployeeTable
 *   employees={[{ id: 1, name: 'Alice', email: 'alice@co.com', department: 'Engineering', role: 'Dev', hire_date: '2024-01-01' }]}
 *   onEdit={(emp) => console.log('Edit', emp)}
 *   onDelete={(emp) => console.log('Delete', emp)}
 * />
 */
export default function EmployeeTable({ employees, onEdit, onDelete }) {
  if (employees.length === 0) {
    return <p className="empty-state">No employees found.</p>;
  }

  return (
    <div className="table-wrapper">
      <table className="employee-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Role</th>
            <th>Hire Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.id}>
              <td>{emp.id}</td>
              <td>{emp.name}</td>
              <td><a href={`mailto:${emp.email}`}>{emp.email}</a></td>
              <td>
                <span className={`dept-badge dept-${emp.department.toLowerCase().replace(/\s+/g, '-')}`}>
                  {emp.department}
                </span>
              </td>
              <td>{emp.role}</td>
              <td>{emp.hire_date}</td>
              <td className="actions">
                <button className="btn btn-sm btn-edit" onClick={() => onEdit(emp)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => onDelete(emp)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
