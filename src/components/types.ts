import { Node } from '@babel/types';

export interface NodeProps<NodeType extends Node> {
  node: NodeType;
  kana: { [index: string]: string };
  noKana?: boolean;
}
