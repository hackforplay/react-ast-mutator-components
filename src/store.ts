import { BooleanLiteral, NumericLiteral, StringLiteral } from '@babel/types';
import { useCallback, useEffect, useState } from 'react';
import { Dispatch, Store } from 'redux';
import { Subject } from 'rxjs';

type Literal = StringLiteral | NumericLiteral | BooleanLiteral;
export interface ChangePayload<T extends Literal> {
  node: T;
  prevValue: T['value'];
  nextValue: T['value'];
  prevString: string;
  nextString: string;
  forceUpdate: () => void;
}

export interface State {
  history: {
    changes: ChangePayload<Literal>[];
    current: number;
    canUndo: boolean;
    canRedo: boolean;
  };
}

export type Action =
  | {
      type: 'input';
      payload: {
        change: ChangePayload<Literal>;
      };
    }
  | {
      type: 'undo';
    }
  | {
      type: 'redo';
    };

const initialState: State = {
  history: {
    changes: [],
    current: 0,
    canUndo: false,
    canRedo: false
  }
};

export const reducer = (
  prevState: State = initialState,
  action: Action
): State => {
  switch (action.type) {
    case 'input':
      return {
        ...prevState,
        history: {
          changes: prevState.history.changes
            .slice(0, prevState.history.current)
            .concat(action.payload.change),
          current: prevState.history.current + 1,
          canUndo: true,
          canRedo: false
        }
      };
    case 'undo':
      if (!prevState.history.canUndo) return prevState;
      return {
        ...prevState,
        history: {
          changes: prevState.history.changes,
          current: prevState.history.current - 1,
          canUndo: prevState.history.current - 1 > 0,
          canRedo: true
        }
      };
    case 'redo':
      if (!prevState.history.canRedo) return prevState;
      return {
        ...prevState,
        history: {
          changes: prevState.history.changes,
          current: prevState.history.current + 1,
          canUndo: true,
          canRedo:
            prevState.history.current + 1 < prevState.history.changes.length
        }
      };
    default:
      return prevState;
  }
};

const storeAction$Map = new WeakMap<
  Store<State, Action>,
  Subject<[Action, State]>
>();
const getAction$ = (store: Store<State, Action>) => {
  const current = storeAction$Map.get(store);
  if (current) return current;
  const action$ = new Subject<[Action, State]>();
  storeAction$Map.set(store, action$);
  return action$;
};

export const useSelector = <T>(
  store: Store<State, Action>,
  selector: (state: State) => T
): [T, Dispatch<Action>] => {
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
  store: Store<State, Action>,
  sideEffect: (action: Action, state: State) => void
) => {
  useEffect(() => {
    const subscription = getAction$(store).subscribe(([action, state]) =>
      sideEffect(action, state)
    );
    return () => subscription.unsubscribe();
  }, [store]);
};
