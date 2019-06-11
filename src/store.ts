import {
  BooleanLiteral,
  Node,
  NumericLiteral,
  StringLiteral
} from '@babel/types';
import actionCreatorFactory from 'typescript-fsa';
import { reducerWithImmer } from './utils';

type Literal = StringLiteral | NumericLiteral | BooleanLiteral;
export interface ChangePayload<T extends Literal> {
  node: T;
  prevValue: T['value'];
  nextValue: T['value'];
  prevString: string;
  nextString: string;
  forceUpdate: () => void;
}

type InputPayload = {
  change: ChangePayload<Literal>;
};

const actionCreators = actionCreatorFactory('react-ast-mutator-components');
export const actions = {
  input: actionCreators<InputPayload>('INPUT'),
  undo: actionCreators('UNDO'),
  redo: actionCreators('REDO'),
  setActive: actionCreators<{ node: Node }>('SET_ACTIVE'),
  clearActive: actionCreators('CLEAR_ACTIVE')
};

export interface State {
  history: {
    changes: ChangePayload<Literal>[];
    current: number;
    canUndo: boolean;
    canRedo: boolean;
  };
  activeNode: Node | null;
}

const initialState: State = {
  history: {
    changes: [],
    current: 0,
    canUndo: false,
    canRedo: false
  },
  activeNode: null
};

export const reducer = reducerWithImmer(initialState)
  .case(actions.input, ({ history }, payload) => {
    history.changes.splice(history.current);
    history.changes.push(payload.change);
    history.current++;
    history.canUndo = true;
    history.canRedo = false;
  })
  .case(actions.undo, ({ history }) => {
    history.current--;
    history.canUndo = history.current > 0;
    history.canRedo = true;
  })
  .case(actions.redo, ({ history }) => {
    if (!history.canRedo) return;

    history.current++;
    history.canUndo = true;
    history.canRedo = history.current < history.changes.length;
  })
  .case(actions.setActive, (draft, payload) => {
    draft.activeNode = payload.node;
  })
  .case(actions.clearActive, draft => {
    draft.activeNode = null;
  })
  .toReducer();
