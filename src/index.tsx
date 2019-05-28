import traverse from '@babel/traverse';
import * as t from '@babel/types';
import * as React from 'react';
import { File } from './components/AnyNodes';
import { NodeProps } from './components';

type NodeSnapshot = {
  start: number;
  end: number;
  value: string;
};

type OnUpdate = (prev: NodeSnapshot, next: NodeSnapshot) => void;

interface IRootContext {
  /**
   * Only active node
   */
  activeNode?: t.Node;
  /**
   * Make specify node active or reset to undefined
   */
  setActiveNode: (node?: t.Node) => void;
}

export const RootContext = React.createContext<IRootContext>({
  setActiveNode: () => {}
});

export interface RootProps extends NodeProps<t.File> {
  style?: React.CSSProperties;
}

export function Root(props: RootProps) {
  // Inverse relation of node tree
  const [childParentMap, setChildParentMap] = React.useState(
    new WeakMap<t.Node, t.Node>()
  );
  const getParentNodes = (node: t.Node): WeakSet<t.Node> => {
    const parent = childParentMap.get(node);
    return parent ? getParentNodes(parent).add(parent) : new WeakSet();
  };

  // Collapsing, editing, or selecting nodes (includes parents)
  const [activeNode, setActiveNode] = React.useState<t.Node>();

  React.useEffect(() => {
    // Initialize map
    const map = new WeakMap<t.Node, t.Node>();
    traverse(props.node, {
      enter(path) {
        map.set(path.node, path.parent);
      }
    });
    setChildParentMap(map);
  }, [props.node]);

  const onUpdate: OnUpdate = (prev, next) => {
    const increased = next.end - prev.end;
    if (increased !== 0) {
      // Keep start and end correctly
      traverse(props.node, {
        enter(path) {
          if (path.node.end === null || path.node.end < prev.end) return;
          path.node.end += increased;
          if (path.node.start === null || path.node.start < prev.end) return;
          path.node.start += increased;
        }
      });
    }
    props.onUpdate(prev, next);
  };
  return (
    <RootContext.Provider value={{ activeNode, setActiveNode }}>
      <div
        style={{
          overflow: 'scroll',
          fontFamily: `Menlo, "Lucida Console", monospace`,
          fontSize: '1.25rem',
          ...(props.style || {})
        }}
      >
        <File {...props} onUpdate={onUpdate} />
      </div>
    </RootContext.Provider>
  );
}
