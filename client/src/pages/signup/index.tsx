import { NextPage } from 'next';
import Head from 'next/head';
import AuthForm from 'src/components/AuthForm/AuthForm';

const SignUp: NextPage = () => {
  return (
    <>
      <Head>
        <title>Thullo - Sign up</title>
        <meta name="description" content="Sign up form" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <section>
        <AuthForm />
      </section>
    </>
  );
};

export default SignUp;
