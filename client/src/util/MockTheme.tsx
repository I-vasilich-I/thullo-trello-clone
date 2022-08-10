import { ReactNode } from 'react';
import { theme } from 'src/styles/theme.style';
import { ThemeProvider } from 'styled-components';

interface Props {
  children: ReactNode;
}

const MockTheme: React.FC<Props> = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default MockTheme;
