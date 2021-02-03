import { renderApi } from 'tests/utils';
import Hello from 'pages/api/hello';

describe('Homepage', () => {
  it('should return name John Doe', async () => {
    const response = await renderApi(Hello);

    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual({ name: 'John Doe' });
  });
});
