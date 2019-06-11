import produce from 'immer';
import { useCallback, useState } from 'react';
import { Action, ActionCreator } from 'typescript-fsa';

/**
 * Create forceUpdate.
 * forceUpdate function identity is stable and won’t change on re-renders.
 */
export const useForceUpdate = () => {
  const [, setState] = useState({});
  return useCallback(() => setState({}), []);
};

type AnyAction = Action<any>;

interface ReducerBuilder<State> {
  case<Payload>(
    actionCreator: ActionCreator<Payload>,
    handler: (draft: State, payload: Payload) => void
  ): ReducerBuilder<State>;
  toReducer(): (state: State | undefined, action: AnyAction) => State;
}

/**
 * reducerWithImmer({})
 *  .case(actions.hoge, draft => {
 *    draft.fuga ++;
 *  })
 */
export function reducerWithImmer<State>(
  initialState: State
): ReducerBuilder<State> {
  const cases: {
    [type: string]: (draft: State, payload: any) => void;
  } = {};

  const builder: ReducerBuilder<State> = {
    case(actionCreator, handler) {
      if (process.env.NODE_ENV !== 'production') {
        if (typeof actionCreator.type !== 'string') {
          throw new Error(`ActionCreator must has string member "type"`);
        }
        if (actionCreator.type in cases) {
          throw new Error(`${actionCreator.type} is already set in reducer!`);
        }
        if (typeof handler !== 'function') {
          throw new Error(`Invalid handler set with "${actionCreator.type}"`);
        }
      }
      cases[actionCreator.type] = handler;
      return builder;
    },
    toReducer() {
      return (state, action) => {
        const handler = cases[action.type];
        return handler
          ? produce<State, State>(state || initialState, draft =>
              handler(draft, action.payload)
            )
          : state || initialState;
      };
    }
  };
  return builder;
}
