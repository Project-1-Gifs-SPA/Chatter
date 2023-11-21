import { createContext } from 'react';

const AppContext = createContext({
  user: null,
  userData: null,
  setContext() {
  },
  userIsLoggedIn: false,
  setLoggedIn: () => { },

});

export default AppContext;