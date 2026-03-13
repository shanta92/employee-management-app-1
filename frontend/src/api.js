import axios from 'axios';

const BASE = '/api/employees';

/**
 * Fetches the list of employees, optionally filtered by department.
 * @param {string} [department] - Department name to filter by
 * @returns {Promise<Array<Object>>} Array of employee objects
 *
 * @example
 * const allEmployees = await getEmployees();
 * const engineers = await getEmployees('Engineering');
 */
export async function getEmployees(department) {
  const params = department ? { department } : {};
  const response = await axios.get(BASE, { params });
  return response.data;
}

/**
 * Fetches a single employee by ID.
 * @param {number} id - The employee ID
 * @returns {Promise<Object>} The employee object
 *
 * @example
 * const employee = await getEmployee(1);
 */
export async function getEmployee(id) {
  const response = await axios.get(`${BASE}/${id}`);
  return response.data;
}

/**
 * Creates a new employee record.
 * @param {Object} data - The employee data
 * @param {string} data.name - Full name
 * @param {string} data.email - Email address
 * @param {string} data.department - Department name
 * @param {string} data.role - Job role
 * @param {string} data.hire_date - Hire date (YYYY-MM-DD)
 * @returns {Promise<Object>} The created employee object
 *
 * @example
 * const newEmployee = await createEmployee({
 *   name: 'Alice Smith',
 *   email: 'alice@company.com',
 *   department: 'Engineering',
 *   role: 'Senior Engineer',
 *   hire_date: '2024-01-15',
 * });
 */
export async function createEmployee(data) {
  const response = await axios.post(BASE, data);
  return response.data;
}

/**
 * Updates an existing employee record.
 * @param {number} id - The employee ID
 * @param {Object} data - The updated employee data
 * @param {string} data.name - Full name
 * @param {string} data.email - Email address
 * @param {string} data.department - Department name
 * @param {string} data.role - Job role
 * @param {string} data.hire_date - Hire date (YYYY-MM-DD)
 * @returns {Promise<Object>} The updated employee object
 *
 * @example
 * const updated = await updateEmployee(1, { ...employee, role: 'Lead Engineer' });
 */
export async function updateEmployee(id, data) {
  const response = await axios.put(`${BASE}/${id}`, data);
  return response.data;
}

/**
 * Deletes an employee record.
 * @param {number} id - The employee ID
 * @returns {Promise<void>}
 *
 * @example
 * await deleteEmployee(1);
 */
export async function deleteEmployee(id) {
  await axios.delete(`${BASE}/${id}`);
}
