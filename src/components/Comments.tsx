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
  return <span style={{ color: 'gray' }}>// {value}</span>;
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
