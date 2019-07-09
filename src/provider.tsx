import * as React from 'react';
import { createStore } from 'redux';
import { reducer } from './store';

const getStore = () => createStore(reducer);

export const StoreContext = React.createContext(getStore());

export const Provider = (props: { children: React.ReactNode }) => {
  const [store] = React.useState(getStore);
  return (
    <StoreContext.Provider value={store}>
      {props.children}
    </StoreContext.Provider>
  );
};
