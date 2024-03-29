import 'styled-components';

// Extend styled-components to add theme types
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      background: string;
      purple: string;
      lightpurple: string;
      red: string;
      lightred: string;
      green: string;
      lightgreen: string;
    };
  }
}
