import styled from 'styled-components';
import { font } from 'src/styles/mixins.style';

const Form = styled.form`
  max-width: 473px;
  min-width: 300px;
  width: 100%;
  height: 544px;
  padding: 48px 58px 28px 58px;
  border: 1px solid ${({ theme }) => theme.colors.$grey4};
  border-radius: 24px;
  margin: 10vh auto 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  p {
    ${({ theme }) =>
      font({
        size: '1.4rem',
        height: '1.9rem',
        color: theme.colors.$grey3,
        family: 'Noto Sans',
        weight: 'normal',
        spacing: '-0.035em',
      })}

    text-align: center;

    a:focus-visible {
      outline: dotted 2px ${({ theme }) => theme.colors.$grey4};
    }

    a:active {
      color: ${({ theme }) => theme.colors.$grey3};
    }
  }

  @media (max-width: 473px) {
    padding: 48px 20px 28px 20px;
  }
`;

const Label = styled.label`
  position: relative;
  width: 100%;
  margin-bottom: 14px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &::before {
    content: '';
    position: absolute;
    top: 16px;
    left: 14px;
    width: 20px;
    height: 16px;
    background: url('/images/envelope.svg');
    background-size: 20px 16px;
  }

  & > span {
    position: absolute;
    bottom: -15px;
    padding-top: 5px;
    padding-left: 5px;

    ${({ theme }) =>
      font({
        size: '1.2rem',
        height: '1.2rem',
        color: theme.colors.$red,
        family: 'Noto Sans',
        weight: 'normal',
        spacing: '-0.035em',
      })}
  }
`;

const NameLabel = styled(Label)`
  &::before {
    top: 14px;
    width: 20px;
    height: 20px;
    background: url('/images/account_circle.svg');
    background-size: 20px 20px;
  }
`;

const PasswordLabel = styled(Label)`
  margin-bottom: 22px;

  &::before {
    top: 13px;
    left: 16px;
    width: 16px;
    height: 21px;
    background: url('/images/padlock.svg');
    background-size: 16px 21px;
  }
`;

const EyeButton = styled.button`
  position: absolute;
  background: transparent;
  border: none;
  width: 20px;
  height: 20px;
  top: 17px;
  right: 15px;
  outline: none;

  &:focus-visible {
    filter: invert(100%) sepia(10%) saturate(7500%) hue-rotate(185deg) brightness(100%) contrast(110%);
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 27px;
  transition: all 0.3s ease-in-out;

  a:focus,
  &:hover {
    outline: none;
    transform: scale(1.1);
  }
`;

const FormTitle = styled.h2`
  margin-bottom: 27px;
  ${({ theme }) =>
    font({
      size: '1.8rem',
      height: '2.5rem',
      color: theme.colors.$grey1,
      family: 'Noto Sans',
      weight: '600',
      spacing: '-0.035em',
    })}
`;

const SocialContainer = styled.ul`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 230px;

  li {
    list-style: none;
  }
`;

const ImageWrap = styled.span`
  width: 18px;
  height: 18px;
  position: absolute;
  transition: all 0.3s ease-in-out;
`;

const StyledLink = styled.a`
  position: relative;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ theme }) => theme.colors.$grey3};
  border-radius: 50%;
  cursor: pointer;
  outline: none;

  & > span {
    &:last-child {
      opacity: 0;
    }
  }

  &:hover,
  &:focus {
    & > span {
      transform: scale(1.4);

      &:last-child {
        opacity: 100;
      }

      &:first-child {
        opacity: 0;
      }
    }
  }
`;

const Input = styled.input`
  width: 100%;
  height: 48px;
  padding: 13px 47px;
  border: 1px solid ${({ theme }) => theme.colors.$grey4};
  border-radius: 8px;
  outline: none;

  ${({ theme }) =>
    font({
      size: '1.6rem',
      height: '2.2rem',
      color: theme.colors.$grey3,
      family: 'Noto Sans',
      weight: 'normal',
      spacing: '-0.035em',
    })}

  &:focus {
    box-shadow: inset 0 1px 0 0 rgba(102, 191, 255, 0.5), 0 0 0 4px rgba(0, 149, 255, 0.15);
  }
`;

const Button = styled.button`
  width: 100%;
  height: 38px;
  background: ${({ theme }) => theme.colors.$blue1};
  border-radius: 8px;
  outline: none;
  text-align: center;
  border: none;
  transition: transform 0.1s ease-in;

  &:hover {
    cursor: pointer;
    opacity: 80%;
    transition: opacity 0.3s ease-in-out;
  }

  &:active {
    transform: translate(1px, 3px);
  }

  &:focus {
    opacity: 80%;
  }

  ${({ theme }) =>
    font({
      size: '1.6rem',
      height: '2.2rem',
      color: theme.colors.$white,
      family: 'Noto Sans',
      weight: '600',
      spacing: '-0.035em',
    })}
`;

export {
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
};
