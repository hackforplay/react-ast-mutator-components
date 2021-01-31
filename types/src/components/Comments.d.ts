/// <reference types="react" />
import * as t from '@babel/types';
export interface CommentBlockProps {
    comment: t.CommentBlock;
}
export declare function CommentBlock(props: CommentBlockProps): JSX.Element;
export interface CommentLineProps {
    comment: t.CommentLine;
}
export declare function CommentLine(props: CommentLineProps): JSX.Element;
export interface CommentsProps {
    comments: ReadonlyArray<t.Comment> | null;
}
export declare function Comments(props: CommentsProps): JSX.Element | null;
//# sourceMappingURL=Comments.d.ts.map