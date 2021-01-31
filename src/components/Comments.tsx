import * as t from '@babel/types';
import * as React from 'react';

export interface CommentBlockProps {
  comment: t.CommentBlock;
}

export function CommentBlock(props: CommentBlockProps) {
  const { value } = props.comment;
  return (
    <div style={{ color: 'gray' }}>
      <span>/* </span>
      <span>{value}</span>
      <span> */</span>
    </div>
  );
}

export interface CommentLineProps {
  comment: t.CommentLine;
}

export function CommentLine(props: CommentLineProps) {
  const { value } = props.comment;
  return <div style={{ color: 'gray' }}>//{value}</div>;
}

export interface CommentsProps {
  comments: ReadonlyArray<t.Comment> | null;
}

export function Comments(props: CommentsProps) {
  if (!props.comments || props.comments.length === 0) {
    return null;
  }
  return (
    <>
      {props.comments.map((comment, i) =>
        comment.type === 'CommentBlock' ? (
          <CommentBlock key={i} comment={comment} />
        ) : (
          <CommentLine key={i} comment={comment} />
        )
      )}
    </>
  );
}

export interface CommentsBetweenProps {
  comments?: ReadonlyArray<t.Comment> | null;
  from: number;
  to?: number;
}

export function CommentsBetween(props: CommentsBetweenProps) {
  const { comments, from, to } = props;
  return React.useMemo(() => {
    if (!comments || !to) {
      return null;
    }
    return (
      <Comments
        comments={comments.filter(
          c => c.loc.end.line >= from && c.loc.start.line <= to
        )}
      />
    );
  }, [comments, from, to]);
}
