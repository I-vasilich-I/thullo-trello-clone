import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import googleImg1 from 'public/images/search_1.svg';
import googleImg2 from 'public/images/search_2.svg';
import facebookImg1 from 'public/images/facebook_1.svg';
import facebookImg2 from 'public/images/facebook_2.svg';
import twitterImg1 from 'public/images/twitter_1.svg';
import twitterImg2 from 'public/images/twitter_2.svg';
import githubImg1 from 'public/images/github_1.svg';
import githubImg2 from 'public/images/github_2.svg';
import eye from 'public/images/eye.svg';
import eyeBlocked from 'public/images/eye-blocked.svg';

import {
  Form,
  Label,
  NameLabel,
  PasswordLabel,
  LogoContainer,
  FormTitle,
  SocialContainer,
  ImageWrap,
  EyeButton,
  StyledLink,
  Input,
  Button,
} from './AuthForm.style';
import Logo from 'src/elements/Logo/Logo';
import { useState } from 'react';

type PathName = '/signup' | '/signin';

interface IFormInputs {
  name?: string;
  email: string;
  password: string;
}

const SOCIAL_LINKS = [
  {
    img1: googleImg1,
    img2: googleImg2,
    alt: 'google',
    link: '/google',
  },
  {
    img1: facebookImg1,
    img2: facebookImg2,
    alt: 'facebook',
    link: '/facebook',
  },
  {
    img1: twitterImg1,
    img2: twitterImg2,
    alt: 'twitter',
    link: '/twitter',
  },
  {
    img1: githubImg1,
    img2: githubImg2,
    alt: 'github',
    link: '/github',
  },
];

const BOTTOM_LINKS = {
  '/signup': {
    text: 'Already a member?',
    linkText: 'Sign in',
    link: '/signin',
  },
  '/signin': {
    text: `Don't have an account yet?`,
    linkText: 'Sign up',
    link: '/signup',
  },
};

const schema = (withName = true) =>
  withName
    ? yup.object({
        name: yup.string().required(`Name's required`),
        email: yup.string().required(`Email's required`).email('Email is not valid'),
        password: yup.string().required(`Password's required`).min(8, `Password's less then 8 characters`),
      })
    : yup.object({
        email: yup.string().required(`Email's required`).email('Email is not valid'),
        password: yup.string().required(`Password's required`).min(8, `Password's less then 8 characters`),
      });

const AuthForm = () => {
  const { pathname } = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormInputs>({
    mode: 'onChange',
    resolver: yupResolver(schema(pathname === '/signup')),
  });

  const [visible, setVisible] = useState(false);
  const title = pathname === '/signin' ? 'Sign in' : 'Sign up';
  const { text, linkText, link: bottomLink } = BOTTOM_LINKS[pathname as PathName];
  const emailErrorMessage = errors.email?.message;
  const passwordErrorMessage = errors.password?.message;
  const nameErrorMessage = errors.name?.message;

  // TODO: implement signin/signup function.
  const onSubmit = ({ email, password }: IFormInputs) => {
    reset();
  };

  const handleClick = () => {
    setVisible((prev) => !prev);
  };

  return (
    <Form aria-label="form" onSubmit={handleSubmit(onSubmit)}>
      <LogoContainer>
        <Logo />
      </LogoContainer>
      <FormTitle>{title}</FormTitle>
      {pathname === '/signin' ? null : (
        <NameLabel>
          <Input {...register('name', { required: true })} type="text" id="name" placeholder="Name" />
          {nameErrorMessage ? <span role="alert">{nameErrorMessage}</span> : null}
        </NameLabel>
      )}
      <Label>
        <Input {...register('email', { required: true })} type="email" id="email" placeholder="Email" />
        {emailErrorMessage ? <span role="alert">{emailErrorMessage}</span> : null}
      </Label>
      <PasswordLabel>
        <Input
          {...register('password', { required: true })}
          type={visible ? 'text' : 'password'}
          id="password"
          placeholder="Password"
        />
        <EyeButton type="button" data-testid="visibility-toggle" onClick={handleClick}>
          <Image src={visible ? eye : eyeBlocked} alt="eye" />
        </EyeButton>
        {passwordErrorMessage ? <span role="alert">{passwordErrorMessage}</span> : null}
      </PasswordLabel>
      <Button type="submit">{title}</Button>
      <p>or continue with these social profiles</p>
      <SocialContainer>
        {SOCIAL_LINKS.map(({ img1, img2, alt, link }) => (
          <li key={alt}>
            <Link href={link} passHref>
              <StyledLink>
                <ImageWrap>
                  <Image src={img1} alt={alt} width="18px" height="18px" />
                </ImageWrap>
                <ImageWrap>
                  <Image src={img2} alt={alt} width="18px" height="18px" />
                </ImageWrap>
              </StyledLink>
            </Link>
          </li>
        ))}
      </SocialContainer>
      <p>
        {text}{' '}
        <Link href={bottomLink} passHref>
          <a>{linkText}</a>
        </Link>
      </p>
    </Form>
  );
};

export default AuthForm;
