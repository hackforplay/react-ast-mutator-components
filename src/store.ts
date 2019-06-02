import { useEffect, useState } from 'react';
import { Dispatch, Store } from 'redux';

export interface State {}

export type Action = {
  type: 'undo';
};

const initialState = {};

export const reducer = (prevState: State = initialState, action: Action) => {
  return prevState;
};

export const useSelector = <T>(
  store: Store<State, Action>,
  selector: (state: State) => T
): [T, Dispatch<Action>] => {
  const [state, setState] = useState(() => selector(store.getState()));

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setState(selector(store.getState()));
    });
    return () => unsubscribe();
  }, [state]);

  return [state, store.dispatch];
};
