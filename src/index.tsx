import traverse from '@babel/traverse';
import * as t from '@babel/types';
import * as React from 'react';
import { File } from './components/AnyNodes';

type NodeSnapshot = {
  start: number;
  end: number;
  value: string;
};

type OnUpdate = (prev: NodeSnapshot, next: NodeSnapshot) => void;

type Props<NodeType> = {
  node: NodeType;
  onUpdate: OnUpdate;
};

export function Root(props: Props<t.File>) {
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
    <div style={{ overflow: 'scroll' }}>
      <File node={props.node} onUpdate={onUpdate} />
    </div>
  );
}
