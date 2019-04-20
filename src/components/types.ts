import { BaseNode } from '@babel/types';

export interface NodeProps<NodeType extends BaseNode> {
  node: NodeType;
  onUpdate: OnUpdate;
}

export interface OnUpdate {
  (prev: NodeSnapshot, next: NodeSnapshot): void;
}

export interface NodeSnapshot {
  start: number;
  end: number;
  value: string;
}
