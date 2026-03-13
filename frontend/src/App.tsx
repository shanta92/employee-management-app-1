/**
 * Main application component.
 * Provides CRUD operations for employee management with filtering and sorting.
 * @module App
 */

import React, { useState, useEffect, useCallback } from 'react';
import EmployeeTable from './components/EmployeeTable';
import EmployeeForm from './components/EmployeeForm';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from './api';
import { Employee, EmployeeInput, VALID_DEPARTMENTS } from './domain/employee';
import './App.css';

const DEPARTMENTS = ['', ...VALID_DEPARTMENTS];

/**
 * Root application component.
 * Manages employee list state, filtering, and CRUD modals.
 */
export default function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filterDept, setFilterDept] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Employee | null>(null);

  /** Loads employees from the API with optional department filter. */
  const loadEmployees = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getEmployees(filterDept || undefined);
      setEmployees(data);
    } catch {
      setError('Failed to load employees. Is the server running?');
    } finally {
      setLoading(false);
    }
  }, [filterDept]);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const handleAdd = () => {
    setEditingEmployee(null);
    setShowForm(true);
  };

  const handleEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData: EmployeeInput) => {
    try {
      if (editingEmployee) {
        await updateEmployee(editingEmployee.id, formData);
      } else {
        await createEmployee(formData);
      }
      setShowForm(false);
      setEditingEmployee(null);
      await loadEmployees();
    } catch (e) {
      const err = e as { response?: { data?: { error?: string } } };
      const msg = err.response?.data?.error || 'Failed to save employee';
      throw new Error(msg);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingEmployee(null);
  };

  const handleDeleteRequest = (emp: Employee) => {
    setDeleteConfirm(emp);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteEmployee(deleteConfirm.id);
      setDeleteConfirm(null);
      await loadEmployees();
    } catch {
      setError('Failed to delete employee');
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Employee Management</h1>
      </header>

      <main className="app-main">
        <div className="toolbar">
          <div className="filter-group">
            <label htmlFor="deptFilter">Filter by Department:</label>
            <select
              id="deptFilter"
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
            >
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d || 'All Departments'}
                </option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary" onClick={handleAdd}>
            + Add Employee
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="loading">Loading…</div>
        ) : (
          <EmployeeTable
            employees={employees}
            onEdit={handleEdit}
            onDelete={handleDeleteRequest}
          />
        )}
      </main>

      {showForm && (
        <EmployeeForm
          employee={editingEmployee}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}

      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal modal-confirm">
            <h2>Delete Employee</h2>
            <p>
              Are you sure you want to delete <strong>{deleteConfirm.name}</strong>?
            </p>
            <div className="form-actions">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDeleteConfirm}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
