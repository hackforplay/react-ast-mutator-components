import { BaseNode } from '@babel/types';

export interface NodeProps<NodeType extends BaseNode> {
  node: NodeType;
  kana: { [index: string]: string };
  noKana?: boolean;
}
