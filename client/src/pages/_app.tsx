import type { AppProps } from 'next/app';
import ErrorBoundary from 'src/components/ErrorBoundary/ErrorBoundary';
import MainLayout from 'src/components/MainLayout/MainLayout';
import GlobalStyle from 'src/styles/global.style';
import { theme } from 'src/styles/theme.style';
import { ThemeProvider } from 'styled-components';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <MainLayout>
          <GlobalStyle />
          <Component {...pageProps} />
        </MainLayout>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default MyApp;
