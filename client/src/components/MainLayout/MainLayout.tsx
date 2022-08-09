import { ReactNode } from 'react';
import Header from '../Header/Header';

interface IProps {
  children?: ReactNode;
}

const MainLayout: React.FC<IProps> = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
};

export default MainLayout;
