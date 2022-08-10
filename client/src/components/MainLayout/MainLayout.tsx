import { ReactNode } from 'react';
import { HEADER_HEIGHT } from 'src/styles/variables.style';
import styled from 'styled-components';
import Header from '../Header/Header';

interface IProps {
  children?: ReactNode;
}

const StyledMain = styled.main`
  padding-top: ${HEADER_HEIGHT};
`;

const StyledHeading = styled.h1`
  position: fixed;
  overflow: hidden;
  height: 1px;
  width: 1px;
  padding: 0;
  border: 0;
`;

const MainLayout: React.FC<IProps> = ({ children }) => {
  return (
    <>
      <StyledHeading>Thullo</StyledHeading>
      <Header />
      <StyledMain>{children}</StyledMain>
    </>
  );
};

export default MainLayout;
