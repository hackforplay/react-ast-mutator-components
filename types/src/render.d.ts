import * as React from 'react';
export declare function render(props: RootComponentProps, container: Element, callback?: () => void): void;
export interface RootComponentProps {
    code: string;
    kana: {
        [index: string]: string;
    };
    style?: React.CSSProperties;
    debug?: boolean;
    onChange(code: string): void;
    onError(error: Error): void;
}
export declare function RootComponent(props: RootComponentProps): JSX.Element | null;
//# sourceMappingURL=render.d.ts.map