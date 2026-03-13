import { render, screen } from '@testing-library/react';
import EmployeeTable from './EmployeeTable';

const mockEmployees = [
  {
    id: 1,
    name: 'Alice Smith',
    email: 'alice@example.com',
    department: 'Engineering',
    role: 'Developer',
    hire_date: '2024-01-15',
  },
  {
    id: 2,
    name: 'Bob Jones',
    email: 'bob@example.com',
    department: 'Sales',
    role: 'Manager',
    hire_date: '2024-02-01',
  },
];

describe('EmployeeTable', () => {
  it('renders empty state when no employees', () => {
    render(<EmployeeTable employees={[]} onEdit={jest.fn()} onDelete={jest.fn()} />);
    expect(screen.getByText(/no employees found/i)).toBeInTheDocument();
  });

  it('renders employee rows', () => {
    render(<EmployeeTable employees={mockEmployees} onEdit={jest.fn()} onDelete={jest.fn()} />);
    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    expect(screen.getByText('Bob Jones')).toBeInTheDocument();
  });

  it('renders all column headers', () => {
    render(<EmployeeTable employees={mockEmployees} onEdit={jest.fn()} onDelete={jest.fn()} />);
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Department')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
    expect(screen.getByText('Hire Date')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('calls onEdit when Edit button is clicked', () => {
    const onEdit = jest.fn();
    render(<EmployeeTable employees={mockEmployees} onEdit={onEdit} onDelete={jest.fn()} />);
    const editButtons = screen.getAllByText('Edit');
    editButtons[0].click();
    expect(onEdit).toHaveBeenCalledWith(mockEmployees[0]);
  });

  it('calls onDelete when Delete button is clicked', () => {
    const onDelete = jest.fn();
    render(<EmployeeTable employees={mockEmployees} onEdit={jest.fn()} onDelete={onDelete} />);
    const deleteButtons = screen.getAllByText('Delete');
    deleteButtons[0].click();
    expect(onDelete).toHaveBeenCalledWith(mockEmployees[0]);
  });

  it('renders employee email as a mailto link', () => {
    render(<EmployeeTable employees={mockEmployees} onEdit={jest.fn()} onDelete={jest.fn()} />);
    const emailLink = screen.getByText('alice@example.com');
    expect(emailLink.closest('a')).toHaveAttribute('href', 'mailto:alice@example.com');
  });
});
