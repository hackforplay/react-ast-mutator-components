import { BaseNode } from '@babel/types';
import { Store } from 'redux';
import { Action, State } from '../store';

export interface NodeProps<NodeType extends BaseNode> {
  store: Store<State, Action>;
  node: NodeType;
  kana: { [index: string]: string };
  noKana?: boolean;
}
