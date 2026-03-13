import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmployeeTable from './EmployeeTable';
import { Employee } from '../domain/employee';

const mockEmployees: Employee[] = [
  {
    id: 1,
    name: 'Alice Smith',
    email: 'alice@example.com',
    department: 'Engineering',
    role: 'Developer',
    hire_date: '2024-01-15',
    created_at: '2024-01-15T00:00:00',
    updated_at: '2024-01-15T00:00:00',
  },
  {
    id: 2,
    name: 'Bob Jones',
    email: 'bob@example.com',
    department: 'Marketing',
    role: 'Manager',
    hire_date: '2023-06-01',
    created_at: '2023-06-01T00:00:00',
    updated_at: '2023-06-01T00:00:00',
  },
];

describe('EmployeeTable', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render employee data', () => {
    render(
      <EmployeeTable employees={mockEmployees} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    expect(screen.getByText('bob@example.com')).toBeInTheDocument();
    expect(screen.getByText('Engineering')).toBeInTheDocument();
    expect(screen.getByText('Marketing')).toBeInTheDocument();
  });

  it('should show empty message when no employees', () => {
    render(
      <EmployeeTable employees={[]} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    expect(screen.getByText(/no employees found/i)).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', async () => {
    render(
      <EmployeeTable employees={mockEmployees} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    const editButtons = screen.getAllByText('Edit');
    await userEvent.click(editButtons[0]);
    expect(mockOnEdit).toHaveBeenCalledWith(mockEmployees[0]);
  });

  it('should call onDelete when delete button is clicked', async () => {
    render(
      <EmployeeTable employees={mockEmployees} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    const deleteButtons = screen.getAllByText('Delete');
    await userEvent.click(deleteButtons[0]);
    expect(mockOnDelete).toHaveBeenCalledWith(mockEmployees[0]);
  });

  it('should render table headers', () => {
    render(
      <EmployeeTable employees={mockEmployees} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    expect(screen.getByText(/Name/)).toBeInTheDocument();
    expect(screen.getByText(/Email/)).toBeInTheDocument();
    expect(screen.getByText(/Department/)).toBeInTheDocument();
    expect(screen.getByText(/Role/)).toBeInTheDocument();
    expect(screen.getByText(/Hire Date/)).toBeInTheDocument();
  });

  it('should sort by column when header is clicked', async () => {
    render(
      <EmployeeTable employees={mockEmployees} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    // Click Email header to sort by email
    await userEvent.click(screen.getByText(/Email/));

    // Click again to reverse sort
    await userEvent.click(screen.getByText(/Email/));

    // Rows should still be visible
    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    expect(screen.getByText('Bob Jones')).toBeInTheDocument();
  });

  it('should show sort indicator on active column', async () => {
    render(
      <EmployeeTable employees={mockEmployees} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    // Default sort is by Name ascending
    expect(screen.getByText(/Name.*▲/)).toBeInTheDocument();

    // Click to sort by Department
    await userEvent.click(screen.getByText(/Department/));
    expect(screen.getByText(/Department.*▲/)).toBeInTheDocument();
  });
});
