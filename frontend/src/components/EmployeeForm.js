import React, { useState, useEffect } from 'react';

const DEPARTMENTS = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];

const EMPTY_FORM = {
  name: '',
  email: '',
  department: '',
  role: '',
  hire_date: '',
};

export default function EmployeeForm({ employee, onSubmit, onCancel }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (employee) {
      setForm({
        name: employee.name || '',
        email: employee.email || '',
        department: employee.department || '',
        role: employee.role || '',
        hire_date: employee.hire_date || '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [employee]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.department) errs.department = 'Department is required';
    if (!form.role.trim()) errs.role = 'Role is required';
    if (!form.hire_date) errs.hire_date = 'Hire date is required';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{employee ? 'Edit Employee' : 'Add Employee'}</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className={errors.name ? 'input-error' : ''}
              placeholder="e.g. Alice Smith"
            />
            {errors.name && <span className="error-msg">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className={errors.email ? 'input-error' : ''}
              placeholder="e.g. alice@company.com"
            />
            {errors.email && <span className="error-msg">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="department">Department *</label>
            <select
              id="department"
              name="department"
              value={form.department}
              onChange={handleChange}
              className={errors.department ? 'input-error' : ''}
            >
              <option value="">— Select Department —</option>
              {DEPARTMENTS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            {errors.department && <span className="error-msg">{errors.department}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="role">Role *</label>
            <input
              id="role"
              name="role"
              type="text"
              value={form.role}
              onChange={handleChange}
              className={errors.role ? 'input-error' : ''}
              placeholder="e.g. Senior Engineer"
            />
            {errors.role && <span className="error-msg">{errors.role}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="hire_date">Hire Date *</label>
            <input
              id="hire_date"
              name="hire_date"
              type="date"
              value={form.hire_date}
              onChange={handleChange}
              className={errors.hire_date ? 'input-error' : ''}
            />
            {errors.hire_date && <span className="error-msg">{errors.hire_date}</span>}
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving…' : employee ? 'Update' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
