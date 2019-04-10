import * as t from '@babel/types';
import * as React from 'react';

type Props<NodeType> = {
  node: NodeType;
};

export function File(props: Props<t.File>) {
  return <Program node={props.node.program} />;
}

export function Program(props: Props<t.Program>) {
  return <div>{props.node.end}</div>;
}
