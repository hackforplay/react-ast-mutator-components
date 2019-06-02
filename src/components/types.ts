import { BaseNode } from '@babel/types';
import { Store } from 'redux';
import { Action, State } from '../store';

export interface NodeProps<NodeType extends BaseNode> {
  store: Store<State, Action>;
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
  type: 'input' | 'undo' | 'redo';
  undo: (update: Update) => void;
}
