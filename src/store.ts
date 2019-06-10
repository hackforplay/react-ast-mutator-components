import { BooleanLiteral, NumericLiteral, StringLiteral } from '@babel/types';

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
