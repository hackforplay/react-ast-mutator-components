import { parse } from '@babel/parser';
import { File } from '@babel/types';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Root } from './';

export function render(
  props: RootComponentProps,
  container: Element,
  callback?: () => void
) {
  return ReactDOM.render(<RootComponent {...props} />, container, callback);
}

export interface RootComponentProps {
  code: string;
  kana: { [index: string]: string };
  style?: React.CSSProperties;
  debug?: boolean;
  onChange(code: string): void;
  onError(error: Error): void;
}

export function RootComponent(props: RootComponentProps) {
  props.debug && console.time();
  const [file, error] = tryParse(props.code);
  props.debug && console.timeEnd();
  props.debug && file && console.info(file);

  React.useEffect(() => {
    error && props.onError(error);
  }, [error]);

  if (!file || error) {
    return null;
  }

  return (
    <Root
      node={file}
      kana={props.kana || {}}
      onUpdate={({ prev, next }) => {
        const code =
          props.code.slice(0, prev.start) +
          next.value +
          props.code.slice(prev.end);
        props.onChange(code);
      }}
      style={props.style}
    />
  );
}

function tryParse(code: string): [File | undefined, Error | undefined] {
  try {
    const file = parse(code, {
      sourceType: 'module',
      allowAwaitOutsideFunction: true
    });
    return [file, undefined];
  } catch (error) {
    return [undefined, error as Error];
  }
}
