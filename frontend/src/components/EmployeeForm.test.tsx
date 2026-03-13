import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmployeeForm from './EmployeeForm';
import { Employee } from '../domain/employee';

describe('EmployeeForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnSubmit.mockResolvedValue(undefined);
  });

  it('should render add form when no employee is provided', () => {
    render(<EmployeeForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    expect(screen.getByText('Add Employee')).toBeInTheDocument();
  });

  it('should render edit form when employee is provided', () => {
    const employee: Employee = {
      id: 1,
      name: 'Jane Doe',
      email: 'jane@example.com',
      department: 'Engineering',
      role: 'Developer',
      hire_date: '2024-01-15',
      created_at: '2024-01-15T00:00:00',
      updated_at: '2024-01-15T00:00:00',
    };

    render(
      <EmployeeForm employee={employee} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    expect(screen.getByText('Edit Employee')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Jane Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('jane@example.com')).toBeInTheDocument();
  });

  it('should call onCancel when cancel button is clicked', async () => {
    render(<EmployeeForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await userEvent.click(screen.getByText('Cancel'));
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('should show validation errors for empty form submission', async () => {
    render(<EmployeeForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await userEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should submit valid form data', async () => {
    render(<EmployeeForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await userEvent.type(screen.getByLabelText('Name'), 'Jane Doe');
    await userEvent.type(screen.getByLabelText('Email'), 'jane@example.com');
    await userEvent.selectOptions(screen.getByLabelText('Department'), 'Engineering');
    await userEvent.type(screen.getByLabelText('Role'), 'Developer');
    await userEvent.type(screen.getByLabelText('Hire Date'), '2024-01-15');

    await userEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Jane Doe',
        email: 'jane@example.com',
        department: 'Engineering',
        role: 'Developer',
        hire_date: '2024-01-15',
      });
    });
  });

  it('should show server error on submit failure', async () => {
    mockOnSubmit.mockRejectedValue(new Error('Server error'));

    render(<EmployeeForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await userEvent.type(screen.getByLabelText('Name'), 'Jane Doe');
    await userEvent.type(screen.getByLabelText('Email'), 'jane@example.com');
    await userEvent.selectOptions(screen.getByLabelText('Department'), 'Engineering');
    await userEvent.type(screen.getByLabelText('Role'), 'Developer');
    await userEvent.type(screen.getByLabelText('Hire Date'), '2024-01-15');

    await userEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(screen.getByText('Server error')).toBeInTheDocument();
    });
  });

  it('should render all department options', () => {
    render(<EmployeeForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByText('Select Department')).toBeInTheDocument();
    expect(screen.getByText('Engineering')).toBeInTheDocument();
    expect(screen.getByText('Marketing')).toBeInTheDocument();
    expect(screen.getByText('Sales')).toBeInTheDocument();
    expect(screen.getByText('HR')).toBeInTheDocument();
    expect(screen.getByText('Finance')).toBeInTheDocument();
    expect(screen.getByText('Operations')).toBeInTheDocument();
  });

  it('should show email validation error for invalid email', async () => {
    render(<EmployeeForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await userEvent.type(screen.getByLabelText('Name'), 'Jane');
    await userEvent.type(screen.getByLabelText('Email'), 'bad-email');
    await userEvent.selectOptions(screen.getByLabelText('Department'), 'Engineering');
    await userEvent.type(screen.getByLabelText('Role'), 'Developer');
    await userEvent.type(screen.getByLabelText('Hire Date'), '2024-01-15');

    await userEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(screen.getByText('Email must be a valid email address')).toBeInTheDocument();
    });
  });
});
