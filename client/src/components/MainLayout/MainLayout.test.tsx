import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import MockTheme from 'src/util/MockTheme';
import MainLayout from './MainLayout';

describe('Main layout', () => {
  it('renders header and children', () => {
    render(
      <MockTheme>
        <MainLayout>
          <h2>Home</h2>
        </MainLayout>
      </MockTheme>,
    );

    const logo = screen.getByAltText('logo');
    expect(logo).toBeInTheDocument();

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
  });
});
