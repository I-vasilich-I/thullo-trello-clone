import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import MockTheme from 'src/util/MockTheme';
import useMockRouter from 'src/util/useMockRouter';
import SingIn from '.';

describe('Sign in page', () => {
  it('render sign in page unchanged', () => {
    useMockRouter();

    const { container } = render(
      <MockTheme>
        <SingIn />
      </MockTheme>,
    );

    expect(container).toMatchSnapshot();
  });
});
