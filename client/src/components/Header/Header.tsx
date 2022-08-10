import Link from 'next/link';
import Image from 'next/image';
import styled from 'styled-components';
import { LINKS } from 'src/constants';
import LogoImg from 'public/images/Logo.svg';
import { font } from 'src/styles/mixins.style';
import { HEADER_HEIGHT } from 'src/styles/variables.style';

interface ILinkProps {
  signUp?: boolean;
}

const StyledHeader = styled.header`
  position: fixed;
  top: 0;
  width: 100%;
  height: ${HEADER_HEIGHT};
  background-color: ${({ theme }) => theme.colors.$white};
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.05);
`;

const HeaderWrapper = styled.div`
  max-width: 1440px;
  width: 100%;
  height: 100%;
  padding: 0 24px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const HeaderLeft = styled.div`
  max-width: 554px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderRight = styled.div`
  max-width: 552px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const HeaderAuth = styled.div`
  display: flex;
  align-items: center;
`;

const StyledLink = styled.a<ILinkProps>`
  width: 80px;
  height: 35px;
  padding: 0.8rem 0.8rem;
  display: inline-block;
  text-decoration: none;
  text-align: center;
  white-space: nowrap;
  border: 1px solid transparent;
  border-radius: 6px;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out;

  ${({ theme }) =>
    font({
      size: '1.4rem',
      height: '1.6rem',
      color: theme.colors.$blue1,
      family: 'Noto Sans Bold',
      weight: 'bold',
      spacing: '0.035em',
    })}

  color: ${({ theme, signUp }) => (signUp ? theme.colors.$white : theme.colors.$blue1)};
  background-color: ${({ theme, signUp }) => (signUp ? theme.colors.$blue1 : 'transparent')};

  &:hover {
    background-color: ${({ theme, signUp }) => (signUp ? theme.colors.$blue2 : 'transparent')};
    text-decoration: ${({ signUp }) => (signUp ? 'none' : 'underline')};

    cursor: pointer;
  }
`;

const { SIGN_IN, SIGN_UP, HOME } = LINKS;

const Header = () => {
  return (
    <StyledHeader>
      <HeaderWrapper>
        <HeaderLeft>
          <Link href={HOME.href}>
            <a>
              <Image src={LogoImg} alt="logo" width={98} height={29} />
            </a>
          </Link>
        </HeaderLeft>
        <HeaderRight>
          <HeaderAuth>
            <Link href={SIGN_IN.href} passHref>
              <StyledLink>{SIGN_IN.title}</StyledLink>
            </Link>
            <Link href={SIGN_UP.href} passHref>
              <StyledLink signUp>{SIGN_UP.title}</StyledLink>
            </Link>
          </HeaderAuth>
        </HeaderRight>
      </HeaderWrapper>
    </StyledHeader>
  );
};

export default Header;
