import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import MockTheme from 'src/util/MockTheme';
import MainLayout from './MainLayout';

describe('Main layout', () => {
  it('renders header and children', () => {
    render(
      <MockTheme>
        <MainLayout>
          <h1>Home</h1>
        </MainLayout>
      </MockTheme>,
    );

    const logo = screen.getByAltText('logo');
    expect(logo).toBeInTheDocument();

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
  });
});
