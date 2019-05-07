import { BaseNode } from '@babel/types';

export interface NodeProps<NodeType extends BaseNode> {
  node: NodeType;
  onUpdate: OnUpdate;
  kana: { [index: string]: string };
  noKana?: boolean;
}

export interface OnUpdate {
  (prev: NodeSnapshot, next: NodeSnapshot): void;
}

export interface NodeSnapshot {
  start: number;
  end: number;
  value: string;
}
