import * as t from '@babel/types';
import * as React from 'react';

export interface NotImplementedProps {
  node: t.Node;
}

export function NotImplemented(props: NotImplementedProps): JSX.Element {
  console.log(props.node);
  throw new Error(`Not Implemented: <${props.node.type} />`);
}
