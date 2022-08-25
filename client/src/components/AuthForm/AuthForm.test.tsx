import '@testing-library/jest-dom';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import AuthForm from './AuthForm';
import MockTheme from 'src/util/MockTheme';
import useMockRouter from 'src/util/useMockRouter';

describe('Authentication form on sing in page', () => {
  beforeEach(async () => {
    await act(async () => {
      useMockRouter('/signin');

      render(
        <MockTheme>
          <AuthForm />
        </MockTheme>,
      );
    });
  });

  it('renders auth form', () => {
    const form = screen.getByRole('form');
    expect(form).toBeInTheDocument();

    const email = screen.getByRole('textbox');
    expect(email).toBeInTheDocument();
    expect(email).toHaveAttribute('type', 'email');

    const password = screen.getByPlaceholderText('Password');
    expect(password).toBeInTheDocument();
    expect(password).toHaveAttribute('type', 'password');

    const submit = screen.getByRole('button', { name: 'Sign in' });
    expect(submit).toBeInTheDocument();

    expect(form).toHaveFormValues({
      email: '',
      password: '',
    });

    const links = screen.getAllByRole('link');
    expect(links.length).toBe(6);
  });

  it('change email value on change event', async () => {
    const email = screen.getByRole('textbox');

    await act(async () => {
      fireEvent.change(email, { target: { value: 'email@gmail.com' } });
    });
    expect(email).toHaveValue('email@gmail.com');
  });

  it('change password value on change event', async () => {
    const password = screen.getByPlaceholderText('Password');

    await act(async () => {
      fireEvent.change(password, { target: { value: 'asdf' } });
    });
    expect(password).toHaveValue('asdf');
  });

  it('calls forms onSubmit function on submit button click', async () => {
    const handleSubmit = jest.fn();
    const form = screen.getByRole('form') as HTMLFormElement;
    form.onsubmit = handleSubmit;

    const submit = screen.getByRole('button', { name: 'Sign in' });
    await act(async () => {
      form.values = {
        email: 'email@gmail.com',
        password: 'asdfasdf',
      };
      fireEvent.click(submit);
    });

    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it('should display required error when value is invalid', async () => {
    const submit = screen.getByRole('button', { name: 'Sign in' });
    await act(async () => {
      fireEvent.submit(submit);
    });

    const alerts = await screen.findAllByRole('alert');

    expect(alerts).toHaveLength(2);
  });

  it('should display matching error when email is invalid', async () => {
    const email = screen.getByRole('textbox') as HTMLInputElement;
    const password = screen.getByPlaceholderText('Password') as HTMLInputElement;
    const submit = screen.getByRole('button', { name: 'Sign in' });

    await act(async () => {
      fireEvent.change(email, {
        target: {
          value: 'test',
        },
      });

      fireEvent.change(password, {
        target: {
          value: 'password',
        },
      });

      fireEvent.submit(submit);
    });

    const alerts = await screen.findAllByRole('alert');

    expect(alerts).toHaveLength(1);
    expect(email.value).toBe('test');
    expect(password.value).toBe('password');
  });

  it('should display min length error when password is invalid', async () => {
    const email = screen.getByRole('textbox') as HTMLInputElement;
    const password = screen.getByPlaceholderText('Password') as HTMLInputElement;
    const submit = screen.getByRole('button', { name: 'Sign in' });

    await act(async () => {
      fireEvent.change(email, {
        target: {
          value: 'test@mail.com',
        },
      });

      fireEvent.change(password, {
        target: {
          value: 'pass',
        },
      });

      fireEvent.submit(submit);
    });

    const alerts = await screen.findAllByRole('alert');

    expect(alerts).toHaveLength(1);
    expect(email.value).toBe('test@mail.com');
    expect(password.value).toBe('pass');
  });

  it('should not display error when value is valid', async () => {
    const email = screen.getByRole('textbox') as HTMLInputElement;
    const password = screen.getByPlaceholderText('Password') as HTMLInputElement;
    const submit = screen.getByRole('button', { name: 'Sign in' });

    await act(async () => {
      fireEvent.change(email, {
        target: {
          value: 'test@mail.com',
        },
      });

      fireEvent.change(password, {
        target: {
          value: 'password',
        },
      });

      fireEvent.submit(submit);
    });

    await waitFor(() => expect(screen.queryAllByRole('alert')).toHaveLength(0));
    expect(email.value).toBe('');
    expect(password.value).toBe('');
  });
});

describe('Authentication form on sign up page', () => {
  beforeEach(async () => {
    await act(async () => {
      useMockRouter();

      render(
        <MockTheme>
          <AuthForm />
        </MockTheme>,
      );
    });
  });

  it('renders auth form', () => {
    const form = screen.getByRole('form');
    expect(form).toBeInTheDocument();

    const name = screen.getByPlaceholderText('Name');
    expect(name).toBeInTheDocument();
    expect(name).toHaveAttribute('type', 'text');

    const email = screen.getByPlaceholderText('Email');
    expect(email).toBeInTheDocument();
    expect(email).toHaveAttribute('type', 'email');

    const password = screen.getByPlaceholderText('Password');
    expect(password).toBeInTheDocument();
    expect(password).toHaveAttribute('type', 'password');

    const submit = screen.getByRole('button', { name: 'Sign up' });
    expect(submit).toBeInTheDocument();

    expect(form).toHaveFormValues({
      name: '',
      email: '',
      password: '',
    });

    const links = screen.getAllByRole('link');
    expect(links.length).toBe(6);
  });

  it('changes name value on change event', async () => {
    const name = screen.getByPlaceholderText('Name');

    await act(async () => {
      fireEvent.change(name, { target: { value: 'User' } });
    });
    expect(name).toHaveValue('User');
  });

  it('changes email value on change event', async () => {
    const email = screen.getByPlaceholderText('Email');

    await act(async () => {
      fireEvent.change(email, { target: { value: 'email@gmail.com' } });
    });
    expect(email).toHaveValue('email@gmail.com');
  });

  it('changes password value on change event', async () => {
    const password = screen.getByPlaceholderText('Password');

    await act(async () => {
      fireEvent.change(password, { target: { value: 'asdf' } });
    });
    expect(password).toHaveValue('asdf');
  });

  it('calls forms onSubmit function on submit button click', async () => {
    const handleSubmit = jest.fn();
    const form = screen.getByRole('form') as HTMLFormElement;
    form.onsubmit = handleSubmit;

    const submit = screen.getByRole('button', { name: 'Sign up' });
    await act(async () => {
      form.values = {
        name: 'User',
        email: 'email@gmail.com',
        password: 'asdfasdf',
      };
      fireEvent.click(submit);
    });

    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it('should display required error when value is invalid', async () => {
    const submit = screen.getByRole('button', { name: 'Sign up' });
    await act(async () => {
      fireEvent.submit(submit);
    });

    const alerts = await screen.findAllByRole('alert');

    expect(alerts).toHaveLength(3);
  });

  it('should display matching error when email is invalid', async () => {
    const name = screen.getByPlaceholderText('Name') as HTMLInputElement;
    const email = screen.getByPlaceholderText('Email') as HTMLInputElement;
    const password = screen.getByPlaceholderText('Password') as HTMLInputElement;
    const submit = screen.getByRole('button', { name: 'Sign up' });

    await act(async () => {
      fireEvent.change(name, {
        target: {
          value: 'User',
        },
      });

      fireEvent.change(email, {
        target: {
          value: 'test',
        },
      });

      fireEvent.change(password, {
        target: {
          value: 'password',
        },
      });

      fireEvent.submit(submit);
    });

    const alerts = await screen.findAllByRole('alert');

    expect(alerts).toHaveLength(1);
    expect(name.value).toBe('User');
    expect(email.value).toBe('test');
    expect(password.value).toBe('password');
  });

  it('should display min length error when password is invalid', async () => {
    const name = screen.getByPlaceholderText('Name') as HTMLInputElement;
    const email = screen.getByPlaceholderText('Email') as HTMLInputElement;
    const password = screen.getByPlaceholderText('Password') as HTMLInputElement;
    const submit = screen.getByRole('button', { name: 'Sign up' });

    await act(async () => {
      fireEvent.change(name, {
        target: {
          value: 'User',
        },
      });

      fireEvent.change(email, {
        target: {
          value: 'test@mail.com',
        },
      });

      fireEvent.change(password, {
        target: {
          value: 'pass',
        },
      });

      fireEvent.submit(submit);
    });

    const alerts = await screen.findAllByRole('alert');

    expect(alerts).toHaveLength(1);
    expect(name.value).toBe('User');
    expect(email.value).toBe('test@mail.com');
    expect(password.value).toBe('pass');
  });

  it('should not display error when value is valid', async () => {
    const name = screen.getByPlaceholderText('Name') as HTMLInputElement;
    const email = screen.getByPlaceholderText('Email') as HTMLInputElement;
    const password = screen.getByPlaceholderText('Password') as HTMLInputElement;
    const submit = screen.getByRole('button', { name: 'Sign up' });

    await act(async () => {
      fireEvent.change(name, {
        target: {
          value: 'User',
        },
      });

      fireEvent.change(email, {
        target: {
          value: 'test@mail.com',
        },
      });

      fireEvent.change(password, {
        target: {
          value: 'password',
        },
      });

      fireEvent.submit(submit);
    });

    await waitFor(() => expect(screen.queryAllByRole('alert')).toHaveLength(0));
    expect(name.value).toBe('');
    expect(email.value).toBe('');
    expect(password.value).toBe('');
  });
});

describe('Authentication password visibility', () => {
  beforeEach(async () => {
    await act(async () => {
      useMockRouter('/signin');

      render(
        <MockTheme>
          <AuthForm />
        </MockTheme>,
      );
    });
  });

  it('should toggle password visibility on eye icon click', async () => {
    const eye = screen.getByRole('button', { name: 'eye' });
    const password = screen.getByPlaceholderText('Password') as HTMLInputElement;

    expect(eye).toBeInTheDocument();
    expect(password).toHaveAttribute('type', 'password');

    await act(async () => {
      fireEvent.click(eye);
    });

    expect(password).toHaveAttribute('type', 'text');

    await act(async () => {
      fireEvent.click(eye);
    });

    expect(password).toHaveAttribute('type', 'password');
  });
});
