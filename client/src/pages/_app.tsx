import type { AppProps } from 'next/app';
import ErrorBoundary from 'src/components/ErrorBoundary/ErrorBoundary';
import GlobalStyle from 'src/styles/global.style';
import { theme } from 'src/styles/theme.style';
import { ThemeProvider } from 'styled-components';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Component {...pageProps} />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default MyApp;
