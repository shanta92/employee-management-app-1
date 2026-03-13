import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmployeeForm from './EmployeeForm';

describe('EmployeeForm', () => {
  const mockOnSubmit = jest.fn().mockResolvedValue(undefined);
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnCancel.mockClear();
  });

  it('renders add form when no employee is provided', () => {
    render(<EmployeeForm employee={null} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    expect(screen.getByText('Add Employee')).toBeInTheDocument();
  });

  it('renders edit form when employee is provided', () => {
    const employee = {
      id: 1,
      name: 'Alice Smith',
      email: 'alice@example.com',
      department: 'Engineering',
      role: 'Developer',
      hire_date: '2024-01-15',
    };
    render(<EmployeeForm employee={employee} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    expect(screen.getByText('Edit Employee')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Alice Smith')).toBeInTheDocument();
  });

  it('calls onCancel when Cancel is clicked', async () => {
    render(<EmployeeForm employee={null} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    const cancelButton = screen.getByText('Cancel');
    await userEvent.click(cancelButton);
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('shows validation errors when submitting empty form', async () => {
    render(<EmployeeForm employee={null} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    const submitButton = screen.getByRole('button', { name: /add employee/i });
    await userEvent.click(submitButton);

    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Department is required')).toBeInTheDocument();
    expect(screen.getByText('Role is required')).toBeInTheDocument();
    expect(screen.getByText('Hire date is required')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('shows invalid email error', async () => {
    render(<EmployeeForm employee={null} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await userEvent.type(screen.getByLabelText(/full name/i), 'Alice');
    await userEvent.type(screen.getByLabelText(/email/i), 'not-an-email');
    await userEvent.selectOptions(screen.getByLabelText(/department/i), 'Engineering');
    await userEvent.type(screen.getByLabelText(/role/i), 'Developer');
    await userEvent.type(screen.getByLabelText(/hire date/i), '2024-01-15');

    const submitButton = screen.getByRole('button', { name: /add employee/i });
    await userEvent.click(submitButton);

    expect(screen.getByText('Invalid email')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits valid form data', async () => {
    render(<EmployeeForm employee={null} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await userEvent.type(screen.getByLabelText(/full name/i), 'Alice Smith');
    await userEvent.type(screen.getByLabelText(/email/i), 'alice@example.com');
    await userEvent.selectOptions(screen.getByLabelText(/department/i), 'Engineering');
    await userEvent.type(screen.getByLabelText(/role/i), 'Developer');
    await userEvent.type(screen.getByLabelText(/hire date/i), '2024-01-15');

    const submitButton = screen.getByRole('button', { name: /add employee/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Alice Smith',
        email: 'alice@example.com',
        department: 'Engineering',
        role: 'Developer',
        hire_date: '2024-01-15',
      });
    });
  });

  it('renders all department options', () => {
    render(<EmployeeForm employee={null} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];
    departments.forEach((dept) => {
      expect(screen.getByText(dept)).toBeInTheDocument();
    });
  });
});
