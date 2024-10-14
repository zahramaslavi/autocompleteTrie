import React from 'react';
import { render } from '@testing-library/react';
import App from "../src/app";

test('renders Hello component with the name prop', () => {
  const { getByText } = render(<App />);
  const element = getByText(/Autocomplete using trie in the back-end, with Redis/i);
  expect(element).toBeInTheDocument();
});