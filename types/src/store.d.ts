import { BooleanLiteral, Node, NumericLiteral, StringLiteral } from '@babel/types';
declare type Literal = StringLiteral | NumericLiteral | BooleanLiteral;
export interface ChangePayload<T extends Literal> {
    /**
     * Proxy Node
     */
    node: T;
    prevValue: T['value'];
    nextValue: T['value'];
    prevString: string;
    nextString: string;
}
declare type InputPayload = {
    change: ChangePayload<Literal>;
};
export declare const actions: {
    input: {
        (payload: InputPayload, meta?: {
            [key: string]: any;
        } | null | undefined): import("typescript-fsa").Action<InputPayload>;
        type: string;
        match: (action: import("typescript-fsa").AnyAction) => action is import("typescript-fsa").Action<InputPayload>;
    };
    undo: import("typescript-fsa").ActionCreator<void>;
    redo: import("typescript-fsa").ActionCreator<void>;
    setActive: {
        (payload: {
            node: Node;
        }, meta?: {
            [key: string]: any;
        } | null | undefined): import("typescript-fsa").Action<{
            node: Node;
        }>;
        type: string;
        match: (action: import("typescript-fsa").AnyAction) => action is import("typescript-fsa").Action<{
            node: Node;
        }>;
    };
    clearActive: import("typescript-fsa").ActionCreator<void>;
};
export interface State {
    history: {
        changes: ChangePayload<Literal>[];
        current: number;
        canUndo: boolean;
        canRedo: boolean;
    };
    activeNode: Node | null;
}
export declare const reducer: (state: State | undefined, action: import("typescript-fsa").Action<any>) => State;
export {};
//# sourceMappingURL=store.d.ts.map