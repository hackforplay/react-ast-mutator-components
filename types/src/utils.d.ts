import { Action, ActionCreator } from 'typescript-fsa';
/**
 * Create forceUpdate.
 * forceUpdate function identity is stable and won’t change on re-renders.
 */
export declare const useForceUpdate: () => () => void;
declare type AnyAction = Action<any>;
interface ReducerBuilder<State> {
    case<Payload>(actionCreator: ActionCreator<Payload>, handler: (draft: State, payload: Payload) => void): ReducerBuilder<State>;
    toReducer(): (state: State | undefined, action: AnyAction) => State;
}
/**
 * reducerWithImmer({})
 *  .case(actions.hoge, draft => {
 *    draft.fuga ++;
 *  })
 */
export declare function reducerWithImmer<State>(initialState: State): ReducerBuilder<State>;
export {};
//# sourceMappingURL=utils.d.ts.map