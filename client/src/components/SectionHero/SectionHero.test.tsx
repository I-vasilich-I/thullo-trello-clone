import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import MockTheme from 'src/util/MockTheme';
import SectionHero from './SectionHero';

describe('SectionHero', () => {
  it('renders a heading', () => {
    render(
      <MockTheme>
        <SectionHero />
      </MockTheme>,
    );

    const heading = screen.getByText(/Thullo helps teams move work forward./);
    expect(heading).toBeInTheDocument();

    const h2 = screen.getByRole('heading', { level: 2 });
    expect(h2).toBeInTheDocument();
  });

  it('renders a paragraph', () => {
    render(
      <MockTheme>
        <SectionHero />
      </MockTheme>,
    );

    const p = screen.getByText('Collaborate,', { exact: false });
    expect(p).toBeInTheDocument();
  });

  it('renders an image', () => {
    render(
      <MockTheme>
        <SectionHero />
      </MockTheme>,
    );

    const img = screen.getByAltText('hero');
    expect(img).toBeInTheDocument();
  });

  it('renders hero section unchanged', () => {
    const { container } = render(
      <MockTheme>
        <SectionHero />
      </MockTheme>,
    );

    expect(container).toMatchSnapshot();
  });
});
