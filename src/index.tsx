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

export interface RootProps extends NodeProps<t.File> {
  style?: React.CSSProperties;
}

export function Root(props: RootProps) {
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
    <div style={{ overflow: 'scroll', ...(props.style || {}) }}>
      <File {...props} onUpdate={onUpdate} />
    </div>
  );
}
