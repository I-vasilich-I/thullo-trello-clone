import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

describe('Error Boundary', () => {
  test('Error Boundary', () => {
    const ThrowError = () => {
      throw new Error('Test error boundary');
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    );

    const tryAgain = screen.getByText('Try again?');
    expect(tryAgain).toBeVisible();
  });
});
