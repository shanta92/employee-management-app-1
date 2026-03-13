import React, { useState, useEffect, useCallback } from 'react';
import EmployeeTable from './components/EmployeeTable';
import EmployeeForm from './components/EmployeeForm';
import PomodoroTimer from './components/PomodoroTimer';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from './api';
import './App.css';
import './PomodoroTimer.css';

const DEPARTMENTS = ['', 'Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];

export default function App() {
  const [activeView, setActiveView] = useState('employees');
  const [employees, setEmployees] = useState([]);
  const [filterDept, setFilterDept] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const loadEmployees = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getEmployees(filterDept || undefined);
      setEmployees(data);
    } catch (e) {
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

  const handleEdit = (emp) => {
    setEditingEmployee(emp);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
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
      const msg = e.response?.data?.error || 'Failed to save employee';
      throw new Error(msg);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingEmployee(null);
  };

  const handleDeleteRequest = (emp) => {
    setDeleteConfirm(emp);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteEmployee(deleteConfirm.id);
      setDeleteConfirm(null);
      await loadEmployees();
    } catch (e) {
      setError('Failed to delete employee');
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Employee Management</h1>
        <nav className="app-nav">
          <button
            className={`nav-tab ${activeView === 'employees' ? 'active' : ''}`}
            onClick={() => setActiveView('employees')}
          >
            👥 Employees
          </button>
          <button
            className={`nav-tab ${activeView === 'pomodoro' ? 'active' : ''}`}
            onClick={() => setActiveView('pomodoro')}
          >
            🍅 Pomodoro
          </button>
        </nav>
      </header>

      <main className="app-main">
        {activeView === 'employees' ? (
          <>
            <div className="toolbar">
              <div className="filter-group">
                <label htmlFor="deptFilter">Filter by Department:</label>
                <select
                  id="deptFilter"
                  value={filterDept}
                  onChange={e => setFilterDept(e.target.value)}
                >
                  {DEPARTMENTS.map(d => (
                    <option key={d} value={d}>{d || 'All Departments'}</option>
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
          </>
        ) : (
          <PomodoroTimer />
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
            <p>Are you sure you want to delete <strong>{deleteConfirm.name}</strong>?</p>
            <div className="form-actions">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDeleteConfirm}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
