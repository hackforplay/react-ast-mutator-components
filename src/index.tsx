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
   * Check specify node which is active
   */
  isNodeActive: (node: t.Node) => boolean;
  /**
   * Make specify node and its parents active
   */
  setNodeActive: (node: t.Node) => void;
  /**
   * Make specify node passive but make its parents active
   */
  setNodePassive: (node: t.Node) => void;
}

export const RootContext = React.createContext<IRootContext>({
  isNodeActive: () => false,
  setNodeActive: () => {},
  setNodePassive: () => {}
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
  const [activeNodes, setActiveNodes] = React.useState(new WeakSet<t.Node>());
  const isNodeActive = (node: t.Node) => activeNodes.has(node);
  const setNodeActive = (node: t.Node) =>
    setActiveNodes(getParentNodes(node).add(node));
  const setNodePassive = (node: t.Node) => setActiveNodes(getParentNodes(node));

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
    <RootContext.Provider
      value={{ isNodeActive, setNodeActive, setNodePassive }}
    >
      <div style={{ overflow: 'scroll', ...(props.style || {}) }}>
        <File {...props} onUpdate={onUpdate} />
      </div>
    </RootContext.Provider>
  );
}
