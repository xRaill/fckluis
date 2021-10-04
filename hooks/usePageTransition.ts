import { createContext, useContext, useEffect, useState } from 'react';

const PageTransitionContext = createContext({
  component: undefined,
  setComponent(a) {
    this.component = a;
  },
});

type usePage = (children: React.ReactNode) => {
  TransitionComponent: React.ReactNode;
  state: number;
};

const usePageTransition: usePage = (children) => {
  const page = useContext(PageTransitionContext);
  const [state, setState] = useState(
    typeof page.component === 'undefined' ? 2 : 0
  );

  useEffect(() => {
    if (typeof page.component === 'undefined') {
      page.setComponent(children);
    } else if (state === 0) {
      setState(1);
      setTimeout(() => {
        setState(2);
        page.setComponent(children);
      }, 500);
    }
  }, []);

  return { TransitionComponent: page.component, state };
};

export default usePageTransition;
