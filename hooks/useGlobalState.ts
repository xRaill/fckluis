import { createGlobalState } from 'react-hooks-global-state';

interface globalState {
  loggedIn: boolean | undefined;
  accessToken: string;
}

export const { useGlobalState } = createGlobalState({
  loggedIn: undefined,
  accessToken: '',
} as globalState);
