import { BaseNode } from '@babel/types';

export interface NodeProps<NodeType extends BaseNode> {
  node: NodeType;
  onUpdate: OnUpdate;
  kana: { [index: string]: string };
  noKana?: boolean;
}

export interface OnUpdate {
  (update: Update): void;
}

export interface NodeSnapshot {
  start: number;
  end: number;
  value: string;
}

export interface Update {
  prev: NodeSnapshot;
  next: NodeSnapshot;
  type: 'input' | 'undo';
  undo: () => void;
}
