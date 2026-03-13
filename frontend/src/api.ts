/**
 * API service for employee operations.
 * Uses async/await pattern for all HTTP calls.
 * @module api
 */

import axios from 'axios';
import { Employee, EmployeeInput } from './domain/employee';

const API_BASE = '/api/employees';

/**
 * Fetches all employees, optionally filtered by department.
 *
 * @param department - Optional department to filter by
 * @returns Array of employee records
 */
export async function getEmployees(department?: string): Promise<Employee[]> {
  const params = department ? { department } : {};
  const response = await axios.get<Employee[]>(API_BASE, { params });
  return response.data;
}

/**
 * Fetches a single employee by ID.
 *
 * @param id - The employee ID
 * @returns The employee record
 */
export async function getEmployee(id: number): Promise<Employee> {
  const response = await axios.get<Employee>(`${API_BASE}/${id}`);
  return response.data;
}

/**
 * Creates a new employee.
 *
 * @param data - The employee data to create
 * @returns The created employee record
 */
export async function createEmployee(data: EmployeeInput): Promise<Employee> {
  const response = await axios.post<Employee>(API_BASE, data);
  return response.data;
}

/**
 * Updates an existing employee.
 *
 * @param id - The employee ID to update
 * @param data - The updated employee data
 * @returns The updated employee record
 */
export async function updateEmployee(id: number, data: EmployeeInput): Promise<Employee> {
  const response = await axios.put<Employee>(`${API_BASE}/${id}`, data);
  return response.data;
}

/**
 * Deletes an employee.
 *
 * @param id - The employee ID to delete
 */
export async function deleteEmployee(id: number): Promise<void> {
  await axios.delete(`${API_BASE}/${id}`);
}
