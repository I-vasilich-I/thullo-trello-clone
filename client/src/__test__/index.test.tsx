import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import Home from '../pages/index';
import MockTheme from '../util/MockTheme';

describe('Home', () => {
  it('renders homepage unchanged', () => {
    const { container } = render(
      <MockTheme>
        <Home />
      </MockTheme>,
    );

    expect(container).toMatchSnapshot();
  });
});
