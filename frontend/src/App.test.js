import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Employee Management heading', () => {
  render(<App />);
  const heading = screen.getByText(/employee management/i);
  expect(heading).toBeInTheDocument();
});
