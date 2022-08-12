import { NextPage } from 'next';
import Head from 'next/head';
import AuthForm from 'src/components/AuthForm/AuthForm';

const SignIn: NextPage = () => {
  return (
    <>
      <Head>
        <title>Thullo - Sign in</title>
        <meta name="description" content="Sign in form" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <section>
        <AuthForm />
      </section>
    </>
  );
};

export default SignIn;
