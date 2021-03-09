import {
  createGlobalStyle,
  ThemeProvider,
  DefaultTheme,
} from 'styled-components';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import useSession from 'hooks/useSession';
import Loading from './_loading';

export const theme: DefaultTheme = {
  colors: {
    background: '#fff',
    purple: '#71265E',
    lightpurple: '#A03585',
  },
};

const GlobalStyles = createGlobalStyle`
  html, body {
    padding: 0;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
      Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    background-color: ${({ theme }) => theme.colors.background}
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  * {
    box-sizing: border-box;
  }
`;

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  const [loggedIn] = useSession();

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <GlobalStyles />
      {loggedIn === undefined ? <Loading /> : <Component {...pageProps} />}
    </ThemeProvider>
  );
};

export default MyApp;
