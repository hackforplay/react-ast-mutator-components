import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Dispatch, Store } from 'redux';
import { Subject } from 'rxjs';
import { Action, ActionCreator } from 'typescript-fsa';
import { StoreContext } from './provider';
import { State } from './store';

type AnyAction = Action<any>;

export const useSelector = <T>(
  selector: (state: State) => T
): [T, Dispatch<AnyAction>] => {
  const store = useContext(StoreContext);
  const [state, setState] = useState(() => selector(store.getState()));

  const dispatch: Dispatch<AnyAction> = useCallback(
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

export const useActionEffect = <Payload>(
  actionCreator: ActionCreator<Payload>,
  sideEffect: (action: Action<Payload>, state: State) => void
) => {
  const store = useContext(StoreContext);
  const sideEffectRef = useRef(sideEffect);
  sideEffectRef.current = sideEffect;
  useEffect(() => {
    const subscription = getAction$(store).subscribe(([action, state]) => {
      if (actionCreator.match(action)) {
        sideEffectRef.current(action, state);
      }
    });
    return () => subscription.unsubscribe();
  }, [store]);
};

const storeAction$Map = new WeakMap<
  Store<State, AnyAction>,
  Subject<[AnyAction, State]>
>();

function getAction$(store: Store<State, AnyAction>) {
  const current = storeAction$Map.get(store);
  if (current) return current;
  const action$ = new Subject<[AnyAction, State]>();
  storeAction$Map.set(store, action$);
  return action$;
}
