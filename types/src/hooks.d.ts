import { Dispatch } from 'redux';
import { Action, ActionCreator } from 'typescript-fsa';
import { State } from './store';
export declare const useSelector: <T>(selector: (state: State) => T) => [T, Dispatch<Action<any>>];
export declare const useActionEffect: <Payload>(actionCreator: ActionCreator<Payload>, sideEffect: (action: Action<Payload>, state: State) => void) => void;
//# sourceMappingURL=hooks.d.ts.map