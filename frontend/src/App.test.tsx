import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Employee Management heading', () => {
  render(<App />);
  const heading = screen.getByText(/employee management/i);
  expect(heading).toBeInTheDocument();
});

test('renders Add Employee button', () => {
  render(<App />);
  const button = screen.getByText(/add employee/i);
  expect(button).toBeInTheDocument();
});

test('renders department filter', () => {
  render(<App />);
  const filter = screen.getByLabelText(/filter by department/i);
  expect(filter).toBeInTheDocument();
});
