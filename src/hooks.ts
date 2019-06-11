import { useCallback, useContext, useEffect, useState } from 'react';
import { Dispatch, Store } from 'redux';
import { Subject } from 'rxjs';
import { Action as BaseAction } from 'typescript-fsa';
import { StoreContext } from './provider';
import { State } from './store';

type Action = BaseAction<any>;

export const useSelector = <T>(
  selector: (state: State) => T
): [T, Dispatch<Action>] => {
  const store = useContext(StoreContext);
  const [state, setState] = useState(() => selector(store.getState()));

  const dispatch: Dispatch<Action> = useCallback(
    action => {
      const state = store.getState();
      getAction$(store).next([action, state]);
      return store.dispatch(action);
    },
    [store]
  );

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setState(selector(store.getState()));
    });
    return () => unsubscribe();
  }, [state]);

  return [state, dispatch];
};

export const useSideEffect = (
  sideEffect: (action: Action, state: State) => void
) => {
  const store = useContext(StoreContext);
  useEffect(() => {
    const subscription = getAction$(store).subscribe(([action, state]) =>
      sideEffect(action, state)
    );
    return () => subscription.unsubscribe();
  }, [store]);
};

const storeAction$Map = new WeakMap<
  Store<State, Action>,
  Subject<[Action, State]>
>();

function getAction$(store: Store<State, Action>) {
  const current = storeAction$Map.get(store);
  if (current) return current;
  const action$ = new Subject<[Action, State]>();
  storeAction$Map.set(store, action$);
  return action$;
}
