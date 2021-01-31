import * as t from '@babel/types';
import * as React from 'react';
declare type InputMutatorProps = {
    type: t.NumericLiteral['type'] | t.StringLiteral['type'] | t.BooleanLiteral['type'];
    defaultValue: string;
    onUpdate: (value: string) => void;
    onEnd: () => void;
    width: string | number;
    style?: React.CSSProperties;
};
export declare function InputMutator(props: InputMutatorProps): JSX.Element;
export {};
//# sourceMappingURL=InputMutator.d.ts.map