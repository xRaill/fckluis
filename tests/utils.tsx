import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from 'pages/_app';
import { getPage } from 'next-page-tester';
import { makeRenderMethods } from 'next-page-tester/dist/makeRenderMethods';
import { apiResolver } from 'next/dist/next-server/server/api-utils';
import { NextApiRequest, NextApiResponse } from 'next';
import { createServer, IncomingMessage } from 'http';
import listen from 'test-listen';
import fetch from 'node-fetch';

const Providers = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

type renderParameters = Parameters<typeof render>;
type renderComponent = (
  ui: renderParameters[0],
  options?: renderParameters[1]
) => ReturnType<typeof render>;

const renderComponent: renderComponent = (ui, options = {}) =>
  render(ui, { wrapper: Providers, ...options });

type renderPage = (
  route: string
) => Promise<ReturnType<ReturnType<typeof makeRenderMethods>['render']>>;

const renderPage: renderPage = (route) =>
  getPage({ route }).then(({ render }) => render());

type renderApi = (
  apiFunction: (req: NextApiRequest, res: NextApiResponse) => void,
  request?: Partial<IncomingMessage>
) => Promise<Response>;

const renderApi: renderApi = async (handler, request) => {
  const server = createServer((req, res) =>
    apiResolver(
      Object.assign(req, request),
      res,
      undefined,
      handler,
      undefined,
      undefined
    )
  );

  const url = await listen(server);
  const response = await fetch(url);
  server.close();
  return response;
};

export { screen } from '@testing-library/react';

export { renderComponent, renderPage, renderApi };
