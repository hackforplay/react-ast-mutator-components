import traverse from '@babel/traverse';
import * as t from '@babel/types';
import * as React from 'react';
import { NodeProps } from './components';
import { File } from './components/AnyNodes';
import { useActionEffect, useSelector } from './hooks';
import { Provider } from './provider';
import { actions } from './store';

export interface NodeSnapshot {
  start: number;
  end: number;
  value: string;
}

export interface Update {
  prev: NodeSnapshot;
  next: NodeSnapshot;
  type: 'input' | 'undo' | 'redo';
}

export interface RootProps extends NodeProps<t.File> {
  onUpdate: (update: Update) => void;
  style?: React.CSSProperties;
}

export function Root(props: RootProps) {
  return (
    <Provider>
      <RootWithoutProvider {...props} />
    </Provider>
  );
}

export function RootWithoutProvider(props: RootProps) {
  const onUpdate: typeof props.onUpdate = update => {
    const increased = update.next.end - update.prev.end;
    if (increased !== 0) {
      // Keep start and end correctly
      traverse(props.node, {
        enter(path) {
          if (path.node.end === null || path.node.end < update.prev.end) return;
          path.node.end += increased;
          if (path.node.start === null || path.node.start < update.prev.end)
            return;
          path.node.start += increased;
        }
      });
    }
    props.onUpdate(update);
  };

  useActionEffect(actions.input, (action, prevState) => {
    const { node, nextValue, prevString, nextString } = action.payload.change;
    const { start, end } = node;
    if (start === null || end === null) return;
    node.value = nextValue;
    onUpdate({
      type: 'input',
      prev: { start, end, value: prevString },
      next: {
        start,
        end: start + nextString.length,
        value: nextString
      }
    });
  });

  useActionEffect(actions.undo, (action, prevState) => {
    const change = prevState.history.changes[prevState.history.current - 1];
    if (!change) return;
    const { node, prevValue, prevString, nextString } = change;
    const { start, end } = node;
    if (start === null || end === null) return;
    node.value = prevValue;
    onUpdate({
      type: 'undo',
      prev: {
        start,
        end,
        value: nextString
      },
      next: {
        start,
        end: start + prevString.length,
        value: prevString
      }
    });
  });

  useActionEffect(actions.redo, (action, prevState) => {
    const change = prevState.history.changes[prevState.history.current];
    if (!change) return;
    const { node, nextValue, prevString, nextString } = change;
    const { start, end } = node;
    if (start === null || end === null) return;
    node.value = nextValue;
    onUpdate({
      type: 'redo',
      prev: { start, end, value: prevString },
      next: {
        start,
        end: start + nextString.length,
        value: nextString
      }
    });
  });

  // History
  const [history, dispatch] = useSelector(store => store.history);
  const undo = React.useCallback(() => dispatch(actions.undo()), []);
  const redo = React.useCallback(() => dispatch(actions.redo()), []);
  const clear = React.useCallback(() => dispatch(actions.clearHistory()), []);

  // Inverse relation of node tree
  const [childParentMap, setChildParentMap] = React.useState(
    new WeakMap<t.Node, t.Node>()
  );
  const getParentNodes = (node: t.Node): WeakSet<t.Node> => {
    const parent = childParentMap.get(node);
    return parent ? getParentNodes(parent).add(parent) : new WeakSet();
  };

  React.useEffect(() => {
    // Initialize map
    const map = new WeakMap<t.Node, t.Node>();
    traverse(props.node, {
      enter(path) {
        map.set(path.node, path.parent);
      }
    });
    setChildParentMap(map);
    clear();
  }, [props.node]);

  return (
    <div
      style={{
        overflow: 'scroll',
        fontFamily: `Menlo, "Lucida Console", monospace`,
        fontSize: '1.25rem',
        whiteSpace: 'pre',
        ...(props.style || {})
      }}
    >
      <button disabled={!history.canUndo} onClick={undo}>
        undo
      </button>
      <button disabled={!history.canRedo} onClick={redo}>
        redo
      </button>
      <File {...props} />
    </div>
  );
}

export { Provider };
