import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import SignUp from './index';
import MockTheme from 'src/util/MockTheme';
import useMockRouter from 'src/util/useMockRouter';

describe('Sign up page', () => {
  it('renders sign up page unchanged', () => {
    useMockRouter();

    const { container } = render(
      <MockTheme>
        <SignUp />
      </MockTheme>,
    );

    expect(container).toMatchSnapshot();
  });
});
