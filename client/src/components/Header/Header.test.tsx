import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import MockTheme from 'src/util/MockTheme';
import Header from './Header';

describe('Header', () => {
  let container: HTMLElement;

  beforeEach(() => {
    const elem = render(
      <MockTheme>
        <Header />
      </MockTheme>,
    );

    container = elem.container;
  });

  it('renders links', () => {
    const links = screen.getAllByRole('link');
    expect(links.length).toBe(3);
  });

  it('renders logo', () => {
    const logo = screen.getByAltText('logo');
    expect(logo).toBeInTheDocument();
  });

  it('renders header unchanged', () => {
    expect(container).toMatchSnapshot();
  });
});
