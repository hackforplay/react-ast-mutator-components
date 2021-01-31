import * as t from '@babel/types';
import * as React from 'react';
import { NodeProps } from './components';
import { Provider } from './provider';
export interface NodeSnapshot {
    start: number;
    end: number;
    value: string;
}
export interface Update {
    prev: NodeSnapshot;
    next: NodeSnapshot;
    type: 'input' | 'undo' | 'redo';
}
export interface RootProps extends NodeProps<t.File> {
    onUpdate: (update: Update) => void;
    style?: React.CSSProperties;
}
export declare function Root(props: RootProps): JSX.Element;
export declare function RootWithoutProvider(props: RootProps): JSX.Element;
export { Provider };
//# sourceMappingURL=root.d.ts.map