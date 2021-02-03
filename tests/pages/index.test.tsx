import { renderPage, screen } from 'tests/utils';

describe('Homepage', () => {
  it('should render text', async () => {
    await renderPage('/');

    const text = screen.getByText(/Hello world!/i);

    expect(text).toBeInTheDocument();
  });
});
