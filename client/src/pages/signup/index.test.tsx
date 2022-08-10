import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import SignUp from '.';
import MockTheme from 'src/util/MockTheme';

describe('Sign up page', () => {
  it('renders sign up page unchanged', () => {
    const { container } = render(
      <MockTheme>
        <SignUp />
      </MockTheme>,
    );

    expect(container).toMatchSnapshot();
  });
});
